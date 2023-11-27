using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextParsing;

namespace Turmerik.Core.TextParsing
{
    public static class TextParserH
    {
        public static StepData ToData(
            this Step step,
            bool matches = false) => new StepData(
                matches, step);

        public static TextParserTemplateOpts<TNode, TArgs> WithChildrenFactory<TNode, TArgs>(
            this TextParserTemplateOpts<TNode, TArgs> opts,
            Func<TNode, IEnumerable<TNode>> childrenFactory,
            Func<TextParserTemplateOpts<TNode, TArgs>, IEnumerable<TNode>> rootNodesFactory)
            where TArgs : TextParserTemplateArgs<TNode, TArgs> => opts.WithChildrenFactory<TNode, TArgs, TextParserTemplateOpts<TNode, TArgs>>(
                childrenFactory, rootNodesFactory);

        public static TOpts WithChildrenFactory<TNode, TArgs, TOpts>(
            this TOpts opts,
            Func<TNode, IEnumerable<TNode>> childrenFactory,
            Func<TOpts, IEnumerable<TNode>> rootNodesFactory)
            where TArgs : TextParserTemplateArgs<TNode, TArgs>
            where TOpts : TextParserTemplateOpts<TNode, TArgs> => opts.ActWith(
                o => o.ChildrenFactory = args =>
                {
                    IEnumerable<TNode> childNodes;

                    if (args.Parent != null)
                    {
                        childNodes = childrenFactory(args.Parent.Data);
                    }
                    else
                    {
                        childNodes = rootNodesFactory(o);
                    }

                    return childNodes;
                });
    }
}
