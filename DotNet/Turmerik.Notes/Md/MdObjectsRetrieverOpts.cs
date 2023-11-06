using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes.Md
{
    public class MdObjectsRetrieverOpts
    {
        public string MdContent { get; set; }
        public MarkdownDocument MdDoc { get; set; }
        public Func<MdObjectsRetrieverArgs, MdObjectsRetrieverStepData> NextStepPredicate { get; set; }
    }
}
