using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Text
{
    public static partial class StringH
    {
        public static Tuple<string, string> SplitStr(
            this string inputStr,
            IdxRetriever<char, string> splitter)
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

        public static string SliceStr(
            this string inputStr,
            int startIdx,
            int count,
            bool trimEntry = false)
        {
            int startIdxVal, length;

            if (startIdx >= 0)
            {
                startIdxVal = startIdx;

                if (count >= 0)
                {
                    length = count;
                }
                else
                {
                    length = inputStr.Length - startIdx + count + 1;
                }
            }
            else
            {
                if (count >= 0)
                {
                    length = count;
                    startIdxVal = inputStr.Length + startIdx;
                }
                else
                {
                    length = -1 * count;
                    startIdxVal = inputStr.Length + startIdx - length;
                }
            }

            string subStr = inputStr.Substring(startIdxVal, length);

            if (trimEntry)
            {
                subStr = subStr.Trim();
            }

            return subStr;
        }

        public static bool StartsWithStr(
            this string inputStr,
            int startIdx,
            string searchedStr)
        {
            int strLen = searchedStr.Length;
            int endIdx = strLen + startIdx;
            bool startsWith = endIdx < inputStr.Length;

            if (startsWith)
            {
                for (int i = 0; i < strLen; i++)
                {
                    int idx = startIdx + i;
                    startsWith = inputStr[idx] == searchedStr[i];

                    if (!startsWith)
                    {
                        break;
                    }
                    else
                    {
                        i++;
                    }
                }
            }

            return startsWith;
        }

        public static bool EndsWithStr(
            this string inputStr,
            int endIdx,
            string searchedStr)
        {
            int strLen = searchedStr.Length;
            int startIdx = endIdx - strLen;
            bool startsWith = startIdx > 0;

            if (startsWith)
            {
                for (int i = 0; i < strLen; i++)
                {
                    int idx = startIdx + i;
                    startsWith = inputStr[idx] == searchedStr[i];

                    if (!startsWith)
                    {
                        break;
                    }
                    else
                    {
                        i++;
                    }
                }
            }

            return startsWith;
        }
    }
}
