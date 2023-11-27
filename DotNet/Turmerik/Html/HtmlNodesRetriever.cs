using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Html
{
    public interface IHtmlNodesRetriever
    {
        HtmlNodesRetrieverArgs GetNodes(
            HtmlNodesRetrieverOpts opts);
    }

    public class HtmlNodesRetrieverArgs : TextParserTemplateArgs<HtmlNode, HtmlNodesRetrieverArgs>
    {
        public HtmlNodesRetrieverArgs(TextParserTemplateOpts<HtmlNode, HtmlNodesRetrieverArgs> opts) : base(opts)
        {
        }
    }

    public class HtmlNodesRetrieverOpts : TextParserTemplateOpts<HtmlNode, HtmlNodesRetrieverArgs>
    {
        public HtmlDocument HtmlDoc { get; set; }
    }

    public class HtmlNodesRetriever : IHtmlNodesRetriever
    {
        private readonly ITextParserTemplate textParserTemplate;

        public HtmlNodesRetriever(
            ITextParserTemplate textParserTemplate)
        {
            this.textParserTemplate = textParserTemplate ?? throw new ArgumentNullException(nameof(textParserTemplate));
        }

        public HtmlNodesRetrieverArgs GetNodes(
            HtmlNodesRetrieverOpts opts)
        {
            opts.HtmlDoc ??= new HtmlDocument().ActWith(
                doc => doc.LoadHtml(opts.Text));

            opts.WithChildrenFactory(
                node => node.ChildNodes,
                o => opts.HtmlDoc.DocumentNode.ChildNodes);

            var args = textParserTemplate.GetNodes(opts);
            return args;
        }
    }
}
