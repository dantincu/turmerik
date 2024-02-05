using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Notes
{
    public static class ListH
    {
        public static void AddItems<T>(
            this List<T> list,
            params T[] itemsArr)
        {
            list.AddRange(itemsArr);
        }

        public static void RemoveWhere<T>(
            this List<T> list,
            Func<T, int, bool> predicate)
        {
            int i = list.Count - 1;

            while (i >= 0)
            {
                if (predicate(list[i], i))
                {
                    list.RemoveAt(i);
                }
                else
                {
                    i--;
                }
            }
        }
    }
}
