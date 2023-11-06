using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Notes.Md
{
    public static class MdObjectsH
    {
        public static MdObjectsRetrieverStepData ToData(
            this MdObjectsRetrieverStep step,
            bool matches = false) => new MdObjectsRetrieverStepData(
                matches, step);

        public static string GetTitleStr(
            this HeadingBlock headingBlock)
        {
            var titleLine = headingBlock.Lines.Lines.First();
            string titleLineStr = titleLine.ToString();

            var title = titleLineStr.TrimStart('#').TrimStart();
            return title;
        }
    }
}
