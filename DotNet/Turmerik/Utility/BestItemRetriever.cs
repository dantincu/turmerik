using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Utility
{
    public interface IBestItemRetriever
    {
        IEnumerable<TItem> Retrieve<TItem>(
            BestItemRetrieverOpts<TItem> opts);
    }

    public class BestItemRetriever : BestItemRetrieverCoreBase, IBestItemRetriever
    {
        public IEnumerable<TItem> Retrieve<TItem>(
            BestItemRetrieverOpts<TItem> opts)
        {
            (var isPerfectMatch,
                var endOfLoop,
                var idx,
                var item) = NormalizeOpts(opts);

            while (!endOfLoop)
            {
                item = opts.ItemFactory(++idx);

                OnItemRetrieved(
                    item,
                    idx,
                    ref isPerfectMatch,
                    ref endOfLoop,
                    opts);

                yield return item;
            }
        }
    }
}
