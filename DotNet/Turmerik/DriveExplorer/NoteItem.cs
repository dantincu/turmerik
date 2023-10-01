using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteItem
    {
        public string Title { get; set; }
        public int? NoteIdx { get; set; }

        public Dictionary<NoteInternalDir, int> NoteDirs { get; set; }
        public Dictionary<int, NoteItem> ChildNotes { get; set; }
    }
}
