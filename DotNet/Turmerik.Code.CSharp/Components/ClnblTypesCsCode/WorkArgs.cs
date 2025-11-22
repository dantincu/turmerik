using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface INodeT
    {
        SyntaxKind Kind { get; }

        SyntaxNode GetNode();
    }

    public interface IDataTypeDeclarationT : INodeT
    {
        List<IDataTypeDeclarationT> NestedTypes { get; set; }
        string Name { get; set; }
        NamespaceDirectiveT? Namespace { get; set; }
        IDataTypeDeclarationT? EnclosingType { get; set; }
    }

    public class WorkArgs
    {
        public ClnblTypesCsCodeGeneratorOpts Opts { get; set; }
        public ClnblTypesCsCodeGeneratorOutput Output { get; set; }

        public SyntaxNode RootNode { get; set; }
        public CompilationUnitT Unit { get; set; }
    }

    public abstract class NodeTBase : INodeT
    {
        protected NodeTBase(SyntaxKind kind)
        {
            Kind = kind;
        }

        public SyntaxKind Kind { get; set; }

        public abstract SyntaxNode GetNode();
    }

    public abstract class NodeTBase<TNode> : NodeTBase
        where TNode : SyntaxNode
    {
        protected NodeTBase(
            TNode node,
            SyntaxKind kind) : base(kind)
        {
            Node = node;
        }

        public TNode Node { get; set; }

        public override SyntaxNode GetNode() => Node;
    }

    public class CompilationUnitT : NodeTBase<CompilationUnitSyntax>
    {
        public CompilationUnitT(
            CompilationUnitSyntax node,
            DataTreeTraversalArgsCore<IDataTypeDeclarationT> dataTypes) : base(
                node, SyntaxKind.CompilationUnit)
        {
            DataTypes = dataTypes;
        }

        public DataTreeTraversalArgsCore<IDataTypeDeclarationT> DataTypes { get; set; }
    }

    public class NamespaceDirectiveT : NodeTBase<SyntaxNode>
    {
        public NamespaceDirectiveT(SyntaxNode node, SyntaxKind kind) : base(node, kind)
        {
        }

        public string Namespace { get; set; }
        public bool IsFileScoped { get; set; }
    }

    public abstract class DataTypeDeclarationTBase<TNode> : NodeTBase<TNode>, IDataTypeDeclarationT
        where TNode : SyntaxNode
    {
        protected DataTypeDeclarationTBase(
            TNode node,
            SyntaxKind kind,
            List<IDataTypeDeclarationT>? nestedTypes = null) : base(
                node, kind)
        {
            NestedTypes = nestedTypes ?? new ();
        }

        public List<IDataTypeDeclarationT> NestedTypes { get; set; }
        public string Name { get; set; }
        public NamespaceDirectiveT? Namespace { get; set; }
        public IDataTypeDeclarationT? EnclosingType { get; set; }
    }

    public class ClassDeclarationT : DataTypeDeclarationTBase<ClassDeclarationSyntax>
    {
        public ClassDeclarationT(
            ClassDeclarationSyntax node,
            List<IDataTypeDeclarationT>? nestedTypes = null) : base(
                node, SyntaxKind.ClassDeclaration, nestedTypes)
        {
        }
    }

    public class InterfaceDeclarationT : DataTypeDeclarationTBase<InterfaceDeclarationSyntax>
    {
        public InterfaceDeclarationT(
            InterfaceDeclarationSyntax node,
            List<IDataTypeDeclarationT>? nestedTypes = null) : base(
                node, SyntaxKind.InterfaceDeclaration, nestedTypes)
        {
        }

        public bool HasClnblIntfAttr { get; set; }
        public string? ImmtblTypeName { get; set; }
        public string? MtblTypeName { get; set; }
    }

    public class StructDeclarationT : DataTypeDeclarationTBase<StructDeclarationSyntax>
    {
        public StructDeclarationT(
            StructDeclarationSyntax node,
            List<IDataTypeDeclarationT>? nestedTypes = null) : base(
                node, SyntaxKind.StructDeclaration, nestedTypes)
        {
        }
    }
}
