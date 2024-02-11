using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.Text;
using Turmerik.Core.Text;

namespace Turmerik.Core.Helpers
{
    public static class ReflH
    {
        public static readonly Type BaseObjectType = typeof(object);
        public static readonly Type DisposableType = typeof(IDisposable);
        public static readonly Type AsyncDisposableType = typeof(IAsyncDisposable);
        public static readonly Type EnumerableBaseType = typeof(IEnumerable);

        public static string GetTypeFullDisplayName(
            this Type type,
            char stopDelim = '[') => GetTypeFullDisplayName(
                type.FullName,
                stopDelim);

        public static string GetTypeFullDisplayName(
            string typeFullName,
            char stopDelim = '[') => typeFullName?.SplitStr(
                (str, len) => str.FirstKvp((c, i) => c == stopDelim).Key).Item1;

        public static Type GetBaseType(
            Type type)
        {
            if (type == BaseObjectType)
            {
                return type;
            }
            else
            {
                return type.BaseType;
            }
        }

        public static Type GetBaseCommonType(
            Type trgType,
            Type srcType)
        {
            Type commonBaseType;

            if (trgType == srcType)
            {
                commonBaseType = trgType;
            }
            else if (trgType.IsAssignableFrom(srcType))
            {
                commonBaseType = trgType;
            }
            else if (srcType.IsAssignableFrom(trgType))
            {
                commonBaseType = srcType;
            }
            else
            {
                commonBaseType = GetBaseCommonType(
                    trgType.BaseType,
                    srcType.BaseType);
            }

            return commonBaseType;
        }

        public static bool IsDisposable(
            this Type type,
            bool alsoCheckForAsyncDisposable = false)
        {
            bool isDisposable = DisposableType.IsAssignableFrom(type);

            if (!isDisposable && alsoCheckForAsyncDisposable)
            {
                isDisposable = AsyncDisposableType.IsAssignableFrom(type);
            }

            return isDisposable;
        }
    }
}
