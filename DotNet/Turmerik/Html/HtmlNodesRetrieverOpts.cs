using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Html
{
    public class HtmlNodesRetrieverOpts : DataTreeGeneratorOpts<HtmlNode, HtmlNodesRetrieverNode, HtmlNodesRetrieverOpts, HtmlNodesRetrieverArgs>
    {
        public HtmlNodesRetrieverOpts(
            Func<HtmlNodesRetrieverOpts, HtmlNodesRetrieverArgs> argsFactory,
            TryRetrieve<HtmlNodesRetrieverArgs, HtmlNodesRetrieverNode> nextRootNodeRetriever,
            Func<HtmlNodesRetrieverArgs, DataTreeGeneratorStepData> nextStepPredicate) : base(
                argsFactory,
                nextRootNodeRetriever,
                nextStepPredicate)
        {
        }

        public string Text { get; init; }
        public HtmlDocument HtmlDoc { get; init; }
        public IEnumerator<HtmlNode> RootNodes { get; init; }
    }
}
