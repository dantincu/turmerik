using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class ListH
    {
        public static void AddItems<T>(
            this List<T> list,
            params T[] itemsArr)
        {
            list.AddRange(itemsArr);
        }

        public static int RemoveWhere<T>(
            this IList<T> list,
            Func<T, int, bool?> predicate) => RemoveWhere(
                list,
                predicate,
                (lst, i) => lst[i],
                (lst, i) => lst.RemoveAt(i),
                lst => lst.Count);

        public static int RemoveWhere<T>(
            this IList<T> list,
            Func<T, int, bool> predicate) => list.RemoveWhere(
                (item, i) => (bool?)predicate(item, i));

        public static int RemoveWhere<T>(
            this IList<T> list,
            Func<T, bool> predicate) => list.RemoveWhere(
                (item, i) => predicate(item));

        public static int RemoveWhere<T>(
            this List<T> list,
            Func<T, int, bool?> predicate) => RemoveWhere(
                list,
                predicate,
                (lst, i) => lst[i],
                (lst, i) => lst.RemoveAt(i),
                lst => lst.Count);

        public static int RemoveWhere<T>(
            this List<T> list,
            Func<T, int, bool> predicate) => list.RemoveWhere(
                (item, i) => (bool?)predicate(item, i));

        public static int RemoveWhere<T>(
            this List<T> list,
            Func<T, bool> predicate) => list.RemoveWhere(
                (item, i) => predicate(item));

        public static int RemoveWhere<T, TList>(
            TList list,
            Func<T, int, bool?> predicate,
            Func<TList, int, T> getFunc,
            Action<TList, int> removeFunc,
            Func<TList, int> countFunc)
             where TList : IList<T>
        {
            int removedCount = 0;
            int remainingCount = countFunc(list);

            int i = 0;
            int idx = 0;

            while (remainingCount > 0)
            {
                var remove = predicate(getFunc(list, i), idx);

                if (remove == true)
                {
                    removeFunc(list, i);
                    removedCount++;
                }
                else if (!remove.HasValue)
                {
                    break;
                }
                else
                {
                    i++;
                }

                remainingCount--;
                idx++;
            }

            return removedCount;
        }

        public static T[] UpdateWhere<T>(
            this T[] list,
            Func<T, int, bool?> predicate,
            Func<T, int, T> convertor) => UpdateWhere(
                list,
                predicate,
                convertor,
                (lst, i) => lst[i],
                (lst, i, item) => lst[i] = item,
                lst => lst.Length);

        public static T[] UpdateWhere<T>(
            this T[] list,
            Func<T, int, bool> predicate,
            Func<T, int, T> convertor) => UpdateWhere(
                list,
                (item, i) => (bool?)predicate(item, i),
                convertor);

        public static T[] UpdateWhere<T>(
            this T[] list,
            Func<T, bool> predicate,
            Func<T, T> convertor) => UpdateWhere(
                list,
                (item, i) => predicate(item),
                (item, i) => convertor(item));

        public static IList<T> UpdateWhere<T>(
            this IList<T> list,
            Func<T, int, bool?> predicate,
            Func<T, int, T> convertor) => UpdateWhere(
                list,
                predicate,
                convertor,
                (lst, i) => lst[i],
                (lst, i, item) => lst[i] = item,
                lst => lst.Count);

        public static IList<T> UpdateWhere<T>(
            this IList<T> list,
            Func<T, int, bool> predicate,
            Func<T, int, T> convertor) => UpdateWhere(
                list,
                (item, i) => (bool?)predicate(item, i),
                convertor);

        public static IList<T> UpdateWhere<T>(
            this IList<T> list,
            Func<T, bool> predicate,
            Func<T, T> convertor) => UpdateWhere(
                list,
                (item, i) => predicate(item),
                (item, i) => convertor(item));

        public static List<T> UpdateWhere<T>(
            this List<T> list,
            Func<T, int, bool?> predicate,
            Func<T, int, T> convertor) => UpdateWhere(
                list,
                predicate,
                convertor,
                (lst, i) => lst[i],
                (lst, i, item) => lst[i] = item,
                lst => lst.Count);

        public static List<T> UpdateWhere<T>(
            this List<T> list,
            Func<T, int, bool> predicate,
            Func<T, int, T> convertor) => UpdateWhere(
                list,
                (item, i) => (bool?)predicate(item, i),
                convertor);

        public static List<T> UpdateWhere<T>(
            this List<T> list,
            Func<T, bool> predicate,
            Func<T, T> convertor) => UpdateWhere(
                list,
                (item, i) => predicate(item),
                (item, i) => convertor(item));

        public static TList UpdateWhere<T, TList>(
            TList list,
            Func<T, int, bool?> predicate,
            Func<T, int, T> convertor,
            Func<TList, int, T> getFunc,
            Action<TList, int, T> updateFunc,
            Func<TList, int> countFunc)
             where TList : IList<T>
        {
            int count = countFunc(list);

            for (int i = 0; i < count; i++)
            {
                var item = getFunc(list, i);
                var update = predicate(item, i);

                if (update == true)
                {
                    var newItem = convertor(item, i);
                    updateFunc(list, i, newItem);
                }
                else if (!update.HasValue)
                {
                    break;
                }
            }

            return list;
        }

        public static T UpdateAt<T>(
            this T[] list,
            int idx,
            Func<T, int, T> convertor) => UpdateAt(
                list, idx, convertor,
                (lst, i) => lst[i],
                (lst, i, val) => lst[i] = val);

        public static T UpdateAt<T>(
            this T[] list,
            int idx,
            Func<T, T> convertor) => UpdateAt(
                list, idx, (val, i) => convertor(val));

        public static T UpdateAt<T>(
            this IList<T> list,
            int idx,
            Func<T, int, T> convertor) => UpdateAt(
                list, idx, convertor,
                (lst, i) => lst[i],
                (lst, i, val) => lst[i] = val);

        public static T UpdateAt<T>(
            this IList<T> list,
            int idx,
            Func<T, T> convertor) => UpdateAt(
                list, idx, (val, i) => convertor(val));

        public static T UpdateAt<T>(
            this List<T> list,
            int idx,
            Func<T, int, T> convertor) => UpdateAt(
                list, idx, convertor,
                (lst, i) => lst[i],
                (lst, i, val) => lst[i] = val);

        public static T UpdateAt<T>(
            this List<T> list,
            int idx,
            Func<T, T> convertor) => UpdateAt(
                list, idx, (val, i) => convertor(val));

        public static T UpdateAt<T, TList>(
            this TList list,
            int idx,
            Func<T, int, T> convertor,
            Func<TList, int, T> getFunc,
            Action<TList, int, T> updateFunc)
            where TList : IList<T>
        {
            var item = getFunc(list, idx);
            var newItem = convertor(item, idx);
            updateFunc(list, idx, newItem);
            return item;
        }

        public static int DistinctOnly<T, TList>(
            this TList list,
            Func<TList, int, T> getFunc,
            Action<TList, int> removeFunc,
            Func<TList, int> countFunc,
            Func<T, T, bool> equalsPredicate)
        {
            int removedCount = 0;
            int remainingCount = countFunc(list);

            int idx = 0;

            while (idx < remainingCount)
            {
                var trgItem = getFunc(list, idx);
                int i = idx + 1;

                while (i < remainingCount)
                {
                    var refItem = getFunc(list, i);

                    if (equalsPredicate(refItem, trgItem))
                    {
                        removeFunc(list, i);
                        removedCount++;
                        remainingCount--;
                    }
                    else
                    {
                        i++;
                    }
                }

                idx++;
            }

            return removedCount;
        }

        public static int DistinctOnly<T>(
            this IList<T> list,
            Func<T, T, bool> equalsPredicate) => DistinctOnly(
                list, (lst, i) => lst[i],
                (lst, i) => lst.RemoveAt(i),
                lst => lst.Count,
                equalsPredicate);

        public static int DistinctOnly<T>(
            this List<T> list,
            Func<T, T, bool> equalsPredicate) => DistinctOnly(
                list, (lst, i) => lst[i],
                (lst, i) => lst.RemoveAt(i),
                lst => lst.Count,
                equalsPredicate);
    }
}
