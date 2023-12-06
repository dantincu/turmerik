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
            HtmlNodesRetrieverOptions opts);
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
            HtmlNodesRetrieverOptions inOpts)
        {
            var opts = CreateOpts(inOpts);

            var args = dataTreeGenerator.GetNodes<HtmlNode, HtmlNodesRetrieverNode, HtmlNodesRetrieverOpts, HtmlNodesRetrieverArgs>(opts);
            return args;
        }

        private HtmlNodesRetrieverOpts CreateOpts(
            HtmlNodesRetrieverOptions inOpts)
        {
            var htmlDoc = inOpts.HtmlDoc ?? new HtmlDocument().ActWith(
                doc => doc.LoadHtml(inOpts.Text));

            var rootNodes = inOpts.RootNodes ?? ((IEnumerable<HtmlNode>)htmlDoc.DocumentNode.ChildNodes).GetEnumerator();
            Func<HtmlNode, Func< HtmlNodesRetrieverArgs, TryRetrieve1In1Out <HtmlNodesRetrieverArgs, HtmlNodesRetrieverNode>>> childNodesRetrieverFactory = null;

            childNodesRetrieverFactory = htmlNode => a => ((IEnumerable<HtmlNode>)htmlNode.ChildNodes).GetEnumerator(
                ).GetRetriever(htmlNode => new HtmlNodesRetrieverNode(
                    htmlNode, childNodesRetrieverFactory!(htmlNode)),
                    default(HtmlNodesRetrieverArgs))!;

            var opts = new HtmlNodesRetrieverOpts(
                null, args => rootNodes.GetRetriever(htmlNode => new HtmlNodesRetrieverNode(
                        htmlNode, childNodesRetrieverFactory(
                            htmlNode)), default(HtmlNodesRetrieverArgs))!,
                inOpts.NextStepPredicate.FirstNotNull(args => DataTreeGeneratorStep.Push.ToData(true)))
            {
                HtmlDoc = htmlDoc,
                RootNodes = rootNodes
            };

            return opts;
        }
    }
}
