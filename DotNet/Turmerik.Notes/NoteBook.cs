using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Utility;

namespace Turmerik.Notes
{
    public class NoteBookCore : NoteItemCoreBase
    {
    }

    public class NoteBook : NoteBookCore
    {
        public Dictionary<int, NoteItem> ChildNotes { get; set; }
    }
}
