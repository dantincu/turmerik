using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public class FsEntriesRetrieverNode : DataTreeGeneratorNode<FsEntriesRetrieverNodeData, FsEntriesRetrieverNode, FsEntriesRetrieverOpts, FsEntriesRetrieverArgs>
    {
        public FsEntriesRetrieverNode(
            FsEntriesRetrieverNodeData value,
            Func<FsEntriesRetrieverArgs, TryRetrieve1In1Out<FsEntriesRetrieverArgs, FsEntriesRetrieverNode>> nextChildNodeRetriever) : base(
                value, nextChildNodeRetriever)
        {
        }
    }
}
