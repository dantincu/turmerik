using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Text;

namespace Turmerik.TextParsing.Md
{
    public static class MdH
    {
        public const string MD_TITLE_PREFIX = "# ";

        public static bool UpdateMdTitleFromFile(
            string filePath,
            Func<string, string, int, string[], string> newTitleFactory,
            string mdTitleLinePfx = null,
            bool trimStart = true)
        {
            string[] linesArr = File.ReadAllLines(filePath);
            bool updated = false;

            for (int i = 0; i < linesArr.Length; i++)
            {
                var line = linesArr[i];
                var title = TryGetMdTitleFromLine(
                    line, mdTitleLinePfx, trimStart);

                if (title != null)
                {
                    var newTitle = newTitleFactory(
                        title, line, i, linesArr);

                    var newLine = string.Concat(
                        MD_TITLE_PREFIX,
                        EncodeForMd(newTitle));

                    linesArr[i] = newLine;
                    updated = true;

                    break;
                }
            }

            File.WriteAllLines(filePath, linesArr);
            return updated;
        }

        public static string TryGetMdTitleFromFile(
            string filePath,
            string mdTitleLinePfx = null,
            bool trimStart = true)
        {
            string mdTitle;

            using (var streamReader = File.OpenText(filePath))
            {
                mdTitle = TryGetMdTitleFromStream(
                    streamReader,
                    mdTitleLinePfx,
                    trimStart);
            }

            return mdTitle;
        }

        public static string TryGetMdTitleFromStream(
            StreamReader streamReader,
            string mdTitleLinePfx = null,
            bool trimStart = true)
        {
            var mdLine = streamReader.ReadLine();
            string? title = null;

            while (mdLine != null)
            {
                title ??= TryGetMdTitleFromLine(
                    mdLine, mdTitleLinePfx,
                    trimStart)?.Nullify(true);

                if (title != null)
                {
                    break;
                }

                mdLine = streamReader.ReadLine();
            }

            return title;
        }

        public static string TryGetMdTitleFromLine(
            string mdLine,
            string mdTitleLinePfx = null,
            bool trimStart = true)
        {
            string title = null;
            mdTitleLinePfx ??= MD_TITLE_PREFIX;

            if (trimStart)
            {
                mdLine = mdLine.TrimStart();
            }

            if (mdLine.StartsWith(mdTitleLinePfx))
            {
                title = mdLine.Substring(
                    mdTitleLinePfx.Length).Trim();

                title = DecodeForMd(title);
            }

            return title;
        }

        public static string EncodeForMd(string str)
        {
            str = HttpUtility.HtmlEncode(str);

            /* str = str.Replace("\\", "\\\\");
            str = str.Replace("_", "\\_"); */

            return str;
        }

        public static string DecodeForMd(string str)
        {
            str = HttpUtility.HtmlDecode(str);

            str = str.Split("\\\\").Select(
                part => new string(part.Where(
                    c => c != '\\').ToArray(
                        ))).ToArray().JoinStr("\\");

            return str;
        }
    }
}
