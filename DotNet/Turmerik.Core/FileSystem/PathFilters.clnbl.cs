using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.FileSystem
{
    public interface IPathFilters
    {
        IEnumerable<string> GetIncludedPaths();
        IEnumerable<string> GetExcludedPaths();
        IEnumerable<string> GetExcludedEntryNames();
    }

    public static class PathFilters
    {
        public static PathFiltersImmtbl ToImmtbl(
            this IPathFilters src) => new PathFiltersImmtbl(src);

        public static PathFiltersMtbl ToMtbl(
            this IPathFilters src) => new PathFiltersMtbl(src);
    }

    public class PathFiltersImmtbl : IPathFilters
    {
        public PathFiltersImmtbl(
            IPathFilters src)
        {
            IncludedPaths = src.GetIncludedPaths()?.RdnlC();
            ExcludedPaths = src.GetExcludedPaths()?.RdnlC();
            ExcludedEntryNames = src.GetExcludedEntryNames()?.RdnlC();
        }

        public PathFiltersImmtbl()
        {
        }

        public ReadOnlyCollection<string> IncludedPaths { get; init; }
        public ReadOnlyCollection<string> ExcludedPaths { get; init; }
        public ReadOnlyCollection<string> ExcludedEntryNames { get; init; }

        public IEnumerable<string> GetIncludedPaths() => IncludedPaths;
        public IEnumerable<string> GetExcludedPaths() => ExcludedPaths;
        public IEnumerable<string> GetExcludedEntryNames() => ExcludedEntryNames;
    }

    public class PathFiltersMtbl : IPathFilters
    {
        public PathFiltersMtbl()
        {
        }

        public PathFiltersMtbl(
            IPathFilters src)
        {
            IncludedPaths = src.GetIncludedPaths()?.ToList();
            ExcludedPaths = src.GetExcludedPaths()?.ToList();
            ExcludedEntryNames = src.GetExcludedEntryNames()?.ToList();
        }

        public List<string> IncludedPaths { get; set; }
        public List<string> ExcludedPaths { get; set; }
        public List<string> ExcludedEntryNames { get; set; }

        public IEnumerable<string> GetIncludedPaths() => IncludedPaths;
        public IEnumerable<string> GetExcludedPaths() => ExcludedPaths;
        public IEnumerable<string> GetExcludedEntryNames() => ExcludedEntryNames;
    }
}
