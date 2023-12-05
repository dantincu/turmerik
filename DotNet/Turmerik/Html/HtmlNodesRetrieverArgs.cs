using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Html
{
    public class HtmlNodesRetrieverArgs : DataTreeGeneratorArgs<HtmlNode, HtmlNodesRetrieverNode, HtmlNodesRetrieverOpts, HtmlNodesRetrieverArgs>
    {
        public HtmlNodesRetrieverArgs(HtmlNodesRetrieverOpts opts) : base(opts)
        {
        }
    }
}
