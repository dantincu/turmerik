using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextParsing.IndexesFilter;

namespace Turmerik.NetCore.ConsoleApps.MkScripts
{
    public interface IFilteredItemsRetriever
    {
        TItem[] GetFilteredItemsIfReq<TItem>(
            FilteredItemsRetrieverOpts<TItem> opts);
    }

    public class FilteredItemsRetriever : IFilteredItemsRetriever
    {
        private readonly IFilteredIdxesRetriever filteredIdxesRetriever;

        public FilteredItemsRetriever(
            IFilteredIdxesRetriever filteredIdxesRetriever)
        {
            this.filteredIdxesRetriever = filteredIdxesRetriever ?? throw new ArgumentNullException(
                nameof(filteredIdxesRetriever));
        }

        public TItem[] GetFilteredItemsIfReq<TItem>(

            FilteredItemsRetrieverOpts<TItem> opts)
        {
            var itemsArr = opts.ItemsArr;

            if (opts.FilterName != null)
            {
                var filter = opts.FiltersMap[opts.FilterName];

                itemsArr = filteredIdxesRetriever.RetrieveItems(
                    itemsArr, filter.Idxes!).Values.ToArray();

                if (filter.Regex != null)
                {
                    if (opts.ToStringSerializer != null)
                    {
                        itemsArr = itemsArr.Where(
                            item => filter.Regex.IsMatch(opts.ToStringSerializer(item))).ToArray();
                    }
                    else
                    {
                        throw new InvalidOperationException(
                            $"Config contains single regex option but the {nameof(opts.ToStringSerializer)} argument is null");
                    }
                }
                else if (filter.Regexes != null)
                {
                    if (opts.ToStrArrSerializer != null)
                    {
                        itemsArr = itemsArr.Where(
                            item =>
                            {
                                var itemToArr = opts.ToStrArrSerializer(item);

                                bool matches = filter.Regexes.All(
                                    (regex, idx) => regex.IsMatch(
                                        itemToArr[idx]));

                                return matches;
                            }).ToArray();
                    }
                    else
                    {
                        throw new InvalidOperationException(
                            $"Config contains multiple regexes option but the {nameof(opts.ToStrArrSerializer)} argument is null");
                    }
                }
            }

            return itemsArr;
        }
    }
}
