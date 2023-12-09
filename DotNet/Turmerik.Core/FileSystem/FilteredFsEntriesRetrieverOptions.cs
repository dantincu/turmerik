using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileSystem
{
    public class FilteredFsEntriesRetrieverOptions
    {
        public string RootDirPath { get; set; }
        public char WildcardChar { get; set; }
        public IEnumerable<char> PathSeparators { get; set; }

        public IEnumerable<string> IncludedPaths { get; set; }
        public IEnumerable<PathFilter> IncludedPathFilters { get; set; }

        public IEnumerable<string> ExcludedPaths { get; set; }
        public IEnumerable<PathFilter> ExcludedPathFilters { get; set; }

        public IEnumerable<string> ExcludedEntryNames { get; set; }
    }
}
