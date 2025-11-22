using Newtonsoft.Json.Linq;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Helpers
{
    public static class DictnrH
    {
        public static TValue GetOrAdd<TKey, TValue>(
            this IDictionary<TKey, TValue> dictnr,
            TKey key,
            Func<TKey, TValue> valueFactory)
        {
            TValue value;

            if (!dictnr.TryGetValue(key, out value))
            {
                value = valueFactory(key);
                dictnr.Add(key, value);
            }

            return value;
        }

        public static TValue GetValueOrDefault<TKey, TValue>(
            this IDictionary<TKey, TValue> dictnr,
            TKey key,
            Func<TKey, TValue> valueFactory = null)
        {
            TValue value;

            if (!dictnr.TryGetValue(key, out value))
            {
                if (valueFactory != null)
                {
                    value = valueFactory(key);
                }
                else
                {
                    value = default;
                }
            }
            return value;
        }

        public static TValue AddOrUpdate<TKey, TValue>(
            this IDictionary<TKey, TValue> dictnr,
            TKey key,
            Func<TKey, TValue> addValueFactory,
            Func<TKey, TValue, TValue> updateValueFactory)
        {
            if (!dictnr.TryGetValue(key, out var value))
            {
                value = addValueFactory(key);
            }
            else
            {
                value = updateValueFactory(key, value);
            }

            dictnr[key] = value;
            return value;
        }

        public static TValue AddOrUpdate<TKey, TValue>(
        this ConcurrentDictionary<TKey, TValue> dictnr,
        TKey key,
        Func<TKey, TValue> factory,
        UpdateDictnrValue<TKey, TValue> updateFunc)
        {
            var val = dictnr.AddOrUpdate(
            key,
                k => updateFunc(k, false, factory(k)),
                (k, v) => updateFunc(k, true, v));

            return val;
        }

        public static TValue AddOrUpdateValue<TKey, TValue>(
            this IDictionary<TKey, TValue> dictnr,
            TKey key,
            Func<TKey, TValue> factory,
            UpdateDictnrValue<TKey, TValue> updateFunc)
        {
            var val = dictnr.AddOrUpdate(
                key,
                k => updateFunc(k, false, factory(k)),
                (k, v) => updateFunc(k, true, v));

            return val;
        }

        public static Dictionary<TKey, TValue> ToDictnr<TKey, TValue>(
            this IEnumerable<KeyValuePair<TKey, TValue>> dictnr) => dictnr.ToDictionary(
                kvp => kvp.Key, kvp => kvp.Value);

        public static Dictionary<TOutKey, TOutVal> ToDictnr<TInKey, TInVal, TOutKey, TOutVal>(
            this IEnumerable<KeyValuePair<TInKey, TInVal>> dictnr,
            Func<KeyValuePair<TInKey, TInVal>, TOutKey> outKeyFactory,
            Func<KeyValuePair<TInKey, TInVal>, TOutVal> outValFactory) => dictnr.Select(
                kvp => new KeyValuePair<TOutKey, TOutVal>(
                    outKeyFactory(kvp),
                    outValFactory(kvp))).ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value);

        public static Dictionary<TOutKey, TOutVal> ToDictnr<TInKey, TInVal, TOutKey, TOutVal>(
            this IEnumerable<KeyValuePair<TInKey, TInVal>> dictnr,
            Func<TInKey, TOutKey> outKeyFactory,
            Func<TInVal, TOutVal> outValFactory) => dictnr.Select(
                kvp => new KeyValuePair<TOutKey, TOutVal>(
                    outKeyFactory(kvp.Key),
                    outValFactory(kvp.Value))).ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value);

        public static KeyValuePair<TKey, TValue> ToKvp<TKey, TValue>(
            this TKey key, TValue value) => new(key, value);
    }
}
