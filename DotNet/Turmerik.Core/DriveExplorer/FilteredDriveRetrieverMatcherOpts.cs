using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.FileSystem;

namespace Turmerik.Core.DriveExplorer
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
            CheckRetNodeValidityDepth = src.CheckRetNodeValidityDepth;
            RetrieveFileTextContents = src.RetrieveFileTextContents;
        }

        public string PrFolderIdnf { get; set; }
        public DriveEntriesSerializableFilter FsEntriesSerializableFilter { get; set; }
        public DriveEntriesFilter FsEntriesFilter { get; set; }
        public int? CheckRetNodeValidityDepth { get; set; }
        public bool? RetrieveFileTextContents { get; set; }
    }
}
