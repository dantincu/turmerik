using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Reflection;

namespace Turmerik.Core.Helpers
{
    public static class DictnrH
    {
        public static TValue AddOrUpdateValue<TKey, TValue>(
            this ConcurrentDictionary<TKey, TValue> dictnr,
            TKey key,
            Func<TKey, TValue> factory,
            Func<TKey, bool, TValue, TValue> updateFunc)
        {
            var val = dictnr.AddOrUpdate(
                key,
                k => updateFunc(k, false, factory(k)),
                (k, v) => updateFunc(k, true, v));

            return val;
        }
    }
}
