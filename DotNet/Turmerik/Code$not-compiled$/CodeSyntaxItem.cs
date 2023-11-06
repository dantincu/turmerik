using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Xml.Linq;
using Turmerik.Helpers;

namespace Turmerik.Code
{
    public class CodeSyntaxItem<TItem>
        where TItem : CodeSyntaxItem<TItem>
    {
        public string? SrcCode { get; set; }
        public int SrcCodeStartIdx { get; set; }
        public int SrcCodeLength { get; set; }
        /// <summary>
        /// Multipurpose property. Can represent: <br />
        ///  - the rendered text (text transformed by unescaping sequences) for text nodes and quoted strings. <br />
        ///  - the name of xml/html nodes, property names for declarative constructs, keywords or identifier names. <br />
        ///  - the contents of a literal sequence or representation of a regex literal. <br /> <br />
        /// Should NOT be used to store the rendered text for a higher order node
        /// </summary>
        public string? TextValue { get; set; }
        public CodeSyntaxItemType? ItemType { get; set; }
        public int? NwLnTokensCount { get; set; }
        public List<CodeSyntaxItem>? LeadingTokens { get; set; }
        public List<TItem>? ChildNodes { get; set; }
        public List<CodeSyntaxItem>? TrailingTokens { get; set; }

        public List<TItem> AddChildNode(
            TItem childNode,
            bool notIfAlreadyExists = false) => AddChildItem(
                this.ChildNodes ??= new List<TItem>(),
                childNode, notIfAlreadyExists);

        public List<TItem> AddChildNodes(
            IEnumerable<TItem> childNodesNmrbl,
            bool notIfAlreadyExists = false) => AddChildItems(
                this.ChildNodes ??= new List<TItem>(),
                childNodesNmrbl,
                notIfAlreadyExists);

        public List<TItem> InsertChildNode(
            TItem childNode,
            int index,
            bool notIfAlreadyExists = false) => InsertChildItem(
                this.ChildNodes ??= new List<TItem>(),
                index, childNode, notIfAlreadyExists);

        public List<TItem> InsertChildNodes(
            IEnumerable<TItem> childNodesNmrbl,
            int index,
            bool notIfAlreadyExists = false) => InsertChildItems(
                this.ChildNodes ??= new List<TItem>(),
                index, childNodesNmrbl, notIfAlreadyExists);

        public List<CodeSyntaxItem> AddLeadingToken(
            CodeSyntaxItem leadingToken,
            bool notIfAlreadyExists = false) => AddChildItem(
                this.LeadingTokens ??= new List<CodeSyntaxItem>(),
                leadingToken, notIfAlreadyExists);

        public List<CodeSyntaxItem> AddLeadingTokens(
            IEnumerable<CodeSyntaxItem> leadingTokensNmrbl,
            bool notIfAlreadyExists = false) => AddChildItems(
                this.LeadingTokens ??= new List<CodeSyntaxItem>(),
                leadingTokensNmrbl, notIfAlreadyExists);

        public List<CodeSyntaxItem> InsertLeadingToken(
            CodeSyntaxItem leadingToken,
            int index,
            bool notIfAlreadyExists = false) => InsertChildItem(
                this.LeadingTokens ??= new List<CodeSyntaxItem>(),
                index, leadingToken, notIfAlreadyExists);

        public List<CodeSyntaxItem> InsertLeadingTokens(
            IEnumerable<CodeSyntaxItem> leadingTokensNmrbl,
            int index,
            bool notIfAlreadyExists = false) => InsertChildItems(
                this.LeadingTokens ??= new List<CodeSyntaxItem>(),
                index, leadingTokensNmrbl, notIfAlreadyExists);

        public List<CodeSyntaxItem> AddTrailingToken(
            CodeSyntaxItem trailingToken,
            bool notIfAlreadyExists = false) => AddChildItem(
                this.TrailingTokens ??= new List<CodeSyntaxItem>(),
                trailingToken, notIfAlreadyExists);

        public List<CodeSyntaxItem> AddTrailingTokens(
            IEnumerable<CodeSyntaxItem> trailingTokensNmrbl,
            bool notIfAlreadyExists = false) => AddChildItems(
                this.TrailingTokens ??= new List<CodeSyntaxItem>(),
                trailingTokensNmrbl, notIfAlreadyExists);

        public List<CodeSyntaxItem> InsertTrailingToken(
            CodeSyntaxItem trailingToken,
            int index,
            bool notIfAlreadyExists = false) => InsertChildItem(
                this.TrailingTokens ??= new List<CodeSyntaxItem>(),
                index, trailingToken, notIfAlreadyExists);

        public List<CodeSyntaxItem> InsertTrailingTokens(
            IEnumerable<CodeSyntaxItem> trailingTokensNmrbl,
            int index,
            bool notIfAlreadyExists = false) => InsertChildItems(
                this.TrailingTokens ??= new List<CodeSyntaxItem>(),
                index, trailingTokensNmrbl, notIfAlreadyExists);

        public CodeSyntaxItem? GetLastNonNwLnToken(
            ) => TrailingTokens?.LastOrDefault(
                token => !token.IsNwLn());

        public CodeSyntaxItem? GetLastToken(
            ) => TrailingTokens?.LastOrDefault();

        public int? GetChildIndex(TItem node)
        {
            int? idx = null;

            if (ChildNodes != null)
            {
                idx = ChildNodes.IndexOf(node);
            }

            return idx;
        }

        public TItem? NextAfter(
            TItem refNode,
            Func<TItem, int, bool> predicate,
            bool ignoreAllWsNodes = true) => NextCore(
                refNode,
                predicate,
                ignoreAllWsNodes,
                idx => idx >= 0,
                idx => idx < ChildNodes!.Count,
                1);

        public TItem? PrevBefore(
            TItem refNode,
            Func<TItem, int, bool> predicate,
            bool ignoreAllWsNodes = true) => NextCore(
                refNode,
                predicate,
                ignoreAllWsNodes,
                idx => idx > 0,
                idx => idx >= 0,
                -1);

        public bool StartsWith(
            string str) => SrcCode?.StartsWith(
                str) ?? false;

        public bool StartsWith(
            string str,
            bool ignoreCase,
            CultureInfo? cultureInfo = null) => SrcCode?.StartsWith(
                str, ignoreCase, cultureInfo ?? CultureInfo.InvariantCulture) ?? false;

        public bool StartsWith(
            string str,
            StringComparison? stringComparison = StringComparison.InvariantCulture) => SrcCode?.StartsWith(
                str, stringComparison ?? StringComparison.InvariantCultureIgnoreCase) ?? false;

        public bool EndsWith(
            string str) => SrcCode?.EndsWith(
                str) ?? false;

        public bool EndsWith(
            string str,
            bool ignoreCase,
            CultureInfo? cultureInfo = null) => SrcCode?.EndsWith(
                str, ignoreCase, cultureInfo ?? CultureInfo.InvariantCulture) ?? false;

        public bool EndsWith(
            string str,
            StringComparison? stringComparison = StringComparison.InvariantCulture) => SrcCode?.EndsWith(
                str, stringComparison ?? StringComparison.InvariantCultureIgnoreCase) ?? false;

        private TItem? NextCore(
            TItem refNode,
            Func<TItem, int, bool> predicate,
            bool ignoreAllWsNodes,
            Func<int, bool> idxStartPredicate,
            Func<int, bool> idxLoopPredicate,
            int idxIncVal)
        {
            TItem? nextNode = null;

            if (ChildNodes != null)
            {
                int idx = ChildNodes.IndexOf(refNode);

                if (idxStartPredicate(idx))
                {
                    idx += idxIncVal;
                    
                    while (idxLoopPredicate(idx))
                    {
                        var node = ChildNodes[idx];

                        if ((!ignoreAllWsNodes || !node.IsAllWs()) && predicate(node, idx))
                        {
                            nextNode = node;
                            break;
                        }
                    }
                }
            }

            return nextNode;
        }

        private List<ChildItem> AddChildItem<ChildItem>(
            List<ChildItem> childItems,
            ChildItem childItem,
            bool notIfAlreadyExists)
        {
            if (!notIfAlreadyExists || !childItems.Contains(childItem))
            {
                childItems.Add(childItem);
            }

            return childItems;
        }

        private List<ChildItem> AddChildItems<ChildItem>(
            List<ChildItem> childItems,
            IEnumerable<ChildItem> childItemsNmrbl,
            bool notIfAlreadyExists)
        {
            if (notIfAlreadyExists)
            {
                foreach (var childItem in childItems)
                {
                    AddChildItem(childItems, childItem, notIfAlreadyExists);
                }
            }
            else
            {
                childItems.AddRange(childItemsNmrbl);
            }

            return childItems;
        }

        private List<ChildItem> InsertChildItem<ChildItem>(
            List<ChildItem> childItems,
            int index,
            ChildItem childItem,
            bool notIfAlreadyExists)
        {
            if (!notIfAlreadyExists || !childItems.Contains(childItem))
            {
                childItems.Insert(index, childItem);
            }

            return childItems;
        }

        private List<ChildItem> InsertChildItems<ChildItem>(
            List<ChildItem> childItems,
            int index,
            IEnumerable<ChildItem> childItemsNmrbl,
            bool notIfAlreadyExists)
        {
            if (notIfAlreadyExists)
            {
                foreach (var childItem in childItems)
                {
                    InsertChildItem(childItems, index++, childItem, notIfAlreadyExists);
                }
            }
            else
            {
                childItems.InsertRange(index, childItemsNmrbl);
            }

            return childItems;
        }
    }

    public class CodeSyntaxItem : CodeSyntaxItem<CodeSyntaxItem>
    {
    }
}
