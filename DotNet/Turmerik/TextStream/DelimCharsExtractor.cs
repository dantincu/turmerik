using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.TextStream
{
    public interface IDelimCharsExtractor
    {
        string[] SplitStr(
            string inStr,
            char delim);

        string[] SplitStr(
            string str,
            char delim,
            char startDelim,
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
            char delim)
        {
            var strList = new List<string>();
            var chrList = new List<char>();
            char prevChar = default;

            for (int i = 0; i < inStr.Length; i++)
            {
                char chr = inStr[i];

                if (chr == delim)
                {
                    if (prevChar != default && prevChar != delim)
                    {
                        strList.Add(
                            new string(
                                chrList.ToArray()));

                        chrList.Clear();
                    }
                    else if (prevChar == delim)
                    {
                        chrList.Add(delim);
                        prevChar = default;
                    }
                }
                else
                {
                    chrList.Add(chr);
                }

                prevChar = chr;
            }

            strList.Add(
                new string(
                    chrList.ToArray()));

            return strList.ToArray();
        }

        public string[] SplitStr(
            string str,
            char delim,
            char startDelim,
            out bool startsWithDelim,
            bool onlySplitIfStartsWithDelim = true)
        {
            str = TrimStr(str, startDelim,
                out startsWithDelim);

            string[] strArr;

            if (startsWithDelim || !onlySplitIfStartsWithDelim)
            {
                strArr = SplitStr(str, delim);
            }
            else
            {
                strArr = new string[] { str };
            }

            return strArr;
        }

        public string TrimStr(
            string str,
            char startDelim,
            out bool startsWithDelim)
        {
            startsWithDelim = str.FirstOrDefault() == startDelim;
            startsWithDelim = startsWithDelim && (str.Length == 1 || str[1] != startDelim);

            if (startsWithDelim)
            {
                str = str.Substring(1);
            }

            return str;
        }
    }
}
