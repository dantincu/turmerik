using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteItem : NoteItemCore
    {
        public Dictionary<int, NoteItem> ChildNotes { get; set; }
    }
}
