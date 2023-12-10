using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Utility;

namespace Turmerik.Core.ConsoleApps.MkFsBackup
{
    public class BckFsEntriesRetrieverResult
    {
        public List<DataTreeNode<FsEntriesRetrieverNode>> SrcRelPaths { get; set; }
        public List<DataTreeNode<FsEntriesRetrieverNode>> DestnRelPaths { get; set; }

        public List<FsEntriesRetrieverNodeData[]> DestnRelPathsNotFoundInSrc { get; set; }
        public List<FsEntriesRetrieverNodeData[]> SrcRelPathsNotFoundInDestn { get; set; }
    }
}
