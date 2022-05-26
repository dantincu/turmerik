using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Data;

namespace Turmerik.Core.Helpers
{
    public static class MsStrValuesH
    {
        public static void AddValue<T>(
            this IDictionary<string, StringValues> headers,
            string key,
            T value)
        {
            headers.Add(key, value?.ToString());
        }

        public static StringValues? GetStr(
            this IDictionary<string, StringValues> queryStrings,
            string key)
        {
            StringValues? result;
            StringValues value;

            if (queryStrings.TryGetValue(key, out value))
            {
                result = value;
            }
            else
            {
                result = null;
            }

            return result;
        }

        public static T? GetNullableValue<T>(
            this IDictionary<string, StringValues> queryStrings,
            string key,
            TryParseVal<StringValues, T> factory)
            where T : struct
        {
            T? retVal;
            var value = queryStrings.GetStr(key);

            T val;

            if (value.HasValue && factory(value.Value, out val))
            {
                retVal = val;
            }
            else
            {
                retVal = null;
            }

            return retVal;
        }

        public static T GetValueOrNull<T>(
            this IDictionary<string, StringValues> queryStrings,
            string key,
            TryParseVal<StringValues, T> factory)
            where T : class
        {
            var value = queryStrings.GetStr(key);
            T retVal;

            if (!value.HasValue || !factory(value.Value, out retVal))
            {
                retVal = null;
            }

            return retVal;
        }

        public static string GetStringOrNull(
            this IDictionary<string, StringValues> queryStrings,
            string key)
        {
            string value = queryStrings.GetValueOrNull(
                key,
                (StringValues strVal, out string val) =>
                {
                    bool retVal = strVal.Any() && strVal.Skip(1).None();

                    if (retVal)
                    {
                        val = strVal.Single();
                    }
                    else
                    {
                        val = null;
                    }

                    return retVal;
                });

            return value;
        }
    }
}
