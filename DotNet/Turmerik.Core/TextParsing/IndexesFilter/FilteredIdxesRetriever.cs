using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.TextParsing.IndexesFilter
{
    public interface IFilteredIdxesRetriever
    {
        FilteredIdxesRetrieverOpts NormalizeOpts(
            FilteredIdxesRetrieverOpts opts);

        List<int> RetrieveIdxes(
            FilteredIdxesRetrieverOpts opts);

        Dictionary<int, T> RetrieveItems<T>(
            IList<T> inList,
            IdxesFilter[] filtersArr);
    }

    public class FilteredIdxesRetriever : IFilteredIdxesRetriever
    {
        public FilteredIdxesRetrieverOpts NormalizeOpts(
            FilteredIdxesRetrieverOpts opts)
        {
            opts.OutputList ??= new List<int>();

            if (opts.IdxesListIsSorted == false)
            {
                opts.IdxComparison ??= (x, y) => x.CompareTo(y);
                opts.IdxesList.Sort(opts.IdxComparison);
            }

            return opts;
        }

        public Dictionary<int, T> RetrieveItems<T>(
            IList<T> inList,
            IdxesFilter[] filtersArr)
        {
            var idxesList = inList.Select(
                (item, idx) => idx).ToList();

            var filteredIdxes = RetrieveIdxes(new FilteredIdxesRetrieverOpts
            {
                FiltersArr = filtersArr,
                IdxesList = idxesList,
                SortOutputList = true,
            });

            var retMap = filteredIdxes.ToDictionary(
                idx => idx, idx => inList[idx]);

            return retMap;
        }

        public List<int> RetrieveIdxes(
            FilteredIdxesRetrieverOpts opts)
        {
            var wka = GetWorkArgs(opts);

            foreach (var filter in opts.FiltersArr)
            {
                if (filter.SingleIdx.HasValue)
                {
                    RetrieveSingleIdx(wka, filter);
                }
                else
                {
                    int stIdx = filter.StartIdx ?? opts.IdxesList[0];
                    int endIdx = filter.EndIdx ?? opts.IdxesList.Last();

                    var newIdxesNmrbl = opts.IdxesList.Where(
                        idx => opts.IdxComparison(
                            stIdx, idx) <= 0 && opts.IdxComparison(
                                idx, endIdx) >= 0);

                    AddRangeIdxOrThrowIfAlreadyAdded(
                        wka, newIdxesNmrbl);
                }
            }

            if (opts.SortOutputList == true)
            {
                wka.OutputList.Sort(opts.IdxComparison);
            }

            return wka.OutputList;
        }

        private void RetrieveSingleIdx(
            WorkArgs wka,
            IdxesFilter filter)
        {
            var opts = wka.Opts;
            int singleIdxVal = filter.SingleIdx.Value;

            var kvp = opts.IdxesList.FirstKvp(
                (idx, i) => idx == singleIdxVal);

            if (ThrowIfFilterInvalid(kvp.Key < 0))
            {
                throw new ArgumentException(
                    nameof(filter));
            }
            else
            {
                AddIdxOrThrowIfAlreadyAdded(wka, kvp.Value);
            }
        }

        private bool AddRangeIdxOrThrowIfAlreadyAdded(
            WorkArgs wka, IEnumerable<int> newIdxesNmrbl)
        {
            bool alreadyContains = newIdxesNmrbl.Any(
                idx => wka.OutputList.Contains(idx));

            if (alreadyContains)
            {
                throw new ArgumentException(
                    "Provided Filters Overlap");
            }
            else
            {
                wka.OutputList.AddRange(newIdxesNmrbl);
            }

            return !alreadyContains;
        }

        private bool AddIdxOrThrowIfAlreadyAdded(
            WorkArgs wka, int newIdx)
        {
            bool alreadyContains = wka.OutputList.Contains(newIdx);

            if (alreadyContains)
            {
                throw new ArgumentException(
                    "Provided Filters Overlap");
            }
            else
            {
                wka.OutputList.Add(newIdx);
            }

            return !alreadyContains;
        }

        private bool ThrowIfFilterInvalid(
            bool isValid)
        {
            if (!isValid)
            {
                throw new ArgumentException(
                    "Invalid Filter");
            }

            return isValid;
        }

        private WorkArgs GetWorkArgs(
            FilteredIdxesRetrieverOpts opts)
        {
            var wka = new WorkArgs
            {
                Opts = NormalizeOpts(opts),
                OutputList = opts.OutputList
            };

            return wka;
        }

        private class WorkArgs
        {
            public FilteredIdxesRetrieverOpts Opts { get; set; }
            public List<int> OutputList { get; set; }
        }
    }
}
