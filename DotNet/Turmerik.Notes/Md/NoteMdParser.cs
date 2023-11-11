using Markdig;
using Markdig.Parsers;
using Markdig.Renderers.Html;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.Notes.Md
{
    public interface INoteMdParser
    {
        string? GetNoteTitle(
            MarkdownDocument mdDoc,
            out string? trmrkUuid,
            string? trmrkUuidInputName = null);

        MarkdownDocument? TryParse(
            string mdContent,
            out NoteItemCore? item,
            string? trmrkUuidInputName = null);

        MarkdownDocument Parse(
            string mdContent,
            out NoteItemCore item,
            string? trmrkUuidInputName = null);
    }

    public class NoteMdParser : INoteMdParser
    {
        private readonly IMdObjectsRetriever mdObjectsRetriever;

        public NoteMdParser(
            IMdObjectsRetriever mdObjectsRetriever)
        {
            this.mdObjectsRetriever = mdObjectsRetriever ?? throw new ArgumentNullException(
                nameof(mdObjectsRetriever));
        }

        public string? GetNoteTitle(
            MarkdownDocument mdDoc,
            out string? trmrkUuid,
            string? trmrkUuidInputName = null)
        {
            trmrkUuidInputName ??= TrmrkNotesH.TRMRK_GUID_INPUT_NAME;

            bool seekTrmrkUuid = !string.IsNullOrWhiteSpace(
                trmrkUuidInputName);

            string? trmrkUuidStr = null;
            string? title = null;

            mdObjectsRetriever.GetObjects(
                new MdObjectsRetrieverOpts
                {
                    MdDoc = mdDoc,
                    NextStepPredicate = args =>
                    {
                        var nextStep = MdObjectsRetrieverStep.Push.ToData();
                        var current = args.Current;

                        if (current is HeadingBlock block && block.Level == 1)
                        {
                            title = block.GetTitleStr();

                            if ((!seekTrmrkUuid || trmrkUuidStr != null))
                            {
                                nextStep = MdObjectsRetrieverStep.Stop.ToData();
                            }
                        }
                        else if (seekTrmrkUuid && trmrkUuidStr == null && current is HtmlInline htmlInline && htmlInline.Tag == "input")
                        {
                            htmlInline.GetAttributes().Properties?.ActWith(attrsObj =>
                            {
                                if (attrsObj.Any(kvp => kvp.Key == "type" && kvp.Value == "hidden"))
                                {
                                    if (attrsObj.FirstOrDefault(
                                        kvp => kvp.Key == "name").Value == trmrkUuidInputName)
                                    {
                                        trmrkUuidStr = attrsObj.FirstOrDefault(
                                            kvp => kvp.Key == "value").Value;
                                    }

                                    if (trmrkUuidStr != null && title != null)
                                    {
                                        nextStep = MdObjectsRetrieverStep.Stop.ToData();
                                    }
                                }
                            });
                        }
                        else if (current is QuoteBlock || current is FencedCodeBlock)
                        {
                            nextStep = MdObjectsRetrieverStep.Next.ToData();
                        }

                        return nextStep;
                    }
                });

            trmrkUuid = trmrkUuidStr;
            return title;
        }

        public MarkdownDocument? TryParse(
            string mdContent,
            out NoteItemCore? item,
            string? trmrkUuidInputName = null)
        {
            MarkdownDocument? mdDoc = null;
            item = null;

            try
            {
                mdDoc = Parse(
                    mdContent,
                    out item,
                    trmrkUuidInputName);
            }
            catch
            {
            }

            return mdDoc;
        }

        public MarkdownDocument Parse(
            string mdContent,
            out NoteItemCore item,
            string? trmrkUuidInputName = null)
        {
            var mdDoc = Markdown.Parse(mdContent);

            string? title = GetNoteTitle(
                mdDoc, out string? trmrkUuid,
                trmrkUuidInputName);

            item = new NoteItemCore
            {
                Title = title!,
            };

            if (Guid.TryParse(trmrkUuid, out var guid))
            {
                item.TrmrkGuid = guid;
            }

            return mdDoc;
        }
    }
}
