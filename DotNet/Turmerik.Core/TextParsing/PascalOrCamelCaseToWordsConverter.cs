using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.Core.TextParsing
{
    public interface IPascalOrCamelCaseToWordsConverter
    {
        string[] SplitIntoWords(
            PascalOrCamelCaseToWordsConverterOpts opts,
            bool normalizeOpts = true);

        PascalOrCamelCaseToWordsConverterOpts NormalizeOpts(
            PascalOrCamelCaseToWordsConverterOpts opts);
    }

    public class PascalOrCamelCaseToWordsConverter : IPascalOrCamelCaseToWordsConverter
    {
        public string[] SplitIntoWords(
            PascalOrCamelCaseToWordsConverterOpts opts,
            bool normalizeOpts = true)
        {
            opts = NormalizeOptsIfReq(opts, normalizeOpts);
            List<string> retList = new();
            string inputStr = opts.InputStr;
            var removableChars = opts.RemovableChars;

            if (!string.IsNullOrEmpty(inputStr))
            {
                int wordStartIdx = 0;
                char nextChr = inputStr[0];
                var isLetter = char.IsLetter(nextChr);
                bool isUpperLetter = isLetter && char.IsUpper(nextChr);
                var nextIsLetter = isLetter;
                int inputStrMaxIdx = inputStr.Length - 1;

                Action<char, int, bool> addCurrentWord = (nextChr, i, nextCharSymbolType) =>
                {
                    string word = inputStr.Skip(wordStartIdx).Take(i - wordStartIdx).Where(
                        c => !removableChars.Contains(c)).ToArray().With(
                        chrArr => new string(chrArr));

                    if (word.Length > 0)
                    {
                        retList.Add(word);
                    }

                    wordStartIdx = i;
                    isLetter = nextCharSymbolType;
                    isUpperLetter = isLetter && char.IsUpper(nextChr);
                };

                for (int i = 1; i <= inputStrMaxIdx; i++)
                {
                    nextChr = inputStr[i];
                    nextIsLetter = char.IsLetter(nextChr);

                    if (nextIsLetter != isLetter)
                    {
                        addCurrentWord(nextChr, i, nextIsLetter);
                    }
                    else if (isLetter)
                    {
                        if (char.IsUpper(nextChr))
                        {
                            if (!isUpperLetter || i < inputStrMaxIdx && char.IsLower(inputStr[i + 1]))
                            {
                                addCurrentWord(nextChr, i, nextIsLetter);
                            }
                        }
                    }
                }

                addCurrentWord(nextChr, inputStrMaxIdx + 1, nextIsLetter);
            }

            if (opts.CapitalizeFirst)
            {
                retList.UpdateAt(0,
                    word => word.CapitalizeFirstLetter());
            }
            else if (opts.DecapitalizeAll)
            {
                retList.UpdateWhere(
                    word => true,
                    word => word.ToLowerInvariant());
            }

            return retList.ToArray();
        }

        public PascalOrCamelCaseToWordsConverterOpts NormalizeOpts(
            PascalOrCamelCaseToWordsConverterOpts opts)
        {
            opts = new(opts);
            opts.RemovableChars ??= ['.'];
            return opts;
        }

        private PascalOrCamelCaseToWordsConverterOpts NormalizeOptsIfReq(
            PascalOrCamelCaseToWordsConverterOpts opts,
            bool normalizeOpts)
        {
            if (normalizeOpts)
            {
                opts = NormalizeOpts(opts);
            }

            return opts;
        }
    }
}
