using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Html
{
    public interface IHtmlNodesRetriever
    {
        HtmlNodesRetrieverArgs GetNodes(
            HtmlNodesRetrieverOpts opts);
    }

    public class HtmlNodesRetriever : IHtmlNodesRetriever
    {
        private readonly IDataTreeGenerator dataTreeGenerator;

        public HtmlNodesRetriever(
            IDataTreeGenerator dataTreeGenerator)
        {
            this.dataTreeGenerator = dataTreeGenerator ?? throw new ArgumentNullException(
                nameof(dataTreeGenerator));
        }

        public HtmlNodesRetrieverArgs GetNodes(
            HtmlNodesRetrieverOpts opts)
        {
            opts = NormalizeOpts(opts);

            var args = dataTreeGenerator.GetNodes<HtmlNode, HtmlNodesRetrieverNode, HtmlNodesRetrieverOpts, HtmlNodesRetrieverArgs>(opts);
            return args;
        }

        private HtmlNodesRetrieverOpts NormalizeOpts(
            HtmlNodesRetrieverOpts opts)
        {
            var htmlDoc = opts.HtmlDoc ?? new HtmlDocument().ActWith(
                doc => doc.LoadHtml(opts.Text));

            var rootNodes = opts.RootNodes ?? ((IEnumerable<HtmlNode>)htmlDoc.DocumentNode.ChildNodes).GetEnumerator();
            Func<HtmlNode, TryRetrieve1<HtmlNodesRetrieverArgs, HtmlNodesRetrieverNode, HtmlNodesRetrieverNode>> childNodesRetrieverFactory = null;

            childNodesRetrieverFactory = htmlNode => ((IEnumerable<HtmlNode>)htmlNode.ChildNodes).GetEnumerator(
                ).GetRetriever(htmlNode => new HtmlNodesRetrieverNode(
                    htmlNode, childNodesRetrieverFactory!(htmlNode)),
                    default(HtmlNodesRetrieverNode),
                    default(HtmlNodesRetrieverArgs))!;

            opts = new HtmlNodesRetrieverOpts(
                opts.ArgsFactory, opts.NextRootNodeRetriever.IfNull(
                   () => rootNodes.GetRetriever(htmlNode => new HtmlNodesRetrieverNode(
                        htmlNode, childNodesRetrieverFactory(
                            htmlNode)), default(HtmlNodesRetrieverArgs))!),
                opts.NextStepPredicate.FirstNotNull(args => DataTreeGeneratorStep.Push.ToData(true)))
            {
                HtmlDoc = htmlDoc,
                RootNodes = rootNodes
            };

            return opts;
        }
    }
}
