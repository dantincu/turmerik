using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class FsEntriesRetrieverOptions
    {
        public FsEntriesRetrieverOptions()
        {
        }

        public FsEntriesRetrieverOptions(
            FsEntriesRetrieverOptions src)
        {
            RootDirPath = src.RootDirPath;
            InputNmrblFactory = src.InputNmrblFactory;
            FsEntryPredicate = src.FsEntryPredicate;
            NodePredicate = src.NodePredicate;
            OutputNmrblFactory = src.OutputNmrblFactory;
            OnNodeChildrenIterated = src.OnNodeChildrenIterated;
        }

        public string RootDirPath { get; set; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNodeData>, IEnumerable<FsEntriesRetrieverNodeData>> InputNmrblFactory { get; set; }
        public Func<FsEntriesRetrieverArgs, FsEntriesRetrieverNodeData, int, bool> FsEntryPredicate { get; set; }
        public Func<FsEntriesRetrieverArgs, bool> NodePredicate { get; set; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNodeData>, IEnumerable<FsEntriesRetrieverNodeData>> OutputNmrblFactory { get; set; }
        public Func<FsEntriesRetrieverArgs, FsEntriesRetrieverNode, bool> OnNodeChildrenIterated { get; set; }
    }
}
