using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Core.TextStream
{
    public interface IDelimCharsExtractor
    {
        string[] SplitStr(
            string inStr,
            char delim,
            char altEmptyChar);

        string[] SplitStr(
            string str,
            char delim,
            char startDelim,
            char altEmptyChar,
            out bool startsWithDelim,
            bool onlySplitIfStartsWithDelim = true);

        string TrimStr(
            string str,
            char startDelim,
            out bool startsWithDelim);
    }

    public class DelimCharsExtractor : IDelimCharsExtractor
    {
        public string[] SplitStr(
            string inStr,
            char delim,
            char altEmptyChar)
        {
            var strList = new List<string>();
            var chrList = new List<char>();
            char prevChar = default;

            for (int i = 0; i < inStr.Length; i++)
            {
                char chr = inStr[i];

                if (chr == delim)
                {
                    if (prevChar == delim)
                    {
                        chrList.Add(chr);
                        prevChar = default;
                    }
                    else
                    {
                        prevChar = chr;
                    }
                }
                else if (chr == altEmptyChar)
                {
                    if (prevChar == altEmptyChar)
                    {
                        chrList.Add(chr);
                        prevChar = default;
                    }
                    else
                    {
                        if (prevChar == delim)
                        {
                            strList.Add(
                                new string(
                                    chrList.ToArray()));

                            chrList.Clear();
                        }

                        prevChar = chr;
                    }
                }
                else
                {
                    if (prevChar == delim)
                    {
                        strList.Add(
                            new string(
                                chrList.ToArray()));

                        chrList.Clear();
                    }

                    chrList.Add(chr);
                    prevChar = chr;
                }
            }

            strList.Add(
                new string(
                    chrList.ToArray()));

            if (prevChar == delim)
            {
                strList.Add("");
            }

            return strList.ToArray();
        }

        public string[] SplitStr(
            string str,
            char delim,
            char startDelim,
            char altSpaceChar,
            out bool startsWithDelim,
            bool onlySplitIfStartsWithDelim = true)
        {
            str = TrimStr(str,
                startDelim,
                out startsWithDelim);

            string[] strArr;

            if (startsWithDelim || !onlySplitIfStartsWithDelim)
            {
                strArr = SplitStr(
                    str, delim,
                    altSpaceChar);
            }
            else
            {
                strArr = [str];
            }

            return strArr;
        }

        public string TrimStr(
            string str,
            char startDelim,
            out bool startsWithDelim)
        {
            startsWithDelim = str.FirstOrDefault() == startDelim;
            bool startsWithDblDelim = startsWithDelim && str.Length > 1 && str[1] == startDelim;
            startsWithDelim = startsWithDelim && !startsWithDblDelim;

            if (startsWithDelim || startsWithDblDelim)
            {
                str = str.Substring(1);
            }

            return str;
        }
    }
}
