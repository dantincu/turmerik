using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface IClnblIntfCfgTypesCsCodeParser
    {
        ClnblIntfCfgTypesData Parse(
            SyntaxList<MemberDeclarationSyntax> membersList);
    }

    public class ClnblIntfCfgTypesData
    {
        public ClnblIntfCfgTypesItemData[] Items { get; set; }
    }

    public class ClnblIntfCfgTypesItemData
    {
        public INameOrTypeT? IntfType { get; set; }
        public INameOrTypeT? ImmtblType { get; set; }
        public INameOrTypeT? MtblType { get; set; }
    }

    public class ClnblIntfCfgTypesCsCodeParser : IClnblIntfCfgTypesCsCodeParser
    {
        private readonly ITypeSyntaxParser typeSyntaxParser;

        public ClnblIntfCfgTypesCsCodeParser(
            ITypeSyntaxParser typeSyntaxParser)
        {
            this.typeSyntaxParser = typeSyntaxParser ?? throw new ArgumentNullException(
                nameof(typeSyntaxParser));
        }

        public ClnblIntfCfgTypesData Parse(
            SyntaxList<MemberDeclarationSyntax> membersList)
        {
            var itemsProp = (PropertyDeclarationSyntax)membersList.Single();
            var exprBody = itemsProp.ExpressionBody!;
            var arrExpr = (CollectionExpressionSyntax)exprBody.Expression;

            var retArr = arrExpr.Elements.Select(element =>
            {
                var retObj = new ClnblIntfCfgTypesItemData();
                var objCreation = (ImplicitObjectCreationExpressionSyntax)((ExpressionElementSyntax)element).Expression;

                var typeNames = objCreation.ArgumentList!.Arguments.Select(arg =>
                {
                    INameOrTypeT? name = null;

                    if (arg.Expression is TypeOfExpressionSyntax typeOfExpr)
                    {
                        name = typeSyntaxParser.Parse(typeOfExpr);
                    }

                    return name;
                }).ToArray();

                if (typeNames.Length > 0)
                {
                    retObj.IntfType = typeNames[0];

                    if (typeNames.Length > 1)
                    {
                        retObj.ImmtblType = typeNames[1];

                        if (typeNames.Length > 2)
                        {
                            retObj.MtblType = typeNames[2];
                        }
                    }
                }

                return retObj;
            }).ToArray();

            return new ClnblIntfCfgTypesData
            {
                Items = retArr,
            };
        }
    }
}
