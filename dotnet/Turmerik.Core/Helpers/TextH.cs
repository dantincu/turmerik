using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.Helpers
{
    public static class TextH
    {
        public static readonly string NL = Environment.NewLine;

        public static string NwLns(int count)
        {
            string retStr = string.Concat(
                Enumerable.Range(0, count).Select(
                    i => NL).ToArray());

            return retStr;
        }

        public static bool ContainsAny(this string str, params char[] chars)
        {
            bool retVal = str.ContainsAny(chars);
            return retVal;
        }

        public static bool ContainsAny(this string str, IEnumerable<char> chars)
        {
            bool retVal = chars.Any(
                c => str.Contains(c));

            return retVal;
        }

        public static char[] GetContained(this string str, params char[] chars)
        {
            char[] retChars = str.GetContained(chars);
            return retChars;
        }

        public static char[] GetContained(this string str, IEnumerable<char> chars)
        {
            char[] retChars = chars.Where(c => str.Contains(c)).ToArray();
            return retChars;
        }

        public static string ReplaceChars(
            this string str,
            Func<char, char> replaceFactory,
            params char[] replacedChars)
        {
            string retStr = str.ReplaceChars(
                replaceFactory, replacedChars);

            return retStr;
        }

        public static string ReplaceChars(
            this string str,
            Func<char, char> replaceFactory,
            IEnumerable<char> replacedChars)
        {
            replaceFactory = replaceFactory.FirstNotNull(
                c => default);

            char[] retChars = str.Select(
                c => replacedChars.Contains(c) ? replaceFactory(c) : c).ToArray();

            string retStr = new string(retChars);
            return retStr;
        }

        public static Tuple<string, string, string> Splice(
            this string inputStr,
            Func<string, int, int> firstSplitter,
            Func<string, int, int> secondSplitter)
        {
            Tuple<string, string, string> retTpl;
            int inputLen = inputStr.Length;

            int firstIdx = firstSplitter(inputStr, inputLen);

            if (firstIdx >= 0)
            {
                string firstStr = inputStr.Substring(0, firstIdx);
                string str = inputStr.Substring(firstIdx);

                int len = str.Length;
                int secondIdx = secondSplitter(str, len);

                if (secondIdx >= 0)
                {
                    string secondStr = str.Substring(0, secondIdx);
                    string thirdStr = str.Substring(secondIdx);

                    retTpl = new Tuple<string, string, string>(
                        firstStr, secondStr, thirdStr);
                }
                else
                {
                    retTpl = new Tuple<string, string, string>(
                        firstStr, str, null);
                }
            }
            else
            {
                retTpl = new Tuple<string, string, string>(
                    inputStr, null, null);
            }

            return retTpl;
        }

        public static Tuple<string, string> SubStr(
            this string inputStr,
            Func<string, int, int> splitter)
        {
            Tuple<string, string> retTpl;
            int inputLen = inputStr.Length;

            int idx = splitter(inputStr, inputLen);

            if (idx >= 0)
            {
                string firstStr = inputStr.Substring(0, idx);
                string secondStr = inputStr.Substring(idx);

                retTpl = new Tuple<string, string>(
                    firstStr, secondStr);
            }
            else
            {
                retTpl = new Tuple<string, string>(
                    inputStr, null);
            }

            return retTpl;
        }

        public static string SubStr(
            this string inputStr,
            int startIdx,
            int length,
            bool trimEntry = false)
        {
            if (length < 0)
            {
                length = inputStr.Length - length;
                length = Math.Max(0, length);
            }
            else
            {
                length = Math.Min(length, inputStr.Length - startIdx);
            }

            string subStr = inputStr.Substring(startIdx, length);

            if (trimEntry)
            {
                subStr = subStr.Trim();
            }

            return subStr;
        }

        public static bool StrEquals(this string target, string reference, bool ignoreCase = false)
        {
            bool retVal = string.Compare(target, reference, ignoreCase) == 0;
            return retVal;
        }

        public static bool StartsWithStr(
            this string str,
            string prefix,
            bool ignoreCase,
            params string[] afterPfxAlts)
        {
            bool retVal = str.Length > prefix.Length;
            retVal = retVal && str.StartsWith(prefix, ignoreCase, CultureInfo.InvariantCulture);

            if (retVal)
            {
                str = str.Substring(prefix.Length);

                foreach (var pfx in afterPfxAlts)
                {
                    retVal = retVal && str.StartsWith(pfx, ignoreCase, CultureInfo.InvariantCulture);
                }
            }

            return retVal;
        }

        public static bool StartsWithChr(
            this string str,
            string prefix,
            bool ignoreCase,
            params char[] afterPfxAlts)
        {
            bool retVal = str.Length > prefix.Length;
            retVal = retVal && str.StartsWith(prefix, ignoreCase, CultureInfo.InvariantCulture);

            if (retVal)
            {
                var chr = str.Skip(prefix.Length).First();
                retVal = afterPfxAlts.Contains(chr);
            }

            return retVal;
        }

        public static string ChangeChar(
            this string str,
            Func<char[], int, int> indexFactory,
            Func<char, bool> condition,
            Func<char, char> factory)
        {
            if (!string.IsNullOrEmpty(str))
            {
                char[] chars = str.ToCharArray();
                int length = chars.Length;

                int idx = indexFactory(chars, length);
                char c = chars[idx];

                if (condition(c))
                {
                    c = factory(c);
                    chars[idx] = c;

                    str = new string(chars);
                }
            }

            return str;
        }

        public static string ChangeFirstChar(
            this string str,
            Func<char, bool> condition,
            Func<char, char> factory)
        {
            str = str.ChangeChar(
                (chars, len) => 0,
                condition,
                factory);

            return str;
        }

        public static string CapitalizeFirstLetter(
            this string str)
        {
            str = str.ChangeFirstChar(
                c => char.IsLower(c),
                c => char.ToUpper(c));

            return str;
        }

        public static string DecapitalizeFirstLetter(
            this string str)
        {
            str = str.ChangeFirstChar(
                c => char.IsUpper(c),
                c => char.ToLower(c));

            return str;
        }

        public static List<SplitStrTuple> SplitStr(
            this string str,
            char[] splitChars,
            bool trimEntries = false)
        {
            var tuplesList = new List<SplitStrTuple>();
            int len = str.Length;

            int stIdx = 0;

            for (int idx = 0; idx < len; idx++)
            {
                char chr = str[idx];

                if (splitChars.Contains(chr))
                {
                    string subStr = str.SubStr(stIdx, idx - stIdx, trimEntries);
                    stIdx = idx + 1;

                    var tuple = new SplitStrTuple(subStr, chr);
                    tuplesList.Add(tuple);
                }
            }

            if (stIdx < len)
            {
                string subStr = str.SubStr(stIdx, int.MaxValue, trimEntries);

                var tuple = new SplitStrTuple(subStr, default(char));
                tuplesList.Add(tuple);
            }

            return tuplesList;
        }

        public static bool IsLatinLetter(this char chr)
        {
            bool isLtnTtr = (
                chr >= 'a' && chr <= 'z') || (
                chr >= 'A' && chr <= 'Z');

            return isLtnTtr;
        }
    }
}
