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

        public string Path { get; init; }
        public string Name { get; init; }
        public bool? IsFolder { get; init; }
        public int Idx { get; init; }
        public int LevelIdx { get; init; }
    }
}
