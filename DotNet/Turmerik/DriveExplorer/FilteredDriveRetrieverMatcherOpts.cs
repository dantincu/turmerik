using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.FileSystem;

namespace Turmerik.DriveExplorer
{
    public class FilteredDriveRetrieverMatcherOpts
    {
        public FilteredDriveRetrieverMatcherOpts()
        {
        }

        public FilteredDriveRetrieverMatcherOpts(FilteredDriveRetrieverMatcherOpts src)
        {
            PrFolderIdnf = src.PrFolderIdnf;
            FsEntriesSerializableFilter = src.FsEntriesSerializableFilter;
            FsEntriesFilter = src.FsEntriesFilter;
        }

        public string PrFolderIdnf { get; set; }
        public DriveEntriesSerializableFilter FsEntriesSerializableFilter { get; set; }
        public DriveEntriesFilter FsEntriesFilter { get; set; }
    }
}
