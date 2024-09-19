using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class ArrH
    {
        public static TItem[] ToArray<TItem>(
            this Array array,
            Func<object, int, TItem> itemFactory)
        {
            var retArr = new TItem[array.Length];

            for (int i = 0; i < array.Length; i++)
            {
                retArr[i] = itemFactory(
                    array.GetValue(i), i);
            }

            return retArr;
        }

        public static TItem[] ToArray<TItem>(
            this Array array,
            Func<object, TItem> itemFactory) => ToArray(
                array, (value, idx) => itemFactory(value));

        public static object[] ToArray(
            this Array array) => ToArray(
                array, (value, idx) => value);

        public static T[] AppendToArr<T>(
            this T[] arr, params T[] nextItems) => arr.Concat(nextItems).ToArray();

        public static T[] PrependToArr<T>(
            this T[] arr, params T[] nextItems) => nextItems.Concat(arr).ToArray();
    }
}
