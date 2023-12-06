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
            ParentDirPathFactory = src.ParentDirPathFactory;
            InputNmrblFactory = src.InputNmrblFactory;
            FsEntryDataFactory = src.FsEntryDataFactory;
            FsEntryPredicate = src.FsEntryPredicate;
            OutputNmrblFactory = src.OutputNmrblFactory;
        }

        public string RootDirPath { get; set; }
        public Func<FsEntriesRetrieverArgs, string> ParentDirPathFactory { get; set; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNode>, IEnumerable<FsEntriesRetrieverNode>> InputNmrblFactory { get; set; }
        public Func<FsEntriesRetrieverArgs, string, int, FsEntriesRetrieverNode> FsEntryDataFactory { get; set; }
        public Func<FsEntriesRetrieverArgs, FsEntriesRetrieverNode, int, bool> FsEntryPredicate { get; set; }
        public Func<FsEntriesRetrieverArgs, IEnumerable<FsEntriesRetrieverNode>, IEnumerable<FsEntriesRetrieverNode>> OutputNmrblFactory { get; set; }
    }
}
