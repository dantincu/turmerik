using System;
using System.Collections.Generic;
using System.Diagnostics.SymbolStore;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Runtime.ConstrainedExecution;
using System.Text;
using Turmerik.Code.Html;
using Turmerik.Helpers;

namespace Turmerik.Code.Xml
{
    public interface IXmlChunkParserCore<TItem, TParser, TArgs> : ICodeChunkParserCore<TItem, TParser, TArgs>
        where TItem : XmlSyntaxItem<TItem>
        where TParser : IXmlChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IXmlChunkParseArgsCore<TItem, TParser, TArgs>
    {
        void AddRemainingAsFreeText(TArgs args);
    }

    public interface IXmlChunkParser : IXmlChunkParserCore<XmlSyntaxItem, IXmlChunkParser, IXmlChunkParseArgs>
    {
    }

    public interface IXmlChunkAsyncParser : IXmlChunkParserCore<XmlSyntaxItem, IXmlChunkAsyncParser, IXmlChunkAsyncParseArgs>
    {
    }

    public abstract class XmlChunkParserCoreBase<TItem, TParser, TArgs> : CodeChunkParserCoreBase<TItem, TParser, TArgs>, IXmlChunkParserCore<TItem, TParser, TArgs>
        where TItem : XmlSyntaxItem<TItem>, new()
        where TParser : IXmlChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IXmlChunkParseArgsCore<TItem, TParser, TArgs>
    {
        public void AddRemainingAsFreeText(TArgs args)
        {
            var inputCode = args.InputCode;

            args.AddIfNotNull(
                GetTextNode(
                    inputCode, 0,
                    inputCode.Index - inputCode.Length + 1));

            inputCode.DragStartIndex();
        }

        public override void ParseNextNode(TArgs args)
        {
            var inputCode = args.InputCode;
            var state = args.ParseState;

            if (state.IsComment || state.IsCData)
            {
                HandleRawFreeTextState(args, inputCode);
            }
            else if (state.IsQuotedText)
            {
                HandleQuotedState(args, inputCode);
            }
            else if (state.IsTag)
            {
                HandleTagState(args, inputCode);
            }
            else
            {
                HandleDefaultState(args, inputCode);
            }
        }

        private void HandleDefaultState(
            TArgs args,
            ISrcCode inputCode)
        {
            var tagStartKvp = GetNextChars(
                inputCode,
                (chr, idx) => chr == '<',
                out var nwLns,
                true, false);

            bool reachedEndOfStream = inputCode.Length - tagStartKvp.Key == 1;

            if (!reachedEndOfStream)
            {
                if (IsValidTagStart(
                    inputCode,
                    tagStartKvp.Key,
                    out reachedEndOfStream,
                    out var endChar))
                {
                    var endTokenLen = nwLns?.Select(
                        nwLn => nwLn.SrcCodeLength).Sum() ?? 1;

                    args.AddIfNotNull(
                        GetTextNode(
                            args.InputCode, 0, 0,
                            nwLns));

                    if (nwLns == null)
                    {
                        var newXmlTag = args.PushIfNotNull(
                            GetNewXmlTag(
                                inputCode,
                                out var tagTypeChar,
                                out var isXmlComment,
                                out var isXmlCData))!;

                        if (newXmlTag.XmlItemType == XmlItemType.OpeningTag)
                        {
                            if (endChar == '>')
                            {
                                args.PushIfNotNull();
                            }
                            else if (endChar == '/')
                            {
                                newXmlTag.XmlItemType = XmlItemType.SelfClosingTag;
                            }
                        }
                    }

                    inputCode.Index++;
                    inputCode.DragStartIndex();
                }
            }

            if (reachedEndOfStream && tagStartKvp.Key > inputCode.Index)
            {
                args.CurrentNode = GetTextNode(
                    args.InputCode);

                args.AddIfNotNull();
                inputCode.DragStartIndex();
            }
        }

        private void HandleRawFreeTextState(
            TArgs args,
            ISrcCode inputCode)
        {
            var xmlItemType = GetRawFreeTextNodeType(
                args.ParseState.IsCData);

            (var tagEndStr,
                var tagStartStr) = XmlH.RawFreeTextXmlDeclMap[xmlItemType];

            int tagEndStrLen = tagEndStr.Length;
            int tagStartStrLen = tagStartStr.Length;

            var tagEndKvp = GetNextChars(inputCode,
                (chr, idx) => chr == '>' && inputCode.GetSubstring(
                    idx - tagEndStrLen, tagEndStrLen) == tagEndStr, out var nwLns);

            if (tagEndKvp.Value != default)
            {
                args.AddIfNotNull(
                    GetTextNode(
                        inputCode, 1 - tagStartStrLen, tagEndStrLen,
                        nwLns));

                if (tagEndKvp.Value == '>')
                {
                    var endNode = args.AddIfNotNull(
                        GetTextNode(
                            inputCode,
                            tagEndStrLen,
                            0, null,
                            CodeSyntaxItemType.Token,
                            inputCode.Index));

                    var tagEndNode = GetTokenNode(
                        inputCode,
                        tagEndKvp.Key)!;

                    args.CurrentNode!.AddTrailingToken(tagEndNode);
                    args.PopIfNotNull();
                }

                inputCode.DragStartIndex();
            }
        }

        private void HandleTagState(
            TArgs args,
            ISrcCode inputCode)
        {
            
        }

        private void HandleQuotedState(
            TArgs args,
            ISrcCode inputCode)
        {
            var quoteChar = args.CurrentNode.LeadingTokens.Last(
                ).SrcCode.Single();

            var quotedStrEndKvp = GetNextChars(inputCode,
                (chr, idx) => chr == quoteChar, out var nwLns);

            if (quotedStrEndKvp.Value != default)
            {
                if (quotedStrEndKvp.Value == quoteChar)
                {
                    var currentNode = GetTextNode(
                        args.InputCode,
                        args.InputCode.Index,
                        quotedStrEndKvp.Key);

                    args.CurrentNode.AddChildNode(currentNode);
                    args.PopIfNotNull();
                    SetAttrValue(args, inputCode);
                }
                else
                {
                    string nwLnStr = string.Concat(
                        nwLns.Select(
                            nwLn => nwLn.SrcCode).ToArray());

                    SetError(args,
                        XmlSyntaxParseError.UnexpectedNwLnInsideQuotedText,
                        quotedStrEndKvp.Key, nwLnStr);

                    args.InputCode.Index = quotedStrEndKvp.Key + 1;
                    inputCode.StartIndex = inputCode.Index;
                }

                args.InputCode.Index = quotedStrEndKvp.Key + 1;
                inputCode.StartIndex = inputCode.Index;
            }
        }

        private void SetSpecialTagCloseToken(
            TArgs args,
            ISrcCode inputCode)
        {

        }

        private void SetTagName(
            TArgs args,
            ISrcCode inputCode)
        {

        }

        private void SetAttrName(
            TArgs args,
            ISrcCode inputCode)
        {

        }

        private void SetAttrNvpJoinToken(
            TArgs args,
            ISrcCode inputCode)
        {

        }

        private void SetAttrValue(
            TArgs args,
            ISrcCode inputCode)
        {

        }

        private bool IsValidTagStart(
            ISrcCode inputCode,
            int ltTokenIdx,
            out bool reachedEndOfStream,
            out char endChar)
        {
            reachedEndOfStream = false;
            endChar = default;

            bool isValidTagStart = IsValidTagStartSymbol(
                inputCode[ltTokenIdx + 1]);

            isValidTagStart = isValidTagStart && IsValidTagStartCore(
                inputCode,
                ltTokenIdx,
                out reachedEndOfStream,
                out endChar);

            return isValidTagStart;
        }

        private bool IsValidTagStartCore(
            ISrcCode inputCode,
            int ltTokenIdx,
            out bool reachedEndOfStream,
            out char endChar)
        {
            (var startIndex, var @char, var index) = inputCode.ForEach(
                ltTokenIdx + 2, (chr, idx) => !IsValidTagSymbol(chr),
                (chr, idx) => idx + 1);

            endChar = @char;
            reachedEndOfStream = endChar.IsDefault();

            bool isValidTagStart = !reachedEndOfStream && (
                char.IsWhiteSpace(endChar) || "/>".Contains(endChar));

            return isValidTagStart;
        }

        private bool IsValidTagStartSymbol(char symbol)
        {
            bool isValid = char.IsLetter(symbol) || "/?!".Contains(symbol);
            return isValid;
        }

        private bool IsValidTagSymbol(char chr)
        {
            bool isValid = char.IsLetterOrDigit(chr);
            isValid = isValid || XmlH.TAG_NAME_VALID_CHARS.Contains(chr);

            return isValid;
        }

        private TItem? GetTextNode(
            ISrcCode inputCode,
            int stIdxOffset = 0,
            int endIdxOffset = 0,
            List<CodeSyntaxItem>? trailingNwLns = null,
            CodeSyntaxItemType? itemType = CodeSyntaxItemType.FreeText,
            int? startIdx = null) => GetItemCore<TItem>(
                inputCode, stIdxOffset, endIdxOffset, (item, endIdx) =>
                {
                    if ((itemType?.IsFreeText() ?? false) && string.IsNullOrWhiteSpace(item.SrcCode))
                    {
                        itemType = CodeSyntaxItemType.AllWs;
                    }

                    item.ItemType = itemType;
                    item.TrailingTokens = trailingNwLns;
                }, startIdx);

        private CodeSyntaxItem? GetTokenNode(
            ISrcCode inputCode,
            int stIdxOffset = 0,
            int length = 1) => GetItemCore<CodeSyntaxItem>(
                inputCode, stIdxOffset, stIdxOffset - length, (item, endIdx) =>
                {
                    item.ItemType = CodeSyntaxItemType.Token;
                }, inputCode.Index);

        private TItem? GetItem(
            ISrcCode inputCode,
            int stIdxOffset,
            int endIdxOffset,
            Action<TItem, int> builder,
            int? startIdx = null) => GetItemCore(
                inputCode,
                stIdxOffset,
                endIdxOffset,
                builder,
                startIdx);

        private TRetItem? GetItemCore<TRetItem>(
            ISrcCode inputCode,
            int stIdxOffset,
            int endIdxOffset,
            Action<TRetItem, int> builder,
            int? startIdx = null)
            where TRetItem : CodeSyntaxItem<TRetItem>, new() => GetText(
                inputCode,
                out int stIdx,
                out int endIdx,
                out int length,
                stIdxOffset,
                endIdxOffset,
                startIdx)?.With(text => new TRetItem
                {
                    SrcCode = text,
                    SrcCodeStartIdx = stIdx,
                    SrcCodeLength = length,
                }.ActWith(item => builder(item, endIdx)));

        private TItem GetNewXmlTag(
            ISrcCode inputCode,
            out char tagTypeChar,
            out bool isXmlComment,
            out bool isXmlCData,
            int stIdxOffset = 0)
        {
            tagTypeChar = inputCode[inputCode.Index + stIdxOffset + 1];
            isXmlComment = isXmlCData = false;

            var xmlItemType = GetXmlTagType(tagTypeChar);

            if (xmlItemType == XmlItemType.XmlDeclaration)
            {
                var rawFreeTextXmlDecl = XmlH.RawFreeTextXmlDeclMap.FirstKvp(
                    kvp => MatchesRawFreeTextTagStart(
                        inputCode, kvp.Value, stIdxOffset));

                if (rawFreeTextXmlDecl.Key >= 0)
                {
                    xmlItemType = rawFreeTextXmlDecl.Value.Key;
                }
            }

            var item = new TItem
            {
                XmlItemType = xmlItemType,
                LeadingTokens = GetTokenNode(
                    inputCode, stIdxOffset)!.Arr().ToList()
            };

            return item;
        }

        private bool MatchesRawFreeTextTagStart(
            ISrcCode inputCode,
            Tuple<string, string> specialTagDelims,
            int stIdxOffset = 0)
        {
            (var tagStart, var tagEnd) = specialTagDelims;

            string subStr = inputCode.GetSubstring(
                inputCode.Index + stIdxOffset, tagStart.Length);

            bool matches = subStr == tagStart;
            return matches;
        }

        private XmlItemType GetXmlTagType(
            char tagTypeChar)
        {
            XmlItemType xmlTagType;

            switch (tagTypeChar)
            {
                case '/':
                    xmlTagType = XmlItemType.ClosingTag;
                    break;
                case '?':
                    xmlTagType = XmlItemType.XmlProcInstr;
                    break;
                case '!':
                    xmlTagType = XmlItemType.XmlDeclaration;
                    break;
                default:
                    xmlTagType = XmlItemType.OpeningTag;
                    break;
            }

            return xmlTagType;
        }

        private string? GetText(
            ISrcCode inputCode,
            out int stIdx,
            out int endIdx,
            out int length,
            int stIdxOffset = 0,
            int endIdxOffset = 0,
            int? startIdx = null)
        {
            stIdx = (startIdx ?? inputCode.StartIndex) - stIdxOffset;
            endIdx = inputCode.Index - endIdxOffset;

            length = endIdx - stIdx;

            string text = null;

            if (length > 0)
            {
                text = inputCode.GetSubstring(
                    stIdx, length);
            }

            return text;
        }

        private XmlItemType GetRawFreeTextNodeType(
            bool isCData) => isCData switch
            {
                false => XmlItemType.XmlComment,
                true => XmlItemType.XmlCDataSection,
            };

        private void SetError(
            TArgs args,
            XmlSyntaxParseError errorType,
            int invalidStrStIdx,
            string invalidStr)
        {
            args.ParseState.Error = new XmlSyntaxParseErrorData
            {
                ErrorType = errorType,
                InvalidStrStIdx = invalidStrStIdx,
                InvalidStr = invalidStr,
            };

            args.Stop = true;
        }
    }

    public class XmlChunkParser : XmlChunkParserCoreBase<XmlSyntaxItem, IXmlChunkParser, IXmlChunkParseArgs>, IXmlChunkParser
    {
    }

    public class XmlChunkAsyncParser : XmlChunkParserCoreBase<XmlSyntaxItem, IXmlChunkAsyncParser, IXmlChunkAsyncParseArgs>, IXmlChunkAsyncParser
    {
    }
}
