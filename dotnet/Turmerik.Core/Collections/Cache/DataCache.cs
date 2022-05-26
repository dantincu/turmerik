using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Collections.Cache
{
    public interface IDataCache<TKey, TValue>
    {
        TValue GetOrCreate(TKey key, Func<TKey, TValue> factory);
    }

    public class DataCache<TKey, TValue> : IDataCache<TKey, TValue>
    {
        private readonly IDictionary<TKey, TValue> dictnr;
        private readonly bool isThreadSafe;

        public DataCache(bool isThreadSafe = false, IEqualityComparer<TKey> keyEqCompr = null)
        {
            dictnr = new Dictionary<TKey, TValue>(keyEqCompr ?? EqualityComparer<TKey>.Default);
            this.isThreadSafe = isThreadSafe;
        }

        public TValue GetOrCreate(TKey key, Func<TKey, TValue> factory)
        {
            TValue value;

            if (isThreadSafe)
            {
                value = GetOrCreateBlocking(key, factory);
            }
            else
            {
                value = GetOrCreateCore(key, factory);
            }

            return value;
        }

        private TValue GetOrCreateCore(TKey key, Func<TKey, TValue> factory)
        {
            TValue value;

            if (!dictnr.TryGetValue(key, out value))
            {
                value = factory(key);
            }

            return value;
        }

        private TValue GetOrCreateBlocking(TKey key, Func<TKey, TValue> factory)
        {
            TValue value;
            bool containsKey = dictnr.ContainsKey(key);

            if (containsKey)
            {
                value = dictnr[key];
            }
            else
            {
                lock (dictnr)
                {
                    value = GetOrCreateCore(key, factory);
                }
            }

            return value;
        }
    }
}
