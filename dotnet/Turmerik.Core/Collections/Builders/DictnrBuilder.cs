using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Collections.Builders
{
    public static class DictnrBuilder
    {
        public static Dictionary<TKey, TValue> BuildDictnr<TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>> builder)
        {
            builder(dictnr);
            return dictnr;
        }

        public static Dictionary<TKey, TValue> BuildDictnr<TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>, Func<TKey, TValue>, Action<KeyValuePair<TKey, TValue>>> builder,
            Func<TKey, TValue> valueFactory)
        {
            builder(dictnr, valueFactory, kvp => dictnr.Add(kvp.Key, kvp.Value));
            return dictnr;
        }

        public static Dictionary<TKey, TValue> BuildDictnr<T1, TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>, Func<T1, KeyValuePair<TKey, TValue>>, Action<KeyValuePair<TKey, TValue>>> builder,
            Func<T1, KeyValuePair<TKey, TValue>> valueFactory)
        {
            builder(dictnr, valueFactory, kvp => dictnr.Add(kvp.Key, kvp.Value));
            return dictnr;
        }

        public static Dictionary<TKey, TValue> BuildDictnr<T1, T2, TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>, Func<T1, T2, KeyValuePair<TKey, TValue>>, Action<KeyValuePair<TKey, TValue>>> builder,
            Func<T1, T2, KeyValuePair<TKey, TValue>> valueFactory)
        {
            builder(dictnr, valueFactory, kvp => dictnr.Add(kvp.Key, kvp.Value));
            return dictnr;
        }

        public static Dictionary<TKey, TValue> BuildDictnr<T1, T2, T3, TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>, Func<T1, T2, T3, KeyValuePair<TKey, TValue>>, Action<KeyValuePair<TKey, TValue>>> builder,
            Func<T1, T2, T3, KeyValuePair<TKey, TValue>> valueFactory)
        {
            builder(dictnr, valueFactory, kvp => dictnr.Add(kvp.Key, kvp.Value));
            return dictnr;
        }

        public static Dictionary<TKey, TValue> BuildDictnr<T1, T2, T3, T4, TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>, Func<T1, T2, T3, T4, KeyValuePair<TKey, TValue>>, Action<KeyValuePair<TKey, TValue>>> builder,
            Func<T1, T2, T3, T4, KeyValuePair<TKey, TValue>> valueFactory)
        {
            builder(dictnr, valueFactory, kvp => dictnr.Add(kvp.Key, kvp.Value));
            return dictnr;
        }

        public static Dictionary<TKey, TValue> BuildDictnr<T1, T2, T3, T4, T5, TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>, Func<T1, T2, T3, T4, T5, KeyValuePair<TKey, TValue>>, Action<KeyValuePair<TKey, TValue>>> builder,
            Func<T1, T2, T3, T4, T5, KeyValuePair<TKey, TValue>> valueFactory)
        {
            builder(dictnr, valueFactory, kvp => dictnr.Add(kvp.Key, kvp.Value));
            return dictnr;
        }

        public static Dictionary<TKey, TValue> BuildDictnr<T1, T2, T3, T4, T5, T6, TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>, Func<T1, T2, T3, T4, T5, T6, KeyValuePair<TKey, TValue>>, Action<KeyValuePair<TKey, TValue>>> builder,
            Func<T1, T2, T3, T4, T5, T6, KeyValuePair<TKey, TValue>> valueFactory)
        {
            builder(dictnr, valueFactory, kvp => dictnr.Add(kvp.Key, kvp.Value));
            return dictnr;
        }

        public static Dictionary<TKey, TValue> BuildDictnr<T1, T2, T3, T4, T5, T6, T7, TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>, Func<T1, T2, T3, T4, T5, T6, T7, KeyValuePair<TKey, TValue>>, Action<KeyValuePair<TKey, TValue>>> builder,
            Func<T1, T2, T3, T4, T5, T6, T7, KeyValuePair<TKey, TValue>> valueFactory)
        {
            builder(dictnr, valueFactory, kvp => dictnr.Add(kvp.Key, kvp.Value));
            return dictnr;
        }

        public static Dictionary<TKey, TValue> BuildDictnr<T1, T2, T3, T4, T5, T6, T7, T8, TKey, TValue>(
            this Dictionary<TKey, TValue> dictnr,
            Action<Dictionary<TKey, TValue>, Func<T1, T2, T3, T4, T5, T6, T7, T8, KeyValuePair<TKey, TValue>>, Action<KeyValuePair<TKey, TValue>>> builder,
            Func<T1, T2, T3, T4, T5, T6, T7, T8, KeyValuePair<TKey, TValue>> valueFactory)
        {
            builder(dictnr, valueFactory, kvp => dictnr.Add(kvp.Key, kvp.Value));
            return dictnr;
        }
    }
}