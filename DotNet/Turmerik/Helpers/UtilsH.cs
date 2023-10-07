using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Helpers
{
    public static class UtilsH
    {
        public static T SafeCast<T>(
            this object obj,
            Func<T> defaultValueFactory = null)
        {
            T retVal;

            if (obj is T value)
            {
                retVal = value;
            }
            else if (defaultValueFactory != null)
            {
                retVal = defaultValueFactory();
            }
            else
            {
                retVal = default(T);
            }

            return retVal;
        }
    }
}
