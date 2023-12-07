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
            Func<MdObjectsRetrieverArgs, TryRetrieve1In1Out<MdObjectsRetrieverArgs, MdObjectsRetrieverNode>> nextRootNodeRetrieverFactory,
            Func<MdObjectsRetrieverArgs, DataTreeGeneratorStepData> nextStepPredicate,
            Func<MdObjectsRetrieverArgs, MdObjectsRetrieverNode, bool> onChildNodesIterated = null) : base(
                argsFactory,
                nextRootNodeRetrieverFactory,
                nextStepPredicate,
                onChildNodesIterated)
        {
        }

        public string Text { get; init; }
        public MarkdownDocument MdDoc { get; init; }
        public IEnumerator<MarkdownObject> RootNodes { get; init; }
    }
}
