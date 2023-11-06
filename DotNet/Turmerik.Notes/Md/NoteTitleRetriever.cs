using Markdig;
using Markdig.Parsers;
using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.Notes.Md
{
    public interface INoteTitleRetriever
    {
        string? GetNoteTitle(string noteMdContent);
    }

    public class NoteTitleRetriever : INoteTitleRetriever
    {
        private readonly IMdObjectsRetriever mdObjectsRetriever;

        public NoteTitleRetriever(
            IMdObjectsRetriever mdObjectsRetriever)
        {
            this.mdObjectsRetriever = mdObjectsRetriever ?? throw new ArgumentNullException(nameof(mdObjectsRetriever));
        }

        public string? GetNoteTitle(string noteMdContent)
        {
            var result = mdObjectsRetriever.GetObjects(new MdObjectsRetrieverOpts
            {
                MdContent = noteMdContent,
                NextStepPredicate = args =>
                {
                    MdObjectsRetrieverStepData nextStep;
                    var current = args.Current;

                    if (current is HeadingBlock block && block.Level == 1)
                    {
                        nextStep = MdObjectsRetrieverStep.Stop.ToData(true);
                    }
                    else if (current is QuoteBlock || current is FencedCodeBlock)
                    {
                        nextStep = MdObjectsRetrieverStep.Next.ToData();
                    }
                    else
                    {
                        nextStep = MdObjectsRetrieverStep.Push.ToData();
                    }

                    return nextStep;
                }
            });

            var titleNode = result.RetMap.SingleOrDefault().Value as HeadingBlock;
            string? title = titleNode?.GetTitleStr();

            return title;
        }
    }
}
