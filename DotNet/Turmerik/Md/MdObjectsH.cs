using Markdig.Helpers;
using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Md
{
    public static class MdObjectsH
    {
        public static string GetTitleStr(
            this HeadingBlock headingBlock)
        {
            var title = headingBlock.Inline.FirstChild.ToString().Trim();
            return title;
        }

        public static string GetHtml(
            this StringLineGroup group,
            string nwLn = null)
        {
            string[] lines = group.Lines.Select(
                line => line.ToString()).ToArray();

            nwLn ??= Environment.NewLine;
            string html = null;

            if (lines.Any())
            {
                html = string.Join(nwLn, lines);
            }

            return html;
        }
    }
}
