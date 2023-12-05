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
            TryRetrieve<FsEntriesRetrieverArgs, FsEntriesRetrieverNode> nextRootNodeRetriever,
            Func<FsEntriesRetrieverArgs, DataTreeGeneratorStepData> nextStepPredicate) : base(
                argsFactory,
                nextRootNodeRetriever,
                nextStepPredicate)
        {
        }

        public string RootDirPath { get; set; }
        public Func<FsEntriesRetrieverArgs, string> ParentDirPathFactory { get; set; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNode>, IEnumerable<FsEntriesRetrieverNode>> InputNmrblFactory { get; set; }
        public Func<FsEntriesRetrieverArgs, string, int, FsEntriesRetrieverNode> FsEntryDataFactory { get; set; }
        public Func<FsEntriesRetrieverArgs, FsEntriesRetrieverNode, int, bool> FsEntryPredicate { get; set; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNode>, IEnumerable<FsEntriesRetrieverNode>> OutputNmrblFactory { get; set; }
    }
}
