using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Md
{
    public class MdObjectsRetrieverOpts : DataTreeGeneratorOpts<MarkdownObject, MdObjectsRetrieverNode, MdObjectsRetrieverOpts, MdObjectsRetrieverArgs>
    {
        public MdObjectsRetrieverOpts(
            Func<MdObjectsRetrieverOpts, MdObjectsRetrieverArgs> argsFactory,
            TryRetrieve1In1Out<MdObjectsRetrieverArgs, MdObjectsRetrieverNode> nextRootNodeRetriever,
            Func<MdObjectsRetrieverArgs, DataTreeGeneratorStepData> nextStepPredicate) : base(
                argsFactory,
                nextRootNodeRetriever,
                nextStepPredicate)
        {
        }

        public string Text { get; init; }
        public MarkdownDocument MdDoc { get; init; }
        public IEnumerator<MarkdownObject> RootNodes { get; init; }
    }
}
