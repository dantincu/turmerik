using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Notes.Core
{
    public class NoteItemSummary : TrmrkObj
    {
        public string Title { get; set; }
        public int? ItemIdx { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public abstract class NoteItemCoreBase : NoteItemSummary
    {
        public Dictionary<NoteInternalDir, int> InternalDirs { get; set; }
    }

    public class NoteItemCore : NoteItemCoreBase
    {
        public string MdFileName { get; set; }
    }

    public class NoteItem : NoteItemCore
    {
        public Dictionary<int, NoteItemSummary> ChildNotes { get; set; }
    }
}
