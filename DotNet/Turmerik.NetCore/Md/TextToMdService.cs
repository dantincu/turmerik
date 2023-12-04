using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.NetCore.Md
{
    public class TextToMdService
    {
        public const string MD_QUOTED_LINE_START_STR = ">";
        public const string MD_TABLE_CELL_DELIM_STR = "|";
        public const string MD_TABLE_HEADER_ROW_DELIM_CELL_STR = "--";

        public string SrcTextToMdTable(
            TextToMdTableOpts opts)
        {
            string outputText;
            string inputText = opts.InputText;
            string separator = opts.Separator;
            bool insertSpacesBetweenTokens = opts.InsertSpacesBetweenTokens;

            if (!string.IsNullOrWhiteSpace(
                inputText))
            {
                int? headerCellsCount = null;

                outputText = ConvertText(
                    inputText, (line, idx) =>
                    {
                        string outputText = SrcTextLineToMdTableLine(
                            line, separator,
                            out int cellsCount,
                            insertSpacesBetweenTokens);

                        headerCellsCount ??= cellsCount;
                        return outputText;
                    },
                    null, outputLines =>
                    {
                        string mdTableCellDelimStr = GetMdTableCellDelimStr(
                            insertSpacesBetweenTokens);

                        if (opts.FirstLineIsHeader)
                        {
                            string headerDelimLine = Enumerable.Range(
                                0, headerCellsCount!.Value).Select(
                                idx => MD_TABLE_HEADER_ROW_DELIM_CELL_STR).ToArray().JoinStr(
                                mdTableCellDelimStr);

                            outputLines = [outputLines[0], headerDelimLine, .. outputLines[1..^0]];
                        }

                        if (opts.SurroundLineWithCellSep)
                        {
                            outputLines = outputLines.Select(
                                line => mdTableCellDelimStr.Arr(
                                    line, mdTableCellDelimStr).JoinStr()).ToArray();
                        }

                        return outputLines;
                    });
            }
            else
            {
                outputText = string.Empty;
            }

            return outputText;
        }

        public bool TryParseAsMdQuotedLine(
            string line,
            out string mdQtStartStr,
            out string restOfLine)
        {
            bool isMdQuotedLine = line.Contains(MD_QUOTED_LINE_START_STR);

            if (isMdQuotedLine)
            {
                Func<char, int, bool> mdQuotedLineStartCharPredicate = (
                    chr, idx) => char.IsWhiteSpace(chr) || line.Matches(
                        idx, out _, MD_QUOTED_LINE_START_STR);

                isMdQuotedLine = line.All(
                    mdQuotedLineStartCharPredicate);

                if (isMdQuotedLine)
                {
                    mdQtStartStr = line;
                    restOfLine = null;
                }
                else
                {
                    (mdQtStartStr, restOfLine) = line.SplitStr(
                        (lineStr, lineLen) => lineStr.FirstKvp(
                            (chr, idx) => !mdQuotedLineStartCharPredicate(chr, idx)).Key);

                    isMdQuotedLine = restOfLine != null && !string.IsNullOrEmpty(mdQtStartStr);

                    if (!isMdQuotedLine)
                    {
                        restOfLine = line;
                        mdQtStartStr = null;
                    }
                }
            }
            else
            {
                mdQtStartStr = null;
                restOfLine = line;
            }

            return isMdQuotedLine;
        }

        public bool TryRemoveMdQuotedLineLevel(
            string line,
            out string outputLine,
            bool insertSpacesBetweenTokens)
        {
            bool isMdQuotedLine = TryParseAsMdQuotedLine(line,
                out var mdQtStartStr,
                out var restOfLine);

            if (isMdQuotedLine)
            {
                int idxOfToken = mdQtStartStr.LastIndexOf(
                    MD_QUOTED_LINE_START_STR);

                mdQtStartStr = mdQtStartStr.Substring(
                    0, idxOfToken);

                if (insertSpacesBetweenTokens)
                {
                    if (idxOfToken >= 0 && mdQtStartStr.FirstOrDefault() == ' ' && !mdQtStartStr.StartsWith(
                        $" {MD_QUOTED_LINE_START_STR}"))
                    {
                        mdQtStartStr = mdQtStartStr.Substring(1);
                    }
                }

                outputLine = mdQtStartStr + restOfLine;
            }
            else
            {
                outputLine = line;
            }

            return isMdQuotedLine;
        }

        public string AddMdQuotedLineLevel(
            string line,
            bool insertSpacesBetweenTokens)
        {
            string toPrependStr = MD_QUOTED_LINE_START_STR;
            string toAppendStr = null;

            if (insertSpacesBetweenTokens)
            {
                toPrependStr = ' ' + toPrependStr;

                if (line.FirstOrDefault() != ' ')
                {
                    toPrependStr += ' ';
                }

                if (!line.EndsWith("  "))
                {
                    if (line.LastOrDefault() != ' ')
                    {
                        toAppendStr = "  ";
                    }
                    else
                    {
                        toAppendStr = " ";
                    }
                }
            }

            line = toPrependStr + line + toAppendStr;
            return line;
        }

        public string ResultTextRmMdQtLvl(
            string inputText,
            bool insertSpacesBetweenTokens) => ConvertText(
                inputText, (line, idx) =>
                {
                    TryRemoveMdQuotedLineLevel(
                        line, out string outputLine,
                        insertSpacesBetweenTokens);

                    return outputLine;
                });

        public string ResultTextDecodeHtml(
            string inputText) => ConvertText(
                inputText, (line, idx) => HttpUtility.HtmlDecode(line));

        public string SrcTextAddMdQtLvl(
            string inputText,
            bool insertSpacesBetweenTokens) => ConvertText(
                inputText, (line, idx) => AddMdQuotedLineLevel(
                    line, insertSpacesBetweenTokens));

        public string SrcTextEncodeHtml(
            string inputText) => ConvertText(
                inputText, (line, idx) =>
                {
                    TryParseAsMdQuotedLine(line,
                        out var mdQtStartStr,
                        out var restOfLine);

                    restOfLine = HttpUtility.HtmlEncode(
                        restOfLine);

                    line = mdQtStartStr + restOfLine;
                    return line;
                });

        private string ConvertText(
            string inputText,
            Func<string, int, string> lineConvertor,
            Func<string[], string[]>? inputLinesTransformer = null,
            Func<string[], string[]>? outputLinesTransformer = null)
        {
            string[] linesArr = inputText.Split('\n').With(
                inputLinesTransformer.FirstNotNull(arr => arr));

            linesArr = linesArr.Select(
                lineConvertor).ToArray().With(
                outputLinesTransformer.FirstNotNull(arr => arr));

            string outputText = string.Join("\n", linesArr);
            return outputText;
        }

        private string SrcTextLineToMdTableLine(
            string inputLine,
            string separator,
            out int cellsCount,
            bool insertSpacesBetweenSymbols)
        {
            var cellsArr = inputLine.Split(separator);
            cellsCount = cellsArr.Length;

            string mdTableCellDelimStr = GetMdTableCellDelimStr(
                insertSpacesBetweenSymbols);

            string outputLine = string.Join(
                mdTableCellDelimStr,
                cellsArr);

            return outputLine;
        }

        private string SrcTextLineToMdTableLine(
            string inputLine,
            string separator,
            bool insertSpacesBetweenSymbols) => SrcTextLineToMdTableLine(
                inputLine, separator, out _, insertSpacesBetweenSymbols);

        private string GetMdTableCellDelimStr(
            bool insertSpacesBetweenSymbols) => GetDelimStrCore(
                MD_TABLE_CELL_DELIM_STR,
                insertSpacesBetweenSymbols);

        private string GetDelimStrCore(
            string delimStr,
            bool insertSpacesBetweenSymbols) => insertSpacesBetweenSymbols switch
            {
                true => $" {delimStr} ",
                false => delimStr
            };
    }
}
