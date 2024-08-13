using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Core.Text
{
    public static class TextMacrosH
    {
        public const string MACRO_DELIM_STR = "|";
        public const string MACRO_ESCAPED_DELIM_STR = "||";

        public static string ReplaceMacros(
            string inputStr,
            Dictionary<string, string> macrosMap) => string.Join(
                MACRO_DELIM_STR,
                inputStr.Split(
                    MACRO_ESCAPED_DELIM_STR).Select(
                    part =>
                    {
                        foreach (var kvp in macrosMap)
                        {
                            part = part.Replace(
                                kvp.Key,
                                kvp.Value);
                        }

                        return part;
                    }));
    }
}
