using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public interface ITypeSyntaxParser
    {
        INameOrTypeT Parse(
            TypeSyntax typeSyntax);

        INameOrTypeT Parse(
            TypeOfExpressionSyntax typeOfExpr);
    }

    public class TypeSyntaxParser : ITypeSyntaxParser
    {
        public INameOrTypeT Parse(
            TypeSyntax typeSyntax)
        {
            INameOrTypeT typeT;

            if (typeSyntax is NullableTypeSyntax n)
            {
                var nullableType = new NullableTypeNameT(n)
                {
                    ElementType = Parse(n.ElementType)
                };

                typeT = nullableType;
            }
            else if (typeSyntax is PredefinedTypeSyntax p)
            {
                typeT = new PredefinedTypeNameT(p)
                {
                    Name = p.Keyword.Text
                };
            }
            else if (typeSyntax is IdentifierNameSyntax id)
            {
                typeT = new IdentifierNameT(id)
                {
                    Name = id.Identifier.Text
                };
            }
            else if (typeSyntax is QualifiedNameSyntax qn)
            {
                var qualNameT = new QualifiedNameT(qn)
                {
                    Left = Parse(qn.Left),
                    Right = Parse(qn.Right)
                };

                typeT = qualNameT;
                qualNameT.Name = qualNameT.Right.Name;
            }
            else if (typeSyntax is GenericNameSyntax genericName)
            {
                var genTypeT = new GenericNameT(genericName)
                {
                    Name = genericName.Identifier.Text
                };

                typeT = genTypeT;

                genTypeT.GenericArgsList.AddRange(
                    genericName.TypeArgumentList.Arguments.Select(
                        Parse));
            }
            else
            {
                throw new TrmrkException($"Type syntax type {typeSyntax.GetType().GetTypeFullDisplayName()} not supported");
            }

            return typeT;
        }

        public INameOrTypeT Parse(
            TypeOfExpressionSyntax typeOfExpr) =>
            Parse(typeOfExpr.Type);
    }
}
