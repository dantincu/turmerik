using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes
{
    public class NoteItemCore
    {
        public string Title { get; set; }
        public int? ItemIdx { get; set; }

        public Dictionary<NoteInternalDir, int> InternalDirs { get; set; }
        public Dictionary<int, string> ChildItems { get; set; }
        public List<int> PinnedChildItemsSortOrder { get; set; }
        public List<int> ChildItemsSortOrder { get; set; }
    }

    public class NoteItem : NoteItemCore
    {
        public Dictionary<int, NoteItem> ChildNotes { get; set; }
    }
}
