using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Turmerik.Core.Helpers
{
    public static class UtilH
    {
        public static TResult WithHelper<THelper, TResult>(this THelper helper, Func<THelper, TResult> action)
        {
            TResult result = action(helper);
            return result;
        }

        public static void WithHelper<THelper>(this THelper helper, Action<THelper> action)
        {
            action(helper);
        }

        public static T FirstNotNull<T>(this T first, params T[] next)
        {
            T retVal = first;
            int i = 0;

            int len = next.Length;

            while (retVal == null && i < len)
            {
                retVal = next[i++];
            }

            return retVal;
        }

        public static T FirstNotNull<T>(this T first, params Func<T>[] next)
        {
            T retVal = first;
            int i = 0;

            int len = next.Length;

            while (retVal == null && i < len)
            {
                retVal = next[i++].Invoke();
            }

            return retVal;
        }

        public static bool Is<T>(this T value, Func<T, bool> predicate)
        {
            bool retVal = predicate(value);
            return retVal;
        }

        public static int ForEach<T>(this T[] list, params Action<T, int>[] callbacks)
        {
            int retVal = list.ForEach(null, callbacks);
            return retVal;
        }

        public static int ForEach<T>(this T[] list, Func<int, T> factory, params Action<T, int>[] callbacks)
        {
            int listLen = list.Length;
            int len = callbacks.Length;

            for (int i = 0; i < callbacks.Length; i++)
            {
                bool invoke = true;
                T value;

                if (i < listLen)
                {
                    value = list[i];
                }
                else if (factory != null)
                {
                    value = factory(i);
                }
                else
                {
                    invoke = false;
                    value = default;
                }

                if (invoke)
                {
                    var callback = callbacks[i];
                    callback(value, i);
                }
            }

            int retVal = listLen - len;
            return retVal;
        }

        public static async Task InvokeAsyncIfReq(
            this Func<Task> action,
            Func<bool> condition = null)
        {
            if (action != null && (condition?.Invoke() ?? true))
            {
                await action();
            }
        }

        public static async Task<TOut> InvokeAsyncIfReq<TOut>(
            this Func<Task<TOut>> action,
            Func<bool> condition = null)
        {
            TOut retVal;

            if (action != null && (condition?.Invoke() ?? true))
            {
                retVal = await action();
            }
            else
            {
                retVal = default;
            }

            return retVal;
        }

        public static async Task InvokeAsyncIfReq<TIn>(
            this Func<TIn, Task> action,
            TIn inVal,
            Func<TIn, bool> condition = null)
        {
            if (action != null && (condition?.Invoke(inVal) ?? true))
            {
                await action(inVal);
            }
        }

        public static async Task<TOut> InvokeAsyncIfReq<TIn, TOut>(
            this Func<TIn, Task<TOut>> action,
            TIn inVal,
            Func<TIn, bool> condition = null)
        {
            TOut retVal;

            if (action != null && (condition?.Invoke(inVal) ?? true))
            {
                retVal = await action(inVal);
            }
            else
            {
                retVal = default;
            }

            return retVal;
        }
    }
}
