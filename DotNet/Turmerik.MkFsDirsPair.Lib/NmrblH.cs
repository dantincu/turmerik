using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkFsDirsPair.Lib
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

        public static KeyValuePair<int, T> FirstKvp<T>(
            this IEnumerable<T> nmrbl,
            Func<T, int, bool> predicate)
        {
            KeyValuePair<int, T> retKvp = new KeyValuePair<int, T>(-1, default);
            int idx = 0;

            foreach (T item in nmrbl)
            {
                if (predicate(item, idx))
                {
                    retKvp = new KeyValuePair<int, T>(idx, item);
                    break;
                }
                else
                {
                    idx++;
                }
            }

            return retKvp;
        }

        public static T FirstNotNull<T>(
            this T firstItem,
            params T[] nextItemsArr)
        {
            T retVal = firstItem;

            if (retVal == null)
            {
                retVal = nextItemsArr.First(
                    item => item != null);
            }

            return retVal;
        }

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
    }
}
