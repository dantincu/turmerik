using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Utility
{
    public class StaticDataCache<TKey, TValue>
    {
        private ConcurrentDictionary<TKey, TValue> map;
        private Func<TKey, TValue> factory;

        public StaticDataCache(
            Func<TKey, TValue> factory)
        {
            this.factory = factory ?? throw new ArgumentNullException(nameof(factory));
            this.map = new ConcurrentDictionary<TKey, TValue>();
        }

        public TValue Get(
            TKey key) => map.GetOrAdd(
                key, factory);
    }
}
