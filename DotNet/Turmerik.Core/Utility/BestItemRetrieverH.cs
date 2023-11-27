using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public static class BestItemRetrieverH
    {
        public static BestItemRetrieverOpts<TItem> WithFactories<TItem>(
            this BestItemRetrieverOpts<TItem> opts,
            Action<List<Func<int, TItem>>> factoriesListBuilder = null,
            List<Func<int, TItem>> factoriesList = null,
            Func<int, TItem> nextItemsFactory = null)
        {
            factoriesList ??= new List<Func<int, TItem>>();
            factoriesListBuilder?.Invoke(factoriesList);
            int maxIdx = factoriesList.Count - 1;

            opts.ItemFactory = idx =>
            {
                TItem item;

                if (idx < factoriesList.Count)
                {
                    item = factoriesList[idx](idx);
                }
                else
                {
                    item = nextItemsFactory(idx);
                }

                return item;
            };

            var endOfLoopPredicate = opts.EndOfLoopPredicate;

            opts.EndOfLoopPredicate = opts.EndOfLoopPredicate.FirstNotNull(
                (item, idx) => idx == maxIdx);

            return opts;
        }

        public static BestItemAsyncRetrieverOpts<TItem> WithFactories<TItem>(
            this BestItemAsyncRetrieverOpts<TItem> opts,
            Action<List<Func<int, Task<TItem>>>> factoriesListBuilder = null,
            List<Func<int, Task<TItem>>> factoriesList = null,
            Func<int, Task<TItem>> nextItemsFactory = null)
        {
            factoriesList ??= new List<Func<int, Task<TItem>>>();
            factoriesListBuilder?.Invoke(factoriesList);
            int maxIdx = factoriesList.Count - 1;

            opts.ItemFactory = async idx =>
            {
                TItem item;

                if (idx < factoriesList.Count)
                {
                    item = await factoriesList[idx](idx);
                }
                else
                {
                    item = await nextItemsFactory(idx);
                }

                return item;
            };

            opts.EndOfLoopPredicate = opts.EndOfLoopPredicate.FirstNotNull(
                (item, idx) => idx >= maxIdx);

            return opts;
        }
    }
}
