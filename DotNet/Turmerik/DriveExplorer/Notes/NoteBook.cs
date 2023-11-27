using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.DriveExplorer.Notes
{
    public class NoteBookCore : NoteItemCoreBase
    {
    }

    public class NoteBook : NoteBookCore
    {
        public Dictionary<int, NoteItem> ChildNotes { get; set; }
    }
}
