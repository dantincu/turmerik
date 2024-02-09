using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.Text
{
    public static partial class StringH
    {
        public static readonly ReadOnlyCollection<CharType> CaseLetterCharTypes = CharType.LowerCase.Arr(
            CharType.UpperCase, CharType.Letter).RdnlC();

        public static readonly ReadOnlyCollection<CharType> AllLetterCharTypes = CaseLetterCharTypes.Concat(
            [CharType.UnicaseLetter]).RdnlC();

        public static readonly ReadOnlyCollection<CharType> AlphaNumericCharTypes = AllLetterCharTypes.Concat(
            [CharType.AlphaNumeric]).RdnlC();

        public static string ReplaceAllChars(
            this string input,
            Dictionary<char, string> replDictnr)
        {
            int inputLen = input.Length;

            string[] partsArr = input.Split(replDictnr.Keys.ToArray());
            int maxIdx = partsArr.Length - 2;

            List<string> partsList = new List<string>();
            int i = 0;

            for (int idx = 0; idx <= maxIdx; idx++)
            {
                string part = partsArr[idx];
                partsList.Add(part);

                i += part.Length;

                if (i < inputLen)
                {
                    char c = input[i];
                    string replPart = replDictnr[c];

                    partsList.Add(replPart);
                    i += replPart.Length;
                }
            }

            partsList.Add(partsArr.Last());
            string output = string.Concat(partsList);

            return output;
        }

        public static string ReplaceAllChars(
            this string input,
            Dictionary<char, char> replDictnr)
        {
            Dictionary<char, string> strReplDictnr = replDictnr.ToArray().ToDictionary(
                kvp => kvp.Key, kvp => kvp.Value.ToString());

            string output = input.ReplaceAllChars(strReplDictnr);
            return output;
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
            Func<char, bool> replacePredicate)
        {
            replacePredicate = replacePredicate.FirstNotNull(
                c => false);

            replaceFactory = replaceFactory.FirstNotNull(
                c => c);

            char[] retChars = str.Select(
                c => replacePredicate(c) ? replaceFactory(c) : c).ToArray();

            string retStr = retChars.ToStr();
            return retStr;
        }

        public static string ReplaceChars(
            this string str,
            Func<char, char> replaceFactory,
            IEnumerable<char> replacedChars) => str.ReplaceChars(
                replaceFactory,
                c => replacedChars.Contains(c));

        public static string ReplaceChars(
            this string str,
            Func<char, char> replaceFactory) => str.ReplaceChars(
                replaceFactory,
                c => true);

        public static string ChangeChar(
            this string str,
            IdxRetriever<char, char[]> indexFactory,
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

                    str = chars.ToStr();
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

        public static CharType GetCharType(
            this char chr)
        {
            CharType charType;

            if (char.IsLetter(chr))
            {
                if (char.IsUpper(chr))
                {
                    charType = CharType.UpperCase;
                }
                else if (char.IsLower(chr))
                {
                    charType = CharType.LowerCase;
                }
                else
                {
                    charType = CharType.UnicaseLetter;
                }
            }
            else if (char.IsDigit(chr))
            {
                charType = CharType.Digit;
            }
            else
            {
                charType = CharType.NonAlphaNumeric;
            }

            return charType;
        }

        public static bool IsCaseLetter(
            this CharType charType) => CaseLetterCharTypes.Contains(charType);

        public static bool IsLetter(
            this CharType charType) => AllLetterCharTypes.Contains(charType);

        public static bool IsAlphaNumeric(
            this CharType charType) => AlphaNumericCharTypes.Contains(charType);

        public static string CamelToKebabCase(
            string inStr,
            bool toUpper = false)
        {
            var charsList = new List<char>();
            var prevCharTypesList = new List<CharType>();
            int insertUnderscoreIdxOffset = 0;
            int insertedUnderscoresCount = 0;

            for (int i = 0; i < inStr.Length; i++)
            {
                var chr = inStr[i];
                var chrType = GetCharType(chr);
                var prevCharType = prevCharTypesList.LastOrDefault();

                if (i > 0 && chr != '_' && chrType != prevCharType)
                {
                    switch (chrType)
                    {
                        case CharType.LowerCase:
                            insertUnderscoreIdxOffset = -1;

                            if (prevCharType == CharType.UpperCase)
                            {
                                if (i > 1 && prevCharTypesList[prevCharTypesList.Count - 2] == CharType.UpperCase)
                                {
                                    insertUnderscoreIdxOffset--;
                                }
                                else
                                {
                                    insertUnderscoreIdxOffset = 0;
                                }
                            }

                            break;
                        default:
                            if (prevCharType == CharType.LowerCase)
                            {
                                insertUnderscoreIdxOffset = -1;
                            }

                            break;
                    }
                }

                if (insertUnderscoreIdxOffset < 0)
                {
                    insertedUnderscoresCount++;
                    int idx = i + insertUnderscoreIdxOffset + insertedUnderscoresCount;

                    if ((insertUnderscoreIdxOffset == -1 || charsList[idx] != '_') && (
                        charsList[idx - 1] != '_'))
                    {
                        charsList.Insert(idx, '_');
                    }
                    else
                    {
                        insertedUnderscoresCount--;
                    }
                }

                if (toUpper && chrType == CharType.LowerCase)
                {
                    chr = char.ToUpperInvariant(chr);
                }

                charsList.Add(chr);
                insertUnderscoreIdxOffset = 0;
                prevCharTypesList.Add(chrType);
            }

            var retStr = new string(charsList.ToArray());
            return retStr;
        }
    }
}
