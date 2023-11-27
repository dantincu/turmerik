using System;
using System.Collections.Generic;
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
    }
}
