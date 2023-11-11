using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Utility
{
    public class BestItemRetrieverCoreBase
    {
        protected Tuple<bool, bool, int, TItem> NormalizeOpts<TItem>(
            BestItemRetrieverOptsCoreBase<TItem> opts)
        {
            bool isPerfectMatch = false;
            bool endOfLoop = false;
            int idx = -1;

            TItem item = default;
            opts.PerfectMatch ??= new MutableValueWrapper<KeyValuePair<int, TItem>>();
            opts.PerfectMatch.Value = new KeyValuePair<int, TItem>(-1, default);

            return Tuple.Create(
                isPerfectMatch, endOfLoop, idx, item);
        }

        protected void OnItemRetrieved<TItem>(
            TItem item,
            int idx,
            ref bool isPerfectMatch,
            ref bool endOfLoop,
            BestItemRetrieverOptsCoreBase<TItem> opts)
        {
            isPerfectMatch = opts.PerfectMatchPredicate(item, idx);
            endOfLoop = isPerfectMatch || opts.EndOfLoopPredicate(item, idx);

            if (isPerfectMatch)
            {
                opts.PerfectMatch.Value = new KeyValuePair<int, TItem>(
                    idx, item);
            }
        }
    }
}
