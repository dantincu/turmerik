﻿using System;
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

        public static bool IsDefault<T>(
            this T value,
            IEqualityComparer<T> eqCompr = null)
        {
            eqCompr ??= EqualityComparer<T>.Default;
            bool isDefault = eqCompr.Equals(value, default);

            return isDefault;
        }
    }
}
