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
            TryRetrieve1In1Out<FsEntriesRetrieverArgs, FsEntriesRetrieverNode> nextRootNodeRetriever,
            Func<FsEntriesRetrieverArgs, DataTreeGeneratorStepData> nextStepPredicate,
            FsEntriesRetrieverOptions inputOpts) : base(
                argsFactory,
                nextRootNodeRetriever,
                nextStepPredicate)
        {
            RootDirPath = inputOpts.RootDirPath;
            ParentDirPathFactory = inputOpts.ParentDirPathFactory;
            InputNmrblFactory = inputOpts.InputNmrblFactory;
            FsEntryDataFactory = inputOpts.FsEntryDataFactory;
            FsEntryPredicate = inputOpts.FsEntryPredicate;
            OutputNmrblFactory = inputOpts.OutputNmrblFactory;
        }

        public string RootDirPath { get; }
        public Func<FsEntriesRetrieverArgs, string> ParentDirPathFactory { get; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNode>, IEnumerable<FsEntriesRetrieverNode>> InputNmrblFactory { get; }
        public Func<FsEntriesRetrieverArgs, string, int, FsEntriesRetrieverNode> FsEntryDataFactory { get; }
        public Func<FsEntriesRetrieverArgs, FsEntriesRetrieverNode, int, bool> FsEntryPredicate { get; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNode>, IEnumerable<FsEntriesRetrieverNode>> OutputNmrblFactory { get; }
    }
}
