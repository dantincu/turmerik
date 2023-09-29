using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.MkFsDirsPair.Lib
{
    public static class StringH
    {
        public static string Nullify(
            this string str,
            bool ignoreWhitespaces = false)
        {
            if (str != null)
            {
                string checkStr = str;

                if (ignoreWhitespaces)
                {
                    checkStr = checkStr.Trim();
                }

                if (string.IsNullOrEmpty(checkStr))
                {
                    str = null;
                }
            }

            return str;
        }

        public static string JoinNotNullStr(
            this string[] strArr,
            string joinStr,
            bool? excludeAllWhitespaces = true)
        {
            if (excludeAllWhitespaces != false)
            {
                strArr = strArr.Where(str => str.Nullify(
                    excludeAllWhitespaces.HasValue) != null).ToArray();
            }

            string retStr = string.Empty;

            if (strArr.Any())
            {
                retStr = string.Join(joinStr, strArr);
            }

            return retStr;
        }
    }
}
