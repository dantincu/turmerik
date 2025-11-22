using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Cloneables;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface IClnblTypesCsCodeGenerator
    {
        ClnblTypesCsCodeGeneratorOutput Generate(
            ClnblTypesCsCodeGeneratorOpts opts);
    }

    public class ClnblTypesCsCodeGeneratorOpts
    {
        public SyntaxNode CompilationUnit { get; set; }
    }

    public class ClnblTypesCsCodeGeneratorOutput
    {
        public SyntaxNode CompilationUnit { get; set; }
    }

    public class ClnblTypesCsCodeGenerator : IClnblTypesCsCodeGenerator
    {
        public const string GENERATED_CS_REGION_NAME_CORE = "GENERATED-CODE";
        public const string GENERATED_CS_REGION_NAME_TPL = GENERATED_CS_REGION_NAME_CORE + "-{0}";

        public static readonly string ClnblIntfAttrName = AttrH.GetAttrName(nameof(ClnblIntfAttribute));

        public ClnblTypesCsCodeGeneratorOutput Generate(
            ClnblTypesCsCodeGeneratorOpts opts)
        {
            var wka = new WorkArgs
            {
                Opts = opts,
                RootNode = opts.CompilationUnit,
            };

            Run(wka);
            GenerateOutput(wka);
            return wka.Output;
        }

        private static bool IsClnblIntfAttr(
            string attrTypeName) => attrTypeName == ClnblIntfAttrName || attrTypeName == nameof(ClnblIntfAttribute);


        private void Run(WorkArgs wka)
        {
            if (wka.RootNode.IsKind(SyntaxKind.CompilationUnit))
            {
                var node = (CompilationUnitSyntax)wka.RootNode;
                wka.Unit = new(node, new());
                RunCompilationUnit(wka);
            }
            else
            {
                throw new TrmrkException($"Root node kind not supported: {wka.RootNode.Kind()}");
            }
        }

        private void RunCompilationUnit(WorkArgs wka)
        {
            var currentUnit = wka.Unit;
            var dataTypes = currentUnit.DataTypes;

            wka.Unit.Node.ChildNodesAndTokens();

            foreach (var node in wka.Unit.Node.ChildNodes())
            {
                var kind = node.Kind();

                if (!TryGetDataTypeDeclaration(
                    wka, node, kind,
                    dataTypes.RootItems,
                    out var typeT))
                {
                    switch (kind)
                    {
                        case SyntaxKind.NamespaceDeclaration:
                        case SyntaxKind.FileScopedNamespaceDeclaration:
                            var namespaceDirective = new NamespaceDirectiveT(node, node.Kind());
                            namespaceDirective.IsFileScoped = namespaceDirective.Kind == SyntaxKind.FileScopedNamespaceDeclaration;

                            if (namespaceDirective.IsFileScoped)
                            {
                                var namespaceDeclr = (FileScopedNamespaceDeclarationSyntax)node;
                                namespaceDirective.Namespace = namespaceDeclr.Name.ToFullString().Trim();
                            }
                            else
                            {
                                var namespaceDeclr = (NamespaceDeclarationSyntax)node;
                                namespaceDirective.Namespace = namespaceDeclr.Name.ToFullString().Trim();
                            }

                            foreach (var childNode in node.ChildNodes())
                            {
                                var childNodeKind = childNode.Kind();

                                if (TryGetDataTypeDeclaration(
                                    wka, childNode, childNodeKind,
                                    dataTypes.RootItems, out typeT))
                                {
                                    typeT!.Namespace = namespaceDirective;
                                }
                            }

                            break;
                    }
                }
            }
        }

        private bool TryGetDataTypeDeclaration(
            WorkArgs wka,
            SyntaxNode node,
            SyntaxKind kind,
            List<IDataTypeDeclarationT> typesList,
            out IDataTypeDeclarationT? typeT)
        {
            bool retVal = false;
            typeT = null;
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
                foreach (var childNode in node.ChildNodes())
                {
                    var childNodeKind = childNode.Kind();

                    if (TryGetDataTypeDeclaration(
                        wka, childNode, childNodeKind,
                        typeT!.NestedTypes, out var nestedTypeT))
                    {
                        nestedTypeT!.EnclosingType = typeT;
                    }
                }
            }

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
                    throw new TrmrkException($"Kind {args.Node.Kind} is not a data type declaration");
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

        private void GenerateOutput(
            WorkArgs wka)
        {
            var rootNodes = wka.RootNode.ChildNodes();

            wka.Output = new()
            {
                CompilationUnit = SyntaxFactory.CompilationUnit().WithMembers(
                    SyntaxFactory.List(rootNodes.OfType<MemberDeclarationSyntax>()))
            };

        }

        private class RunDataTypeDeclarationArgs
        {
            public WorkArgs Wka { get; set; }
            public SyntaxNode Node { get; set; }
            public SyntaxKind Kind { get; set; }
            public NamespaceDirectiveT NamespaceDirective { get; set; }
        }
    }
}
