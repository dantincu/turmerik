using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class FilteredFsEntriesRetrieverOpts
    {
        public string RootDirPath { get; init; }
        public ReadOnlyCollection<PathFilter> IncludedPathFilters { get; init; }
        public ReadOnlyCollection<PathFilter> ExcludedPathFilters { get; init; }
        public ReadOnlyCollection<string> ExcludedEntryNames { get; init; }
    }
}
