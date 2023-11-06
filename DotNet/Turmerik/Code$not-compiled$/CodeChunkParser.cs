using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Text;

namespace Turmerik.Code
{
    public interface ICodeChunkParserCore<TItem, TParser, TArgs>
        where TItem : CodeSyntaxItem<TItem>
        where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
        where TArgs : ICodeChunkParseArgsCore<TItem, TParser, TArgs>
    {
        void ParseNextNode(TArgs args);
    }

    public abstract class CodeChunkParserCoreBase<TItem, TParser, TArgs> : ICodeChunkParserCore<TItem, TParser,TArgs>
        where TItem : CodeSyntaxItem<TItem>
        where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
        where TArgs : ICodeChunkParseArgsCore<TItem, TParser, TArgs>
    {
        public abstract void ParseNextNode(
            TArgs args);

        protected KeyValuePair<int, char> GetNextNonWsIdx(
            ISrcCode srcCode,
            out List<CodeSyntaxItem> newLinesList,
            bool stopAtFirstNewline = true) => GetNextChars(
                srcCode,
                (chr, idx) => char.IsWhiteSpace(chr),
                out newLinesList,
                stopAtFirstNewline);

        protected KeyValuePair<int, char> GetNextChars(
            ISrcCode srcCode,
            Func<char, int, bool> goNextPredicate,
            out List<CodeSyntaxItem> newLinesList,
            bool stopAtFirstNewline = true,
            bool updateIndex = true)
        {
            newLinesList = null;
            List<char> newLineChars = null;
            int idx = srcCode.Index + 1;
            char chr = srcCode[idx];
            bool @break = false;

            while (chr != default && !@break)
            {
                if (StringH.IsNewLineChar(chr))
                {
                    newLinesList ??= new List<CodeSyntaxItem>();
                    newLineChars ??= new List<char>();
                    newLineChars.Add(chr);

                    if (chr == '\n')
                    {
                        int newLineCharsCount = newLineChars.Count;

                        var newLine = new CodeSyntaxItem
                        {
                            ItemType = CodeSyntaxItemType.NwLn,
                            SrcCode = new string(newLineChars.ToArray()),
                            SrcCodeStartIdx = idx - newLineCharsCount + 1,
                            SrcCodeLength = newLineCharsCount
                        };

                        newLinesList.Add(newLine);
                        newLineChars = null;

                        if (stopAtFirstNewline)
                        {
                            @break = true;
                        }
                    }
                }

                @break = @break || !goNextPredicate(chr, idx);

                if (!@break)
                {
                    idx++;
                    chr = srcCode[idx];
                }
            }

            if (updateIndex)
            {
                srcCode.Index = idx;
            }

            return new KeyValuePair<int, char>(idx, chr);
        }
    }
}
