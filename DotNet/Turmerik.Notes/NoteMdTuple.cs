using Markdig.Syntax;
using Turmerik.Notes.Core;

namespace Turmerik.Notes
{
    public class NoteMdTuple : NoteTupleCore<NoteItemCore>
    {
        public MarkdownDocument? MdDoc { get; set; }
    }
}
