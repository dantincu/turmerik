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
    public interface INoteTitleRetriever
    {
        string? GetNoteTitle(
            MarkdownDocument mdDoc,
            out string? trmrkUuid,
            string trmrkUuidInputName = null);

        string? GetNoteTitle(
            string noteMdContent,
            out string? trmrkUuid,
            string trmrkUuidInputName = null);
    }

    public class NoteTitleRetriever : INoteTitleRetriever
    {
        public const string TRMRK_GUID_INPUT_NAME = "trmrk_guid";

        private readonly IMdObjectsRetriever mdObjectsRetriever;

        public NoteTitleRetriever(
            IMdObjectsRetriever mdObjectsRetriever)
        {
            this.mdObjectsRetriever = mdObjectsRetriever ?? throw new ArgumentNullException(
                nameof(mdObjectsRetriever));
        }

        public string? GetNoteTitle(
            MarkdownDocument mdDoc,
            out string? trmrkUuid,
            string trmrkUuidInputName = null)
        {
            trmrkUuidInputName ??= TRMRK_GUID_INPUT_NAME;

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

        public string? GetNoteTitle(
            string noteMdContent,
            out string? trmrkUuid,
            string trmrkUuidInputName = null) => GetNoteTitle(
                MarkdownParser.Parse(
                    noteMdContent),
                out trmrkUuid,
                trmrkUuidInputName);
    }
}
