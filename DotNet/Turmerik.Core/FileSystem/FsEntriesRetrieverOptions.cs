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
            OutputNmrblFactory = src.OutputNmrblFactory;
        }

        public string RootDirPath { get; set; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNodeData>, IEnumerable<FsEntriesRetrieverNodeData>> InputNmrblFactory { get; set; }
        public Func<FsEntriesRetrieverArgs, FsEntriesRetrieverNodeData, int, bool> FsEntryPredicate { get; set; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNodeData>, IEnumerable<FsEntriesRetrieverNodeData>> OutputNmrblFactory { get; set; }
    }
}
