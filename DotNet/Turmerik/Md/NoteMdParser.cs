﻿using HtmlAgilityPack;
using Markdig;
using Markdig.Parsers;
using Markdig.Renderers.Html;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.TextParsing;
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
        private readonly IMdObjectsRetriever mdObjectsRetriever;
        private readonly IHtmlNodesRetriever htmlNodesRetriever;

        public NoteMdParser(
            IMdObjectsRetriever mdObjectsRetriever,
            IHtmlNodesRetriever htmlNodesRetriever)
        {
            this.mdObjectsRetriever = mdObjectsRetriever ?? throw new ArgumentNullException(
                nameof(mdObjectsRetriever));

            this.htmlNodesRetriever = htmlNodesRetriever ?? throw new ArgumentNullException(
                nameof(htmlNodesRetriever));
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
                        var nextStep = Step.Push.ToData();
                        var current = args.Current.Data;

                        if (current is HeadingBlock block && block.Level == 1)
                        {
                            title = block.GetTitleStr();

                            if (!seekTrmrkUuid || trmrkUuidStr != null)
                            {
                                args.Stop = true;
                            }
                            else
                            {
                                nextStep = Step.Next.ToData();
                            }
                        }
                        else if (current is QuoteBlock || current is FencedCodeBlock)
                        {
                            nextStep = Step.Next.ToData();
                        }
                        else if (seekTrmrkUuid && trmrkUuidStr == null)
                        {
                            string html = null;

                            if (current is HtmlInline htmlInline)
                            {
                                html = htmlInline.Tag;
                            }
                            else if (current is HtmlBlock htmlBlock)
                            {
                                html = htmlBlock.Lines.GetHtml();
                            }

                            if (html != null)
                            {
                                htmlNodesRetriever.GetNodes(new HtmlNodesRetrieverOpts
                                {
                                    Text = html,
                                    NextStepPredicate = hAgs =>
                                    {
                                        var crntNode = hAgs.Current.Data;
                                        bool isTextNode = crntNode is HtmlTextNode;
                                        var nextStep = (isTextNode ? Step.Next : Step.Push).ToData();

                                        if (!isTextNode && crntNode.Name == "input" && crntNode.Attributes.SingleOrDefault(
                                                a => a.Name == "type")?.Value == "hidden" && crntNode.Attributes.SingleOrDefault(
                                                a => a.Name == "name")?.Value == trmrkUuidInputName)
                                        {
                                            trmrkUuidStr = crntNode.Attributes.SingleOrDefault(
                                                a => a.Name == "value")?.Value;

                                            if (trmrkUuidStr != null)
                                            {
                                                hAgs.Stop = true;
                                            }
                                        }

                                        return nextStep;
                                    },
                                });
                            }
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