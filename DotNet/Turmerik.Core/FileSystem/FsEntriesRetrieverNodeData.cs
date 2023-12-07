using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class FsEntriesRetrieverNodeData
    {
        public FsEntriesRetrieverNodeData()
        {
        }

        public FsEntriesRetrieverNodeData(
            FsEntriesRetrieverNodeData src)
        {
            Path = src.Path;
            Name = src.Name;
            IsFolder = src.IsFolder;
            Idx = src.Idx;
            LevelIdx = src.LevelIdx;
        }

        public string Path { get; set; }
        public string Name { get; set; }
        public bool? IsFolder { get; set; }
        public int Idx { get; set; }
        public int LevelIdx { get; set; }
    }
}
