using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Code
{
    public static class CodeParserH
    {
        public const int BUFFER_LENGTH = 1024;

        public static List<TCodeSyntaxItem> WithChildNodes<TCodeSyntaxItem>(
            this TCodeSyntaxItem parentNode,
            Action<List<TCodeSyntaxItem>> action)
            where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => (
            parentNode.ChildNodes ??= new List<TCodeSyntaxItem>()).ActWith(
                action);

        public static List<TCodeSyntaxItem> AddChildNode<TCodeSyntaxItem>(
            this TCodeSyntaxItem parentNode,
            TCodeSyntaxItem childNode)
            where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => parentNode.WithChildNodes(
                childNodesList => childNodesList.Add(childNode));

        public static bool IsFreeText(
            this CodeSyntaxItemType itemType) => itemType == CodeSyntaxItemType.FreeText;

        public static bool IsFreeText<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType == CodeSyntaxItemType.FreeText;

        public static bool IsTrivia(
            this CodeSyntaxItemType itemType) => itemType == CodeSyntaxItemType.Trivia;

        public static bool IsTrivia<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType == CodeSyntaxItemType.Trivia;

        public static bool IsAllWs(
            this CodeSyntaxItemType itemType) => itemType == CodeSyntaxItemType.AllWs;

        public static bool IsAllWs<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType == CodeSyntaxItemType.AllWs;

        public static bool IsNwLn(
            this CodeSyntaxItemType itemType) => itemType == CodeSyntaxItemType.NwLn;

        public static bool IsNwLn<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType == CodeSyntaxItemType.NwLn;

        public static bool IsAllWsOrNwLn(
            this CodeSyntaxItemType itemType) => itemType.IsAllWs() || itemType.IsNwLn();

        public static bool IsAllWsOrNwLn<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType?.IsAllWsOrNwLn() ?? false;

        public static bool IsAllWsOrTrivia(
            this CodeSyntaxItemType itemType) => itemType.IsAllWsOrNwLn() || itemType.IsTrivia();

        public static bool IsAllWsOrTrivia<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType?.IsAllWsOrTrivia() ?? false;

        public static bool IsToken(
            this CodeSyntaxItemType itemType) => itemType == CodeSyntaxItemType.Token;

        public static bool IsToken<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType == CodeSyntaxItemType.Token;

        public static bool IsKeyword(
            this CodeSyntaxItemType itemType) => itemType == CodeSyntaxItemType.Keyword;

        public static bool IsKeyword<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType == CodeSyntaxItemType.Keyword;

        public static bool IsLiteral(
            this CodeSyntaxItemType itemType) => itemType == CodeSyntaxItemType.Literal;

        public static bool IsLiteral<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType == CodeSyntaxItemType.Literal;

        public static bool IsIdentifier(
            this CodeSyntaxItemType itemType) => itemType == CodeSyntaxItemType.Identifier;

        public static bool IsIdentifier<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType == CodeSyntaxItemType.Identifier;

        public static bool IsIdnfOrLit(
            this CodeSyntaxItemType itemType) => itemType.IsIdentifier() || itemType.IsLiteral();

        public static bool IsIdnfOrLit<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType?.IsIdnfOrLit() ?? false;

        public static bool IsIdnfOrLitOrKw(
            this CodeSyntaxItemType itemType) => itemType.IsIdnfOrLit() || itemType.IsKeyword();

        public static bool IsIdnfOrLitOrKw<TCodeSyntaxItem>(
            this CodeSyntaxItem<TCodeSyntaxItem> item) where TCodeSyntaxItem : CodeSyntaxItem<TCodeSyntaxItem> => item.ItemType?.IsIdnfOrLitOrKw() ?? false;
    }
}
