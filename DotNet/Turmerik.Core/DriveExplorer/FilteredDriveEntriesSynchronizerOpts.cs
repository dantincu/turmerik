using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public enum FileSyncType
    {
        Diff = 0,
        Pull,
        Push
    }

    public class FilteredDriveEntriesSynchronizerOpts
    {
        public DataTreeNodeMtbl<FilteredDriveEntries> SrcFilteredEntries { get; set; }
        public DataTreeNodeMtbl<FilteredDriveEntries> DestnFilteredEntries { get; set; }
        public DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffResult { get; set; }
        public FileSyncType FileSyncType { get; set; }
        public bool? Interactive { get; set; }
        public bool? TreatAllAsDiff { get; set; }
        public bool? SkipDiffPrinting { get; set; }
        public int? RowsToPrint { get; set; }
        public bool? DeleteEmptyFolders { get; set; }
        public string SrcDirPath { get; set; }
        public string DestnDirPath { get; set; }
        public string SrcName { get; set; }
        public string DestnName { get; set; }
    }
}
