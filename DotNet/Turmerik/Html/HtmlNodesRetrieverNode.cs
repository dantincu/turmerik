using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Html
{
    public class HtmlNodesRetrieverNode : DataTreeGeneratorNode<HtmlNode, HtmlNodesRetrieverNode, HtmlNodesRetrieverOpts, HtmlNodesRetrieverArgs>
    {
        public HtmlNodesRetrieverNode(
            HtmlNode value,
            TryRetrieve2In1Out<HtmlNodesRetrieverArgs, HtmlNodesRetrieverNode, HtmlNodesRetrieverNode> nextChildNodeRetriever) : base(
                value,
                nextChildNodeRetriever)
        {
        }

        public IEnumerator<HtmlNode> ChildNodes { get; init; }
    }
}
