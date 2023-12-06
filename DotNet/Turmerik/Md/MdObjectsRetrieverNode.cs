using HtmlAgilityPack;
using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Md
{
    public class MdObjectsRetrieverNode : DataTreeGeneratorNode<MarkdownObject, MdObjectsRetrieverNode, MdObjectsRetrieverOpts, MdObjectsRetrieverArgs>
    {
        public MdObjectsRetrieverNode(
            MarkdownObject value,
            TryRetrieve2In1Out<MdObjectsRetrieverArgs, MdObjectsRetrieverNode, MdObjectsRetrieverNode> nextChildNodeRetriever) : base(
                value,
                nextChildNodeRetriever)
        {
        }

        public IEnumerator<MarkdownObject> ChildNodes { get; init; }
    }
}
