using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Turmerik.Core.Text;

namespace Turmerik.TextParsing.Md
{
    public static class MdH
    {
        public const string MD_TITLE_PREFIX = "# ";

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
            str = str.Replace("\\", "\\\\");

            return str;
        }

        public static string DecodeForMd(string str)
        {
            str = HttpUtility.HtmlDecode(str);
            str = str.Replace("\\\\", "\\");

            return str;
        }
    }
}
