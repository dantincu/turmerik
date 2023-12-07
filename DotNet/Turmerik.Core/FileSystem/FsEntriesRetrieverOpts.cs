using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileSystem
{
    public class FsEntriesRetrieverOpts : DataTreeGeneratorOpts<FsEntriesRetrieverNodeData, FsEntriesRetrieverNode, FsEntriesRetrieverOpts, FsEntriesRetrieverArgs>
    {
        public FsEntriesRetrieverOpts(
            Func<FsEntriesRetrieverOpts, FsEntriesRetrieverArgs> argsFactory,
            Func<FsEntriesRetrieverArgs, TryRetrieve1In1Out<FsEntriesRetrieverArgs, FsEntriesRetrieverNode>> nextRootNodeRetrieverFactory,
            Func<FsEntriesRetrieverArgs, DataTreeGeneratorStepData> nextStepPredicate,
            FsEntriesRetrieverOptions inputOpts,
            Func<FsEntriesRetrieverArgs, FsEntriesRetrieverNode, bool> onChildNodesIterated = null) : base(
                argsFactory,
                nextRootNodeRetrieverFactory,
                nextStepPredicate,
                onChildNodesIterated)
        {
            RootDirPath = inputOpts.RootDirPath;
            InputNmrblFactory = inputOpts.InputNmrblFactory;
            FsEntryPredicate = inputOpts.FsEntryPredicate;
            OutputNmrblFactory = inputOpts.OutputNmrblFactory;
        }

        public string RootDirPath { get; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNodeData>, IEnumerable<FsEntriesRetrieverNodeData>> InputNmrblFactory { get; }
        public Func<FsEntriesRetrieverArgs, FsEntriesRetrieverNodeData, int, bool> FsEntryPredicate { get; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNodeData>, IEnumerable<FsEntriesRetrieverNodeData>> OutputNmrblFactory { get; }
    }
}
