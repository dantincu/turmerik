using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface INamespaceSyntaxParser
    {
        INamespaceTCore Parse(
            BaseNamespaceDeclarationSyntax node,
            SyntaxKind kind);
    }

    public class NamespaceSyntaxParser : INamespaceSyntaxParser
    {
        private readonly ITypeSyntaxParser typeSyntaxParser;

        public NamespaceSyntaxParser(
            ITypeSyntaxParser typeSyntaxParser)
        {
            this.typeSyntaxParser = typeSyntaxParser ?? throw new ArgumentNullException(
                nameof(typeSyntaxParser));
        }

        public INamespaceTCore Parse(
            BaseNamespaceDeclarationSyntax node,
            SyntaxKind kind)
        {
            INamespaceTCore @namespace;
            bool isFileScoped = kind == SyntaxKind.FileScopedNamespaceDeclaration;
            BaseNamespaceDeclarationSyntax baseNamespaceDeclr;

            if (isFileScoped)
            {
                var namespaceDeclr = (FileScopedNamespaceDeclarationSyntax)node;
                baseNamespaceDeclr = namespaceDeclr;
                @namespace = new FileScopedNamespaceT(namespaceDeclr);
            }
            else
            {
                var namespaceDeclr = (NamespaceDeclarationSyntax)node;
                baseNamespaceDeclr = namespaceDeclr;
                @namespace = new NamespaceT(namespaceDeclr);
            }

            @namespace.NameStr = baseNamespaceDeclr.Name.ToFullString().Trim();
            @namespace.Name = typeSyntaxParser.Parse(node.Name);

            return @namespace;
        }
    }
}
