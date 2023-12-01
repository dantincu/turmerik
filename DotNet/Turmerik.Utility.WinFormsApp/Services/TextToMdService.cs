using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.Utility.WinFormsApp.Services
{
    public class TextToMdService
    {
        public string SrcTextToMdTable(
            SrcTextToMdTableOpts opts) => ConvertText(
                opts.InputText,
                (line, idx) => throw new NotImplementedException());

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
            Func<string[], string[]>? outputLinesTransformer = null,
            Func<string[], string[]>? inputLinesTransformer = null)
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
            string sep,
            out int cellsCount)
        {
            var cellsArr = inputLine.Split(sep);
            cellsCount = cellsArr.Length;

            throw new NotImplementedException();
        }
    }
}
