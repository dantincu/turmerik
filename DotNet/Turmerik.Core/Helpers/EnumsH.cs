using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class EnumsH
    {
        public static TEnum AsEnum<TEnum>(
            this int intVal)
            where TEnum : struct, Enum => (TEnum)(object)intVal;

        public static TEnum[] GetValues<TEnum>(
            ) where TEnum : struct, Enum => Enum.GetValues(
                typeof(TEnum)).Cast<TEnum>().ToArray();
    }
}
