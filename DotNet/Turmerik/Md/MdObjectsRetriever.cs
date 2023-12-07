using HtmlAgilityPack;
using Markdig.Parsers;
using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;
using Turmerik.Html;

namespace Turmerik.Md
{
    public interface IMdObjectsRetriever
    {
        MdObjectsRetrieverArgs GetObjects(
            MdObjectsRetrieverOptions opts);
    }

    public class MdObjectsRetriever : IMdObjectsRetriever
    {
        private readonly IDataTreeGenerator dataTreeGenerator;

        public MdObjectsRetriever(
            IDataTreeGeneratorFactory dataTreeGeneratorFactory)
        {
            this.dataTreeGenerator = dataTreeGeneratorFactory.Default;
        }

        public MdObjectsRetrieverArgs GetObjects(
            MdObjectsRetrieverOptions inOpts)
        {
            var opts = CreateOpts(inOpts);

            var args = dataTreeGenerator.GetNodes<MarkdownObject, MdObjectsRetrieverNode, MdObjectsRetrieverOpts, MdObjectsRetrieverArgs>(opts);
            return args;
        }

        private MdObjectsRetrieverOpts CreateOpts(
            MdObjectsRetrieverOptions inOpts)
        {
            var mdDoc = inOpts.MdDoc ?? MarkdownParser.Parse(inOpts.Text);
            var rootNodes = inOpts.RootNodes ?? mdDoc.Descendants().GetEnumerator();

            Func<MarkdownObject, Func< MdObjectsRetrieverArgs, TryRetrieve1In1Out <MdObjectsRetrieverArgs, MdObjectsRetrieverNode>>> childNodesRetrieverFactory = null;

            childNodesRetrieverFactory = mdNode => a => mdNode.Descendants().GetEnumerator(
                ).GetRetriever(mdChildNode => new MdObjectsRetrieverNode(mdChildNode,
                    childNodesRetrieverFactory!(mdChildNode)),
                    default(MdObjectsRetrieverArgs))!;

            var opts = new MdObjectsRetrieverOpts(
                null, args => rootNodes.GetRetriever(mdNode => new MdObjectsRetrieverNode(
                        mdNode, childNodesRetrieverFactory(
                            mdNode)), default(MdObjectsRetrieverArgs))!,
                inOpts.NextStepPredicate.FirstNotNull(args => DataTreeGeneratorStep.Push.ToData(true)))
            {
                MdDoc = mdDoc,
                RootNodes = rootNodes
            };

            return opts;
        }
    }
}
