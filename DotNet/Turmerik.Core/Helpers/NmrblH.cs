using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Helpers
{
    public static class NmrblH
    {
        public static T[] Arr<T>(this T firstVal, params T[] nextItemsArr)
        {
            T[] retArr = new T[nextItemsArr.Length + 1];
            retArr[0] = firstVal;

            nextItemsArr.CopyTo(retArr, 1);
            return retArr;
        }

        public static List<T> Lst<T>(this T firstVal, params T[] nextItemsArr)
        {
            var list = new List<T>
            {
                firstVal
            };

            list.AddRange(nextItemsArr);
            return list;
        }

        public static TResult WithCount<TResult, TItem, TNmrbl>(
            this TNmrbl nmrbl,
            Func<TNmrbl, int, TResult> factory,
            Func<TNmrbl, int> countFunc = null) where TNmrbl : IEnumerable<TItem>
        {
            int count = countFunc.FirstNotNull(
                n => n.Count()).Invoke(nmrbl);

            var result = factory(nmrbl, count);
            return result;
        }

        public static IEnumerable<TItem> ForEach<TItem>(
            this IEnumerable<TItem> nmrbl,
            ForCallback<TItem> callback)
        {
            int idx = 0;
            var @break = new MutableValueWrapper<bool>();

            foreach (var item in nmrbl)
            {
                callback(item, idx++, @break);

                if (@break.Value)
                {
                    break;
                }
            }

            return nmrbl;
        }

        public static IEnumerable<TItem> ForEach<TItem>(
            this IEnumerable<TItem> nmrbl,
            ForEachCallback<TItem> callback) => ForEach(
                nmrbl, (item, _, @break) => callback(item, @break));

        public static IEnumerable<TItem> ForEach<TItem>(
            this IEnumerable<TItem> nmrbl,
            Action<TItem> callback) => ForEach(
                nmrbl, (item, _, _) => callback(item));

        public static ReadOnlyCollection<T> RdnlC<T>(
            this IList<T> list) => new ReadOnlyCollection<T>(list);

        public static ReadOnlyCollection<T> RdnlC<T>(
            this IEnumerable<T> nmrbl) => new ReadOnlyCollection<T>(
                nmrbl.ToArray());

        public static ReadOnlyDictionary<TKey, TValue> RdnlD<TKey, TValue>(
            this IDictionary<TKey, TValue> dictnr) => new ReadOnlyDictionary<TKey, TValue>(dictnr);

        public static Dictionary<TKey, TValue> Dictnr<TKey, TValue>(
            this IEnumerable<KeyValuePair<TKey, TValue>> kvpNmrbl) => kvpNmrbl.ToDictionary(
                kvp => kvp.Key, kvp => kvp.Value);

        public static KeyValuePair<TKey, TOutVal> ToKvp<TKey, TInVal, TOutVal>(
            this KeyValuePair<TKey, TInVal> kvp,
            Func<TInVal, TOutVal> outValFactory) => new KeyValuePair<TKey, TOutVal>(
                kvp.Key, outValFactory(kvp.Value));

        public static void AddRange<T>(
            this ICollection<T> collection,
            IEnumerable<T> itemsNmrbl)
        {
            foreach (var item in itemsNmrbl)
            {
                collection.Add(item);
            }
        }

        public static bool NmrblsAreEqual<T>(
            this IEnumerable<T> trgNmrbl,
            IEnumerable<T> refNmrbl,
            bool countAllFirst = false) => NmrblsAreEqual(
                trgNmrbl,
                refNmrbl,
                EqualityComparer<T>.Default,
                countAllFirst);

        public static bool NmrblsAreEqual<T>(
            this IEnumerable<T> trgNmrbl,
            IEnumerable<T> refNmrbl,
            IEqualityComparer<T> comparer,
            bool countAllFirst = false) => NmrblsAreEqual(
                trgNmrbl,
                refNmrbl,
                comparer.Equals,
                countAllFirst);

        public static bool NmrblsAreEqual<T>(
            this IEnumerable<T> trgNmrbl,
            IEnumerable<T> refNrmbl,
            Func<T, T, bool> comparer,
            bool countAllFirst = false)
        {
            bool areEqual = !countAllFirst || trgNmrbl.Count() == refNrmbl.Count();

            if (areEqual)
            {
                var trgNmrtr = trgNmrbl.GetEnumerator();
                var refNmrtr = refNrmbl.GetEnumerator();

                bool trgHasNext = trgNmrtr.MoveNext();
                bool refHasNext = refNmrtr.MoveNext();

                areEqual = trgHasNext == refHasNext;

                while (areEqual && trgHasNext)
                {
                    areEqual = comparer(
                        trgNmrtr.Current,
                        refNmrtr.Current);

                    if (areEqual)
                    {
                        trgHasNext = trgNmrtr.MoveNext();
                        refHasNext = refNmrtr.MoveNext();

                        areEqual = trgHasNext == refHasNext;
                    }
                }
            }

            return areEqual;
        }

        public static int CompareNmrbls<T>(
            this IEnumerable<T> trgNmrbl,
            IEnumerable<T> refNrmbl,
            Func<T, T, int> comparer,
            out int lengthsComparisonResult)
        {
            lengthsComparisonResult = trgNmrbl.Count(
                ).CompareTo(refNrmbl.Count());

            int result = lengthsComparisonResult;

            if (result == 0)
            {
                var trgNmrtr = trgNmrbl.GetEnumerator();
                var refNmrtr = refNrmbl.GetEnumerator();

                bool hasMore = trgNmrtr.MoveNext(
                    ) && refNmrtr.MoveNext();

                while (hasMore && result == 0)
                {
                    result = comparer(
                        trgNmrtr.Current,
                        refNmrtr.Current);

                    if (result == 0)
                    {
                        hasMore = trgNmrtr.MoveNext(
                            ) && refNmrtr.MoveNext();
                    }
                }
            }

            return result;
        }
    }
}
