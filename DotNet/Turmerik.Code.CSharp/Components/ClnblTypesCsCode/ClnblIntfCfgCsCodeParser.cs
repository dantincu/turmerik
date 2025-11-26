using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface IClnblIntfCfgCsCodeParser
    {
        ClnblIntfCfgData Parse(
            SyntaxList<MemberDeclarationSyntax> membersList);
    }

    public class ClnblIntfCfgData
    {
        public INameOrTypeT[] ItemTypes { get; set; }
    }

    public class ClnblIntfCfgCsCodeParser : IClnblIntfCfgCsCodeParser
    {
        private readonly ITypeSyntaxParser typeSyntaxParser;

        public ClnblIntfCfgCsCodeParser(
            ITypeSyntaxParser typeSyntaxParser)
        {
            this.typeSyntaxParser = typeSyntaxParser ?? throw new ArgumentNullException(
                nameof(typeSyntaxParser));
        }

        public ClnblIntfCfgData Parse(
            SyntaxList<MemberDeclarationSyntax> membersList)
        {
            var itemsProp = (PropertyDeclarationSyntax)membersList.Single();
            var exprBody = itemsProp.ExpressionBody!;
            var arrExpr = (CollectionExpressionSyntax)exprBody.Expression;

            var retArr = arrExpr.Elements.Select(element =>
            {
                var objCreation = (ObjectCreationExpressionSyntax)((ExpressionElementSyntax)element).Expression;
                var typeName = typeSyntaxParser.Parse(objCreation.Type);

                return typeName;
            }).ToArray();

            return new ClnblIntfCfgData
            {
                ItemTypes = retArr,
            };
        }
    }
}
