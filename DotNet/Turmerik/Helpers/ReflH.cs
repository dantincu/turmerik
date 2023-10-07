using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Text;

namespace Turmerik.Helpers
{
    public static class ReflH
    {
        public static string GetTypeFullDisplayName(
            this Type type) => GetTypeFullDisplayName(type.FullName);

        public static string GetTypeFullDisplayName(
            string typeFullName) => typeFullName?.SplitStr(
                (str, len) => str.FirstKvp((c, i) => c == '`').Key).Item1;
    }
}
