using Markdig.Syntax;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes
{
    public class NoteMdTuple : NoteTupleCore<NoteItemCore>
    {
        public MarkdownDocument? MdDoc { get; set; }
    }
}
