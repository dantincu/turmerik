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
            this List<T> list,
            Func<T, int, bool> predicate)
        {
            int removedCount = 0;
            int remainingCount = list.Count;

            int i = 0;
            int idx = 0;

            while (remainingCount > 0)
            {
                if (predicate(list[i], idx))
                {
                    list.RemoveAt(i);
                    removedCount++;
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

        public static int RemoveWhere<T>(
            this List<T> list,
            Func<T, bool> predicate) => list.RemoveWhere(
                (item, i) => predicate(item));
    }
}
