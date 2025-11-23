using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using Turmerik.Core.Cloneables;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface IClnblTypesCsCodeParser
    {
        void Parse(WorkArgs wka);
    }

    public class ClnblTypesCsCodeParser : IClnblTypesCsCodeParser
    {
        public const string GENERATED_CODE_CS_REGION_NAME = "GENERATED-CODE";

        public static readonly string ClnblIntfAttrName = AttrH.GetAttrName(nameof(ClnblIntfAttribute));

        public void Parse(WorkArgs wka)
        {
            if (wka.RootNode.IsKind(SyntaxKind.CompilationUnit))
            {
                var node = (CompilationUnitSyntax)wka.RootNode;
                wka.Unit = new(node);
                RunCompilationUnit(wka);
            }
            else
            {
                throw new TrmrkException($"Root node kind not supported: {wka.RootNode.Kind()}");
            }
        }

        private static bool IsClnblIntfAttr(
            string attrTypeName) => attrTypeName == ClnblIntfAttrName || attrTypeName == nameof(ClnblIntfAttribute);

        private void RunCompilationUnit(WorkArgs wka)
        {
            var currentUnit = wka.Unit;
            var dataTypes = currentUnit.DataTypes;
            wka.ParentNode = currentUnit;

            IterateChildNodesAndTokens(new ()
            {
                Wka = wka,
                NodeHandler = (_, nodeT) =>
                {
                    var node = nodeT.Node;
                    var kind = nodeT.Kind;

                    foreach (var trivia in node.GetLeadingTrivia())
                    {
                        var triviaKind = trivia.Kind();

                        switch (triviaKind)
                        {
                            case SyntaxKind.RegionDirectiveTrivia:
                                var region = (RegionDirectiveTriviaSyntax)trivia.GetStructure()!;
                                var regionChildNodes = region.ChildNodes();
                                break;
                            case SyntaxKind.EndRegionDirectiveTrivia:
                                var endRegion = (EndRegionDirectiveTriviaSyntax)trivia.GetStructure()!;
                                break;
                        }
                    }

                    if (!TryGetDataTypeDeclaration(
                        wka, node, kind,
                        dataTypes.RootItems,
                        out var typeT))
                    {
                        switch (kind)
                        {
                            case SyntaxKind.NamespaceDeclaration:
                            case SyntaxKind.FileScopedNamespaceDeclaration:
                                INamespaceTCore @namespace;
                                bool isFileScoped = kind == SyntaxKind.FileScopedNamespaceDeclaration;

                                if (isFileScoped)
                                {
                                    var namespaceDeclr = (FileScopedNamespaceDeclarationSyntax)node;

                                    @namespace = new FileScopedNamespaceT(namespaceDeclr)
                                    {
                                        Name = namespaceDeclr.Name.ToFullString().Trim()
                                    };
                                }
                                else
                                {
                                    var namespaceDeclr = (NamespaceDeclarationSyntax)node;

                                    @namespace = new NamespaceT(namespaceDeclr)
                                    {
                                        Name = namespaceDeclr.Name.ToFullString().Trim()
                                    };
                                }

                                foreach (var childNode in node.ChildNodes())
                                {
                                    var childNodeKind = childNode.Kind();

                                    if (TryGetDataTypeDeclaration(
                                        wka, childNode, childNodeKind,
                                        dataTypes.RootItems, out typeT))
                                    {
                                        typeT!.Namespace = @namespace;
                                    }
                                }

                                break;
                        }
                    }
                },
                TokenHandler = (_, nodeT) =>
                {
                    var node = nodeT.Node;
                    var kind = nodeT.Kind;

                    switch (kind)
                    {
                        case SyntaxKind.EndOfFileToken:
                            if (node.HasLeadingTrivia)
                            {
                                var leadingTrivia = node.LeadingTrivia;
                            }
                            break;
                    }
                },
            });
        }

        private bool TryGetDataTypeDeclaration(
            WorkArgs wka,
            SyntaxNode node,
            SyntaxKind kind,
            List<IDataTypeDeclarationT> typesList,
            out IDataTypeDeclarationT? outTypeT)
        {
            bool retVal = false;
            IDataTypeDeclarationT? typeT = null;
            var currentUnit = wka.Unit;
            var dataTypes = currentUnit.DataTypes;

            switch (kind)
            {
                case SyntaxKind.ClassDeclaration:
                case SyntaxKind.InterfaceDeclaration:
                case SyntaxKind.StructDeclaration:
                    typeT = RunDataTypeDeclaration(
                        new()
                        {
                            Wka = wka,
                            Node = node,
                            Kind = kind,
                        });

                    typesList.Add(typeT);
                    retVal = true;
                    break;
            }

            if (retVal)
            {
                var prevParent = wka.ParentNode;
                wka.ParentNode = (INodeT)wka.CurrentToken;

                IterateChildNodesAndTokens(new()
                {
                    Wka = wka,
                    NodeHandler = (_, childNode) =>
                    {
                        if (TryGetDataTypeDeclaration(
                            wka, childNode.Node, childNode.Kind,
                            typeT!.NestedTypes, out var nestedTypeT))
                        {
                            nestedTypeT!.EnclosingType = typeT;
                        }
                    },
                    TokenHandler = (_, node) =>
                    {
                    }
                });

                wka.ParentNode = prevParent;
            }

            outTypeT = typeT;
            return retVal;
        }

        private IDataTypeDeclarationT RunDataTypeDeclaration(
            RunDataTypeDeclarationArgs args)
        {
            var currentUnit = args.Wka.Unit;
            var dataTypes = currentUnit.DataTypes;

            if (dataTypes.ParentItem != null)
            {
                dataTypes.PrevParentItems.Push(dataTypes.ParentItem);
            }

            dataTypes.ParentItem = dataTypes.CurrentItem;
            IDataTypeDeclarationT typeT;

            switch (args.Kind)
            {
                case SyntaxKind.ClassDeclaration:
                    typeT = dataTypes.CurrentItem = new ClassDeclarationT(
                        (ClassDeclarationSyntax)args.Node);

                    RunClassDeclaration(args.Wka);
                    break;
                case SyntaxKind.InterfaceDeclaration:
                    typeT = dataTypes.CurrentItem = new InterfaceDeclarationT(
                        (InterfaceDeclarationSyntax)args.Node);

                    RunInterfaceDeclaration(args.Wka);
                    break;
                case SyntaxKind.StructDeclaration:
                    typeT = dataTypes.CurrentItem = new StructDeclarationT(
                        (StructDeclarationSyntax)args.Node);

                    RunStructDeclaration(args.Wka);
                    break;
                default:
                    throw new TrmrkException($"Kind {args.Kind} is not a data type declaration");
            }

            dataTypes.CurrentItem = dataTypes.ParentItem;

            if (dataTypes.PrevParentItems.Any())
            {
                dataTypes.ParentItem = dataTypes.PrevParentItems.Pop();
            }

            return typeT;
        }

        private void RunClassDeclaration(
            WorkArgs wka)
        {
            var currentUnit = wka.Unit;
            var dataTypes = currentUnit.DataTypes;
            var current = (ClassDeclarationT)dataTypes.CurrentItem!;
            current.Name = current.Node.Identifier.Text;
        }

        private void RunInterfaceDeclaration(
            WorkArgs wka)
        {
            var currentUnit = wka.Unit;
            var dataTypes = currentUnit.DataTypes;
            var current = (InterfaceDeclarationT)dataTypes.CurrentItem!;
            current.Name = current.Node.Identifier.Text;
            var attrsListsList = current.Node.AttributeLists;

            var attrList = current.Node.AttributeLists.SelectMany(
                list => list.Attributes);

            foreach (var attr in attrList)
            {
                var name = attr.Name.ToFullString();

                if (IsClnblIntfAttr(name))
                {
                    current.HasClnblIntfAttr = true;
                    var argsList = attr.ArgumentList;

                    if (argsList != null)
                    {
                        var typeNamesArr = argsList.Arguments.Select(arg =>
                        {
                            var expr = arg.Expression;
                            string? name = null;

                            if (expr is TypeOfExpressionSyntax typeOfExpr)
                            {
                                var typeSyntax = typeOfExpr.Type;

                                if (typeSyntax is IdentifierNameSyntax id)
                                {
                                    name = id.ToFullString();
                                }
                                else if (typeSyntax is QualifiedNameSyntax qn)
                                {
                                    name = qn.ToFullString();
                                }
                            }

                            return name;
                        }).NotNull().ToArray();

                        if (typeNamesArr.Length > 0)
                        {
                            current.ImmtblTypeName = typeNamesArr[0];

                            if (typeNamesArr.Length > 1)
                            {
                                current.MtblTypeName = typeNamesArr[1];
                            }
                        }
                    }

                    break;
                }
            }
        }

        private void RunStructDeclaration(
            WorkArgs wka)
        {
            var currentUnit = wka.Unit;
            var dataTypes = currentUnit.DataTypes;
            var current = (StructDeclarationT)dataTypes.CurrentItem!;
            current.Name = current.Node.Identifier.Text;
        }

        private void IterateChildNodesAndTokens(IterateChildNodesAndTokensArgs args)
        {
            int idx = 0;
            var wka = args.Wka;
            var unit = wka.Unit;

            foreach (var childNodeOrToken in wka.ParentNode.GetNode(
                ).ChildNodesAndTokens())
            {
                NodeT? nodeT = null;
                TokenT? tokenT = null;

                if (childNodeOrToken.IsNode)
                {
                    var node = childNodeOrToken.AsNode()!;

                    nodeT = new NodeT(
                        node, node.Kind());

                    wka.CurrentToken = nodeT;
                    wka.CurrentToken.Index = idx;

                    AddTrivias(wka,
                        node.GetLeadingTrivia(),
                        node.GetTrailingTrivia());

                    args.NodeHandler(wka, nodeT);
                }
                else if (childNodeOrToken.IsToken)
                {
                    var node = childNodeOrToken.AsToken();

                    tokenT = new TokenT(
                        node, node.Kind());

                    wka.CurrentToken = tokenT;
                    wka.CurrentToken.Index = idx;

                    AddTrivias(wka,
                        node.LeadingTrivia,
                        node.TrailingTrivia);

                    args.TokenHandler(wka, tokenT);
                }

                wka.ParentNode.ChildNodesOrTokens.Add(wka.CurrentToken);
                idx++;
            }
        }

        private void AddTrivias(
            WorkArgs wka,
            SyntaxTriviaList leadingSyntaxTrivias,
            SyntaxTriviaList trailingSyntaxTrivias)
        {
            AddTrivias(wka,
                leadingSyntaxTrivias,
                wka.CurrentToken.LeadingTriviaList);

            AddTrivias(wka,
                trailingSyntaxTrivias,
                wka.CurrentToken.TrailingTriviaList);
        }

        private void AddTrivias(
            WorkArgs wka,
            SyntaxTriviaList syntaxTrivias,
            List<ITriviaTCore> list)
        {
            int idx = 0;

            foreach (var trivia in syntaxTrivias)
            {
                var triviaTCore = CreateTriviaT(trivia);
                triviaTCore.Index = idx++;
                list.Add(triviaTCore);
            }
        }

        private ITriviaTCore CreateTriviaT(
            SyntaxTrivia trivia)
        {
            ITriviaTCore triviaTCore;
            var structure = trivia.GetStructure();

            if (structure != null)
            {
                var kind = trivia.Kind();

                switch (kind)
                {
                    case SyntaxKind.RegionDirectiveTrivia:
                        triviaTCore = new StructuredTriviaT<StartRegionDirectiveT>(trivia, kind)
                        {
                            Structure = new StartRegionDirectiveT(
                                (RegionDirectiveTriviaSyntax)structure, structure.Kind())
                        };
                        break;
                    case SyntaxKind.EndRegionDirectiveTrivia:
                        triviaTCore = new StructuredTriviaT<EndRegionDirectiveT>(trivia, kind)
                        {
                            Structure = new EndRegionDirectiveT(
                                (EndRegionDirectiveTriviaSyntax)structure, structure.Kind())
                        };
                        break;
                    default:
                        triviaTCore = new StructuredTriviaT<NodeT>(trivia, kind)
                        {
                            Structure = new NodeT(
                                structure, structure.Kind())
                        };
                        break;
                }

            }
            else
            {
                triviaTCore = new TriviaT(trivia, trivia.Kind());
            }

            return triviaTCore;
        }

        private class RunDataTypeDeclarationArgs
        {
            public WorkArgs Wka { get; set; }
            public SyntaxNode Node { get; set; }
            public SyntaxKind Kind { get; set; }
        }

        public class IterateChildNodesAndTokensArgs
        {
            public WorkArgs Wka { get; set; }
            public Action<WorkArgs, NodeT> NodeHandler { get; set; }
            public Action<WorkArgs, TokenT> TokenHandler { get; set; }
        }
    }
}
