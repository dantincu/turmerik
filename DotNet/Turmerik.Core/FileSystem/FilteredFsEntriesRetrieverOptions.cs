using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class FilteredFsEntriesRetrieverOptions
    {
        public string[][][] IncludedPathFilters { get; set; }
        public string[][][] ExcludedPathFilters { get; set; }
        public string[] ExcludedEntryNames { get; set; }
    }
}
