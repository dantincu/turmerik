using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.FileSystem;

namespace Turmerik.Core.ConsoleApps.MkFsBackup
{
    public class BckFsEntriesRetrieverOpts
    {
        public string SrcDirPath { get; set; }
        public string DestnDirPath { get; set; }
        public IPathFilters SrcDirPathFilters { get; set; }
        public IPathFilters DestnDirPathFilters { get; set; }
        public bool? PrintAllEntries { get; set; }
    }
}
