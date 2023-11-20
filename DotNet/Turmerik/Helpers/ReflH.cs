using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Text;

namespace Turmerik.Helpers
{
    public static class ReflH
    {
        public static string GetTypeFullDisplayName(
            this Type type,
            char stopDelim = '[') => GetTypeFullDisplayName(
                type.FullName,
                stopDelim);

        public static string GetTypeFullDisplayName(
            string typeFullName,
            char stopDelim = '[') => typeFullName?.SplitStr(
                (str, len) => str.FirstKvp((c, i) => c == stopDelim).Key).Item1;
    }
}
