using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.TextParsing
{
    public class TextParserTemplateOpts<TNode, TArgs>
        where TArgs : TextParserTemplateArgs<TNode, TArgs>
    {
        public string Text { get; set; }
        public Func<TextParserTemplateOpts<TNode, TArgs>, TArgs> ArgsFactory { get; set; }
        public Func<TArgs, IEnumerable<TNode>> ChildrenFactory { get; set; }
        public Func<TArgs, StepData> NextStepPredicate { get; set; }
    }
}
