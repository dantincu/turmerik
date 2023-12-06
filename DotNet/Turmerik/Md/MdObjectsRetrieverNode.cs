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
            Func<MdObjectsRetrieverArgs, TryRetrieve1In1Out<MdObjectsRetrieverArgs, MdObjectsRetrieverNode>> nextChildNodeRetriever) : base(
                value,
                nextChildNodeRetriever)
        {
        }

        public IEnumerator<MarkdownObject> ChildNodes { get; init; }
    }
}
