using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Turmerik.Core.Utility;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface INodeOrTokenOrTrivia
    {
        SyntaxKind Kind { get; }
        int Index { get; set; }
    }

    public interface ITriviaTCore : INodeOrTokenOrTrivia
    {
        SyntaxTrivia Node { get; }
        bool HasStructure { get; }
    }

    public interface IStructuredTriviaTCore : ITriviaTCore
    {
        INodeT? GetStructure();
    }

    public interface IStructuredTriviaT<TStructure> : IStructuredTriviaTCore
        where TStructure : INodeT
    {
        TStructure? Structure { get; }
    }

    public interface INodeOrTokenTCore : INodeOrTokenOrTrivia
    {
        List<ITriviaTCore> LeadingTriviaList { get; }
        List<ITriviaTCore> TrailingTriviaList { get; }
        List<INodeOrTokenTCore> ChildNodesOrTokens { get; }

        bool IsNode { get; }
        bool IsToken { get; }
    }

    public interface INodeOrTokenT<TNode> : INodeOrTokenTCore
    {
        List<IRegionDirectiveT> LeadingRegionDirectives { get; }

        TNode GetNode();
    }

    public interface ITokenT : INodeOrTokenT<SyntaxToken>
    {
    }

    public interface INodeT : INodeOrTokenT<SyntaxNode>
    {
    }

    public interface IRegionDirectiveT : INodeT
    {
        string Name { get; set; }
        bool IsStartRegion { get; }
        int? GeneratedCodeRegionIdx { get; set; }
    }

    public interface IDataTypeDeclarationT : INodeT
    {
        List<IDataTypeDeclarationT> NestedTypes { get; }
        string Name { get; set; }
        INamespaceTCore? Namespace { get; set; }
        IDataTypeDeclarationT? EnclosingType { get; set; }
    }

    public interface INamespaceTCore : INodeOrTokenTCore
    {
        string Name { get; set; }
        abstract bool IsFileScoped { get; }
    }

    public class WorkArgs
    {
        public ClnblTypesCsCodeGeneratorOpts Opts { get; set; }
        public ClnblTypesCsCodeGeneratorOutput Output { get; set; }

        public SyntaxNode RootNode { get; set; }
        public CompilationUnitT Unit { get; set; }

        public INodeT ParentNode { get; set; }
        public INodeOrTokenTCore CurrentToken { get; set; }
    }

    public abstract class TokenTBase<TNode> : INodeOrTokenT<TNode>
    {
        protected TokenTBase(SyntaxKind kind)
        {
            LeadingTriviaList = new();
            TrailingTriviaList = new();
            ChildNodesOrTokens = new();
            Kind = kind;
        }

        protected TokenTBase(INodeOrTokenTCore src) : this(src.Kind)
        {
            LeadingTriviaList.AddRange(
                src.LeadingTriviaList);

            TrailingTriviaList.AddRange(
                src.TrailingTriviaList);

            ChildNodesOrTokens.AddRange(
                src.ChildNodesOrTokens);

            LeadingRegionDirectives = new();
            Index = src.Index;
        }

        public List<ITriviaTCore> LeadingTriviaList { get; }
        public List<ITriviaTCore> TrailingTriviaList { get; }
        public List<INodeOrTokenTCore> ChildNodesOrTokens { get; }

        public List<IRegionDirectiveT> LeadingRegionDirectives { get; }
        public int Index { get; set; }
        public SyntaxKind Kind { get; set; }

        public abstract bool IsNode { get; }
        public abstract bool IsToken { get; }

        public abstract TNode GetNode();
    }

    public class TokenT : TokenTBase<SyntaxToken>, ITokenT
    {
        public TokenT(
            SyntaxToken node,
            SyntaxKind kind) : base(kind)
        {
            Node = node;
        }

        public TokenT(
            SyntaxToken node,
            INodeOrTokenTCore src) : base(src)
        {
            Node = node;
        }

        public SyntaxToken Node { get; }

        public override bool IsNode => false;
        public override bool IsToken => true;

        public override SyntaxToken GetNode() => Node;
    }

    public abstract class TriviaTBase : ITriviaTCore
    {
        public TriviaTBase(
            SyntaxTrivia node,
            SyntaxKind kind)
        {
            Node = node;
            Kind = kind;
        }

        public SyntaxTrivia Node { get; }
        public virtual bool HasStructure => false;
        public SyntaxKind Kind { get; }
        public int Index { get; set; }
    }

    public class TriviaT : TriviaTBase
    {
        public TriviaT(SyntaxTrivia node, SyntaxKind kind) : base(node, kind)
        {
        }

        public override bool HasStructure => false;
    }

    public abstract class StructuredTriviaTBase : TriviaTBase, ITriviaTCore
    {
        public StructuredTriviaTBase(
            SyntaxTrivia node,
            SyntaxKind kind) : base(node, kind)
        {
        }

        public override bool HasStructure => true;

        public abstract INodeT? GetStructure();
    }

    public class StructuredTriviaT<TStructure> : StructuredTriviaTBase, IStructuredTriviaT<TStructure>
        where TStructure : INodeT
    {
        public StructuredTriviaT(SyntaxTrivia node, SyntaxKind kind) : base(node, kind)
        {
        }

        public StructuredTriviaT(ITriviaTCore src) : base(src.Node, src.Kind)
        {
            Index = src.Index;
        }

        public TStructure? Structure { get; set; }

        public override INodeT? GetStructure() => Structure;
    }

    public abstract class NodeTBase<TNode> : TokenTBase<SyntaxNode>, INodeT
        where TNode : SyntaxNode
    {
        protected NodeTBase(
            TNode node,
            SyntaxKind kind) : base(kind)
        {
            Node = node;
        }

        protected NodeTBase(
            TNode node,
            INodeOrTokenTCore src) : base(src)
        {
            Node = node;
        }

        public TNode Node { get; set; }

        public override bool IsNode => true;
        public override bool IsToken => false;

        public override SyntaxNode GetNode() => Node;
    }

    public class NodeT : NodeTBase<SyntaxNode>
    {
        public NodeT(SyntaxNode node, SyntaxKind kind) : base(node, kind)
        {
        }

        public NodeT(SyntaxNode node, INodeOrTokenTCore src) : base(node, src)
        {
        }
    }

    public abstract class RegionDirectiveTBase<TNode> : NodeTBase<TNode>, IRegionDirectiveT
        where TNode : SyntaxNode
    {
        protected RegionDirectiveTBase(TNode node, SyntaxKind kind) : base(node, kind)
        {
        }

        protected RegionDirectiveTBase(TNode node, INodeOrTokenTCore src) : base(node, src)
        {
        }

        public string Name { get; set; }
        public abstract bool IsStartRegion { get; }
        public int? GeneratedCodeRegionIdx { get; set; }
    }

    public class StartRegionDirectiveT : RegionDirectiveTBase<RegionDirectiveTriviaSyntax>
    {
        public StartRegionDirectiveT(RegionDirectiveTriviaSyntax node, SyntaxKind kind) : base(node, kind)
        {
        }

        public StartRegionDirectiveT(RegionDirectiveTriviaSyntax node, INodeOrTokenTCore src) : base(node, src)
        {
        }

        public override bool IsStartRegion => true;
    }

    public class EndRegionDirectiveT : RegionDirectiveTBase<EndRegionDirectiveTriviaSyntax>
    {
        public EndRegionDirectiveT(EndRegionDirectiveTriviaSyntax node, SyntaxKind kind) : base(node, kind)
        {
        }

        public EndRegionDirectiveT(EndRegionDirectiveTriviaSyntax node, INodeOrTokenTCore src) : base(node, src)
        {
        }

        public override bool IsStartRegion => true;
    }

    public class CompilationUnitT : NodeTBase<CompilationUnitSyntax>
    {
        public CompilationUnitT(
            CompilationUnitSyntax node) : base(
                node, SyntaxKind.CompilationUnit)
        {
            DataTypes = new ();
        }

        public CompilationUnitT(
            CompilationUnitSyntax node,
            INodeOrTokenTCore src) : base(
                node, src)
        {
            DataTypes = new();
        }

        public DataTreeTraversalArgsCore<IDataTypeDeclarationT> DataTypes { get; }
    }

    public abstract class NamespaceTBase<TNode> : NodeTBase<TNode>, INamespaceTCore
        where TNode : SyntaxNode
    {
        protected NamespaceTBase(
            TNode node) : base(node, SyntaxKind.NamespaceDeclaration)
        {
        }

        protected NamespaceTBase(
            TNode node,
            INodeOrTokenTCore src) : base(node, src)
        {
        }

        public string Name { get; set; }
        public abstract bool IsFileScoped { get; }
    }

    public class NamespaceT : NamespaceTBase<NamespaceDeclarationSyntax>
    {
        public NamespaceT(NamespaceDeclarationSyntax node) : base(node)
        {
        }

        public NamespaceT(NamespaceDeclarationSyntax node, INodeOrTokenTCore src) : base(node, src)
        {
        }

        public override bool IsFileScoped => false;
    }

    public class FileScopedNamespaceT : NamespaceTBase<FileScopedNamespaceDeclarationSyntax>
    {
        public FileScopedNamespaceT(FileScopedNamespaceDeclarationSyntax node) : base(node)
        {
        }

        public FileScopedNamespaceT(FileScopedNamespaceDeclarationSyntax node, INodeOrTokenTCore src) : base(node, src)
        {
        }

        public override bool IsFileScoped => true;
    }

    public abstract class DataTypeDeclarationTBase<TNode> : NodeTBase<TNode>, IDataTypeDeclarationT
        where TNode : SyntaxNode
    {
        protected DataTypeDeclarationTBase(
            TNode node,
            SyntaxKind kind) : base(
                node, kind)
        {
            NestedTypes = new ();
        }

        protected DataTypeDeclarationTBase(
            TNode node,
            INodeOrTokenTCore src) : base(
                node, src)
        {
            NestedTypes = new();
        }

        public List<IDataTypeDeclarationT> NestedTypes { get; }
        public string Name { get; set; }
        public INamespaceTCore? Namespace { get; set; }
        public IDataTypeDeclarationT? EnclosingType { get; set; }
    }

    public class ClassDeclarationT : DataTypeDeclarationTBase<ClassDeclarationSyntax>
    {
        public ClassDeclarationT(
            ClassDeclarationSyntax node) : base(
                node, SyntaxKind.ClassDeclaration)
        {
        }

        public ClassDeclarationT(
            ClassDeclarationSyntax node, INodeOrTokenTCore src) : base(
                node, src)
        {
        }
    }

    public class InterfaceDeclarationT : DataTypeDeclarationTBase<InterfaceDeclarationSyntax>
    {
        public InterfaceDeclarationT(
            InterfaceDeclarationSyntax node) : base(
                node, SyntaxKind.InterfaceDeclaration)
        {
        }

        public InterfaceDeclarationT(
            InterfaceDeclarationSyntax node, INodeOrTokenTCore src) : base(
                node, src)
        {
        }

        public bool HasClnblIntfAttr { get; set; }
        public string? ImmtblTypeName { get; set; }
        public string? MtblTypeName { get; set; }
    }

    public class StructDeclarationT : DataTypeDeclarationTBase<StructDeclarationSyntax>
    {
        public StructDeclarationT(
            StructDeclarationSyntax node) : base(
                node, SyntaxKind.StructDeclaration)
        {
        }

        public StructDeclarationT(
            StructDeclarationSyntax node, INodeOrTokenTCore src) : base(
                node, src)
        {
        }
    }
}
