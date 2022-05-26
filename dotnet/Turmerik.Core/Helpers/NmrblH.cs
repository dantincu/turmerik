using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Helpers
{
    public static class NmrblH
    {
        public static IEnumerable<object> Nmrbl(this IEnumerable nmrbl)
        {
            var retVal = nmrbl.Cast<object>();
            return retVal;
        }

        public static ReadOnlyCollection<T> RdnlC<T>(this T[] arr)
        {
            var colcnt = new ReadOnlyCollection<T>(arr);
            return colcnt;
        }

        public static ReadOnlyCollection<T> RdnlC<T>(this IEnumerable<T> nmrbl)
        {
            var colcnt = nmrbl.ToArray().RdnlC();
            return colcnt;
        }

        public static ReadOnlyDictionary<TKey, TValue> RdnlD<TKey, TValue>(
            this IDictionary<TKey, TValue> dicntr)
        {
            var rdnlDictnr = new ReadOnlyDictionary<TKey, TValue>(dicntr);
            return rdnlDictnr;
        }

        public static KeyValuePair<int, T> FindVal<T>(
            this IEnumerable<T> nmrbl,
            Func<T, int, bool> predicate,
            bool retFirst = true)
        {
            T retVal = default;
            int idx = -1;

            int i = 0;

            foreach (var val in nmrbl)
            {
                if (predicate(val, i))
                {
                    if (idx >= 0)
                    {
                        throw new InvalidOperationException(
                            $"Sequence contains more than 1 element and the ${nameof(retFirst)} flag has been set to false");
                    }

                    retVal = val;
                    idx = i;

                    if (retFirst)
                    {
                        break;
                    }
                }

                i++;
            }

            return new KeyValuePair<int, T>(idx, retVal);
        }

        public static KeyValuePair<int, T> FindVal<T>(
            this IEnumerable<T> nmrbl,
            Func<T, bool> predicate,
            bool retFirst = true)
        {
            var retKvp = nmrbl.FindVal(
                (val, idx) => predicate(val), retFirst);

            return retKvp;
        }

        public static ReadOnlyCollection<TOut> RdnlC<TIn, TOut>(
            this IEnumerable<TIn> colcnt,
            Func<TIn, bool> filter,
            Func<TIn, TOut> selector)
        {
            var retColctn = colcnt.Where(filter).Select(
                selector).ToArray().RdnlC();

            return retColctn;
        }

        public static ReadOnlyCollection<TOut> RdnlC<TIn, TOut>(
            this IEnumerable<TIn> colcnt,
            Func<TIn, TOut> selector)
        {
            var retColctn = colcnt.Select(
                selector).ToArray().RdnlC();

            return retColctn;
        }

        public static ReadOnlyCollection<T> RdnlC<T>(
            this IEnumerable<T> colcnt,
            Func<T, bool> filter)
        {
            var retColctn = colcnt.Where(
                filter).ToArray().RdnlC();

            return retColctn;
        }

        public static Lazy<IReadOnlyCollection<TOut>> LzRdnlC<TIn, TOut>(
            this Lazy<IReadOnlyCollection<TIn>> lazy,
            Func<TIn, bool> filter,
            Func<TIn, TOut> selector)
        {
            var retLazy = new Lazy<IReadOnlyCollection<TOut>>(
                () => lazy.Value.RdnlC(filter, selector));

            return retLazy;
        }

        public static Lazy<IReadOnlyCollection<T>> LzRdnlC<T>(
            this Lazy<IReadOnlyCollection<T>> lazy,
            Func<T, bool> filter)
        {
            var retLazy = new Lazy<IReadOnlyCollection<T>>(
                () => lazy.Value.RdnlC(filter));

            return retLazy;
        }

        public static ReadOnlyDictionary<TKey, TValue> RdnlD<TItem, TKey, TValue>(
            this IEnumerable<TItem> nmrbl,
            Func<TItem, TKey> keySelector,
            Func<TItem, TValue> valueSelector)
        {
            var dictnr = nmrbl.ToDictionary(keySelector, valueSelector);
            var rdnlDictnr = new ReadOnlyDictionary<TKey, TValue>(dictnr);

            return rdnlDictnr;
        }

        public static Dictionary<TKey, TValue> Dictnr<TKey, TValue>(
            this IEnumerable<KeyValuePair<TKey, TValue>> nmrbl)
        {
            var dictnr = nmrbl.ToDictionary(
                kvp => kvp.Key, kvp => kvp.Value);

            return dictnr;
        }

        public static ReadOnlyDictionary<TKey, TValue> RdnlD<TKey, TValue>(
            this IEnumerable<KeyValuePair<TKey, TValue>> nmrbl)
        {
            var dictnr = nmrbl.Dictnr().RdnlD();
            return dictnr;
        }

        public static Dictionary<TKey, TValue> Dictnr<TItem, TKey, TValue>(
            this IEnumerable<TItem> nmrbl,
            Func<TItem, int, TKey> keySelector,
            Func<TItem, int, TValue> valueSelector)
        {
            var kvpNmrbl = nmrbl.Select(
                (item, idx) => new KeyValuePair<TKey, TValue>(
                    keySelector(item, idx),
                    valueSelector(item, idx)));

            var retDictnr = kvpNmrbl.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value);

            return retDictnr;
        }

        public static ReadOnlyDictionary<TKey, TValue> RdnlD<TItem, TKey, TValue>(
            this IEnumerable<TItem> nmrbl,
            Func<TItem, int, TKey> keySelector,
            Func<TItem, int, TValue> valueSelector)
        {
            var dictnr = nmrbl.Dictnr(
                keySelector, valueSelector);

            var rdnlDictnr = dictnr.RdnlD();
            return rdnlDictnr;
        }
    }
}
