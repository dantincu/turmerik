using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class FsEntriesRetrieverNodeData
    {
        public string Path { get; set; }
        public string Name { get; set; }
        public int Idx { get; set; }
        public bool? IsFolder { get; set; }
    }
}
