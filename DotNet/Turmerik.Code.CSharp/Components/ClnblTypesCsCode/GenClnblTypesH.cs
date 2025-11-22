using Microsoft.CodeAnalysis.CSharp;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Code.CSharp.Components.ClnblTypesCsCode
{
    public static class GenClnblTypesH
    {
        public static readonly ReadOnlyCollection<SyntaxKind> DataTypeDeclarationSyntaxKinds = new(
            [
                SyntaxKind.ClassDeclaration,
                SyntaxKind.InterfaceDeclaration,
                SyntaxKind.StructDeclaration,
            ]);

        public static readonly ReadOnlyCollection<SyntaxKind> DataTypeMemberDeclarationSyntaxKinds = new(
            [
                SyntaxKind.DelegateDeclaration,
                SyntaxKind.EventDeclaration,
                SyntaxKind.MethodDeclaration,
                SyntaxKind.PropertyDeclaration,
                SyntaxKind.FieldDeclaration,
            ]);

        public static bool IsDataTypeDeclaration(
            this SyntaxKind syntaxKind) => DataTypeDeclarationSyntaxKinds.Contains(syntaxKind);

        public static bool IsDataTypeMemberDeclaration(
            this SyntaxKind syntaxKind) => DataTypeMemberDeclarationSyntaxKinds.Contains(syntaxKind);
    }
}
