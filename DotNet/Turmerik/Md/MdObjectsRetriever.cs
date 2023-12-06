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
            MdObjectsRetrieverOpts opts);
    }

    public class MdObjectsRetriever : IMdObjectsRetriever
    {
        private readonly IDataTreeGenerator dataTreeGenerator;

        public MdObjectsRetriever(
            IDataTreeGenerator dataTreeGenerator)
        {
            this.dataTreeGenerator = dataTreeGenerator ?? throw new ArgumentNullException(
                nameof(dataTreeGenerator));
        }

        public MdObjectsRetrieverArgs GetObjects(
            MdObjectsRetrieverOpts opts)
        {
            opts = NormalizeOpts(opts);

            var args = dataTreeGenerator.GetNodes<MarkdownObject, MdObjectsRetrieverNode, MdObjectsRetrieverOpts, MdObjectsRetrieverArgs>(opts);
            return args;
        }

        private MdObjectsRetrieverOpts NormalizeOpts(
            MdObjectsRetrieverOpts opts)
        {
            var mdDoc = opts.MdDoc ?? MarkdownParser.Parse(opts.Text);
            var rootNodes = opts.RootNodes ?? mdDoc.Descendants().GetEnumerator();

            Func<MarkdownObject, TryRetrieve2In1Out<MdObjectsRetrieverArgs, MdObjectsRetrieverNode, MdObjectsRetrieverNode>> childNodesRetrieverFactory = null;

            childNodesRetrieverFactory = mdNode => mdNode.Descendants().GetEnumerator(
                ).GetRetriever(mdChildNode => new MdObjectsRetrieverNode(mdChildNode,
                    childNodesRetrieverFactory!(mdChildNode)),
                    default(MdObjectsRetrieverNode),
                    default(MdObjectsRetrieverArgs))!;

            opts = new MdObjectsRetrieverOpts(
                opts.ArgsFactory, opts.NextRootNodeRetriever.IfNull(
                   () => rootNodes.GetRetriever(mdNode => new MdObjectsRetrieverNode(
                        mdNode, childNodesRetrieverFactory(
                            mdNode)), default(MdObjectsRetrieverArgs))!),
                opts.NextStepPredicate.FirstNotNull(args => DataTreeGeneratorStep.Push.ToData(true)))
            {
                MdDoc = mdDoc,
                RootNodes = rootNodes
            };

            return opts;
        }
    }
}
