using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility
{
    public interface IBestItemAsyncRetriever
    {
        IAsyncEnumerable<TItem> RetrieveAsync<TItem>(
            BestItemAsyncRetrieverOpts<TItem> opts);
    }

    public class BestItemAsyncRetriever : BestItemRetrieverCoreBase, IBestItemAsyncRetriever
    {
        public async IAsyncEnumerable<TItem> RetrieveAsync<TItem>(
            BestItemAsyncRetrieverOpts<TItem> opts)
        {
            (var isPerfectMatch,
                var endOfLoop,
                var idx,
                var item) = NormalizeOpts(opts);

            while (!endOfLoop)
            {
                item = await opts.ItemFactory(++idx);

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
