using HtmlAgilityPack;
using Markdig;
using Markdig.Parsers;
using Markdig.Renderers.Html;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Utility;
using Turmerik.Core.Helpers;
using Turmerik.Html;
using Turmerik.Notes.Core;

namespace Turmerik.Md
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
            bool stop = false;

            GetNoteTilteCore(
                mdDoc.Descendants(),
                seekTrmrkUuid,
                trmrkUuidInputName,
                ref trmrkUuidStr,
                ref title,
                ref stop);

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

        private void GetNoteTilteCore(
            IEnumerable<MarkdownObject> descendantsNmrbl,
            bool seekTrmrkUuid,
            string trmrkUuidInputName,
            ref string? trmrkUuidStr,
            ref string? title,
            ref bool stop)
        {
            foreach (var node in descendantsNmrbl)
            {
                if (node is HeadingBlock block && block.Level == 1)
                {
                    if (title == null)
                    {
                        title = block.GetTitleStr();

                        if (!seekTrmrkUuid || trmrkUuidStr != null)
                        {
                            stop = true;
                            break;
                        }
                    }
                }
                else if (node is QuoteBlock || node is FencedCodeBlock)
                {
                }
                else if (seekTrmrkUuid && trmrkUuidStr == null)
                {
                    string html = null;

                    if (node is HtmlInline htmlInline)
                    {
                        html = htmlInline.Tag;
                    }
                    else if (node is HtmlBlock htmlBlock)
                    {
                        html = htmlBlock.Lines.GetHtml();
                    }

                    if (html != null)
                    {
                        var doc = new HtmlDocument();
                        doc.LoadHtml(html);

                        trmrkUuidStr = TrGetTrmrkUuid(
                            doc.DocumentNode,
                            trmrkUuidInputName);

                        if (trmrkUuidStr != null)
                        {
                            if (title != null)
                            {
                                stop = true;
                                break;
                            }
                        }
                    }
                    else
                    {
                        GetNoteTilteCore(
                            node.Descendants(),
                            seekTrmrkUuid,
                            trmrkUuidInputName,
                            ref trmrkUuidStr,
                            ref title,
                            ref stop);

                        if (title != null && (!seekTrmrkUuid || trmrkUuidStr != null))
                        {
                            stop = true;
                            break;
                        }
                    }
                }
            }
        }

        private string? TrGetTrmrkUuid(
            HtmlNode parentNode,
            string trmrkUuidInputName)
        {
            string? trmrkUuidStr = null;

            if (parentNode is HtmlTextNode)
            {
            }
            else
            {
                if (parentNode.Name == "input")
                {
                    if (parentNode.Attributes.SingleOrDefault(
                        a => a.Name == "type")?.Value == "hidden" && parentNode.Attributes.SingleOrDefault(
                        a => a.Name == "name")?.Value == trmrkUuidInputName)
                        {
                            trmrkUuidStr = parentNode.Attributes.SingleOrDefault(
                                a => a.Name == "value")?.Value;
                        }
                }
                else
                {
                    foreach (var htmlNode in parentNode.Descendants())
                    {
                        trmrkUuidStr = TrGetTrmrkUuid(
                            htmlNode,
                            trmrkUuidInputName);

                        if (trmrkUuidStr != null)
                        {
                            break;
                        }
                    }
                }
            }

            return trmrkUuidStr;
        }
    }
}
