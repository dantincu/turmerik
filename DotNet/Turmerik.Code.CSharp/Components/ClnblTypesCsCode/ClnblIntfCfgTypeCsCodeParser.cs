using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Turmerik.Code.CSharp.Helpers;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface IClnblIntfCfgTypeCsCodeParser
    {
        ClnblIntfCfgTypeItemTypeNames[] Parse(
            SyntaxList<MemberDeclarationSyntax> membersList);
    }

    public class ClnblIntfCfgTypeItemTypeNames
    {
        public string? IntfTypeName { get; set; }
        public string? ImmtblTypeName { get; set; }
        public string? MtblTypeName { get; set; }
    }

    public class ClnblIntfCfgTypeCsCodeParser : IClnblIntfCfgTypeCsCodeParser
    {
        public ClnblIntfCfgTypeItemTypeNames[] Parse(
            SyntaxList<MemberDeclarationSyntax> membersList)
        {
            var retList = new List<ClnblIntfCfgTypeItemTypeNames>();
            var itemsProp = (PropertyDeclarationSyntax)membersList.Single();
            var exprBody = itemsProp.ExpressionBody!;
            var arrExpr = (CollectionExpressionSyntax)exprBody.Expression;

            var retArr = arrExpr.Elements.Select(element =>
            {
                var retObj = new ClnblIntfCfgTypeItemTypeNames();
                var objCreation = (ImplicitObjectCreationExpressionSyntax)((ExpressionElementSyntax)element).Expression;

                var typeNames = objCreation.ArgumentList!.Arguments.Select(arg =>
                {
                    string? name = null;

                    if (arg.Expression is TypeOfExpressionSyntax typeOfExpr)
                    {
                        name = typeOfExpr.GetTypeNameFromTypeofExpr();
                    }

                    return name;
                }).ToArray();

                if (typeNames.Length > 0)
                {
                    retObj.IntfTypeName = typeNames[0];

                    if (typeNames.Length > 1)
                    {
                        retObj.ImmtblTypeName = typeNames[1];

                        if (typeNames.Length > 2)
                        {
                            retObj.MtblTypeName = typeNames[2];
                        }
                    }
                }

                return retObj;
            }).ToArray();

            return retArr;
        }
    }
}
