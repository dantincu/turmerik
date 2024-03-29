﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public static class ActivatorH
    {
        public static T CreateFromSrc<T>(
            this object src,
            Type type = null,
            params object[] argsArr)
        {
            type ??= typeof(T);
            argsArr = src.Arr(argsArr);

            var retObj = (T)Activator.CreateInstance(
                type, argsArr);

            return retObj;
        }

        public static object? GetTypeDefaultValue(
            this Type type)
        {
            object? defaultValue;

            if (type.IsValueType)
            {
                defaultValue = Activator.CreateInstance(type);
            }
            else
            {
                defaultValue = null;
            }

            return defaultValue;
        }
    }
}
