using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class ArrH
    {
        public static T[] AppendToArr<T>(
            this T[] arr, params T[] nextItems) => arr.Concat(nextItems).ToArray();

        public static T[] PrependToArr<T>(
            this T[] arr, params T[] nextItems) => nextItems.Concat(arr).ToArray();
    }
}
