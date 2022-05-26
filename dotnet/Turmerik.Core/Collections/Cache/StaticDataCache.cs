using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Collections.Cache
{
    public interface IStaticDataCache<TKey, TValue>
    {
        TValue Get(TKey key);
    }

    public class StaticDataCache<TKey, TValue> : IStaticDataCache<TKey, TValue>
    {
        private readonly DataCache<TKey, TValue> innerCache;
        private readonly Func<TKey, TValue> factory;

        public StaticDataCache(Func<TKey, TValue> factory, bool isThreadSafe = false, IEqualityComparer<TKey> keyEqCompr = null)
        {
            innerCache = new DataCache<TKey, TValue>(isThreadSafe, keyEqCompr);
            this.factory = factory ?? throw new ArgumentNullException(nameof(factory));
        }

        public TValue Get(TKey key)
        {
            TValue value = innerCache.GetOrCreate(key, factory);
            return value;
        }
    }
}
