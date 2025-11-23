using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;

namespace Turmerik.Code.CSharp.Helpers
{
    public static class CSharpH
    {
        public static string GetTypeNameFromTypeofExpr(
            this TypeOfExpressionSyntax typeOfExpr)
        {
            string? name = null;
            var typeSyntax = typeOfExpr.Type;

            if (typeSyntax is IdentifierNameSyntax id)
            {
                name = id.ToFullString();
            }
            else if (typeSyntax is QualifiedNameSyntax qn)
            {
                name = qn.ToFullString();
            }

            return name;
        }
    }
}
