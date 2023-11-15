using HtmlAgilityPack;
using Markdig.Parsers;
using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Helpers;
using Turmerik.TextParsing;

namespace Turmerik.Notes.Md
{
    public interface IMdObjectsRetriever
    {
        MdObjectsRetrieverArgs GetObjects(
            MdObjectsRetrieverOpts opts);
    }

    public class MdObjectsRetrieverArgs : TextParserTemplateArgs<MarkdownObject, MdObjectsRetrieverArgs>
    {
        public MdObjectsRetrieverArgs(TextParserTemplateOpts<MarkdownObject, MdObjectsRetrieverArgs> opts) : base(opts)
        {
        }
    }

    public class MdObjectsRetrieverOpts : TextParserTemplateOpts<MarkdownObject, MdObjectsRetrieverArgs>
    {
        public MarkdownDocument MdDoc { get; set; }
    }

    public class MdObjectsRetriever : IMdObjectsRetriever
    {
        private readonly ITextParserTemplate textParserTemplate;

        public MdObjectsRetriever(
            ITextParserTemplate textParserTemplate)
        {
            this.textParserTemplate = textParserTemplate ?? throw new ArgumentNullException(nameof(textParserTemplate));
        }

        public MdObjectsRetrieverArgs GetObjects(
            MdObjectsRetrieverOpts opts)
        {
            opts.MdDoc ??= MarkdownParser.Parse(opts.Text);

            opts.WithChildrenFactory(
                node => node.Descendants(),
                o => opts.MdDoc.Descendants());
            
            var args = textParserTemplate.GetNodes(opts);
            return args;
        }
    }
}
