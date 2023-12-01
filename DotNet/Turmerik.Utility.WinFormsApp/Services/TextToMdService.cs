using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

namespace Turmerik.Utility.WinFormsApp.Services
{
    public class TextToMdService
    {
        public const string MD_TABLE_CELL_DELIM_STR = "|";
        public const string MD_TABLE_HEADER_ROW_DELIM_CELL_STR = "--";

        public string SrcTextToMdTable(
            SrcTextToMdTableOpts opts)
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

                            outputLines = [outputLines[0], headerDelimLine, ..outputLines[1..^0]];
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

        public string ResultTextRmMdQtLvl(
            string inputText,
            bool insertSpacesBetweenTokens) => ConvertText(
                inputText, (line, idx) => throw new NotImplementedException());

        public string ResultTextDecodeHtml(
            string inputText) => ConvertText(
                inputText, (line, idx) => throw new NotImplementedException());

        public string SrcTextAddMdQtLvl(
            string inputText,
            bool insertSpacesBetweenTokens) => ConvertText(
                inputText, (line, idx) => throw new NotImplementedException());

        public string SrcTextEncodeHtml(
            string inputText) => ConvertText(
                inputText, (line, idx) => throw new NotImplementedException());

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
