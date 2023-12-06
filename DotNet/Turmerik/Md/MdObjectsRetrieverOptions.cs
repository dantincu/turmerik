using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;
using Turmerik.Html;

namespace Turmerik.Md
{
    public class MdObjectsRetrieverOptions
    {
        public MdObjectsRetrieverOptions()
        {
        }

        public MdObjectsRetrieverOptions(
            MdObjectsRetrieverOptions src)
        {
            Text = src.Text;
            MdDoc = src.MdDoc;
            RootNodes = src.RootNodes;
            NextStepPredicate = src.NextStepPredicate;
        }

        public string Text { get; init; }
        public MarkdownDocument MdDoc { get; init; }
        public IEnumerator<MarkdownObject> RootNodes { get; init; }
        public Func<MdObjectsRetrieverArgs, DataTreeGeneratorStepData> NextStepPredicate { get; init; }
    }
}
