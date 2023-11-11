using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;

namespace Turmerik.Utility
{
    public static class BestItemRetrieverH
    {
        public static BestItemRetrieverOpts<TItem> WithFactories<TItem>(
            this BestItemRetrieverOpts<TItem> opts,
            Action<List<Func<int, TItem>>> factoriesListBuilder = null,
            List<Func<int, TItem>> factoriesList = null)
        {
            factoriesList ??= new List<Func<int, TItem>>();
            factoriesListBuilder?.Invoke(factoriesList);
            int maxIdx = factoriesList.Count - 1;

            opts.ItemFactory = idx => factoriesList[idx](idx);
            var endOfLoopPredicate = opts.EndOfLoopPredicate;

            opts.EndOfLoopPredicate = opts.EndOfLoopPredicate.FirstNotNull(
                (item, idx) => idx == maxIdx);

            return opts;
        }

        public static BestItemAsyncRetrieverOpts<TItem> WithFactories<TItem>(
            this BestItemAsyncRetrieverOpts<TItem> opts,
            Action<List<Func<int, Task<TItem>>>> factoriesListBuilder = null,
            List<Func<int, Task<TItem>>> factoriesList = null)
        {
            factoriesList ??= new List<Func<int, Task<TItem>>>();
            factoriesListBuilder?.Invoke(factoriesList);
            int maxIdx = factoriesList.Count - 1;

            opts.ItemFactory = idx => factoriesList[idx](idx);
            var endOfLoopPredicate = opts.EndOfLoopPredicate;

            opts.EndOfLoopPredicate = opts.EndOfLoopPredicate.FirstNotNull(
                (item, idx) => idx == maxIdx);

            return opts;
        }
    }
}
