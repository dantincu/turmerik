using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Utility
{
    public abstract class BestItemRetrieverOptsCoreBase<TItem>
    {
        public Func<TItem, int, bool> PerfectMatchPredicate { get; set; }
        public Func<TItem, int, bool> EndOfLoopPredicate { get; set; }
        public MutableValueWrapper<KeyValuePair<int, TItem>> PerfectMatch { get; set; }
    }

    public class BestItemRetrieverOpts<TItem> : BestItemRetrieverOptsCoreBase<TItem>
    {
        public Func<int, TItem> ItemFactory { get; set; }
    }

    public class BestItemAsyncRetrieverOpts<TItem> : BestItemRetrieverOptsCoreBase<TItem>
    {
        public Func<int, Task<TItem>> ItemFactory { get; set; }
    }
}
