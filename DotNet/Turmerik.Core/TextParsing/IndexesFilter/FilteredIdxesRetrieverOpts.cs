using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.TextParsing.IndexesFilter
{
    public class FilteredIdxesRetrieverOpts
    {
        public List<int> IdxesList {  get; set; }
        public IdxesFilter[] FiltersArr { get; set; }
        public bool? IdxesListIsSorted { get; set; }
        public bool? SortOutputList { get; set; }
        public List<int> OutputList { get; set; }
        public Comparison<int> IdxComparison { get; set; }
    }
}
