﻿using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Utility;

namespace Turmerik.Notes
{
    public abstract class NoteItemCoreBase : TrmrkObj
    {
        public string Title { get; set; }

        public Dictionary<NoteInternalDir, int> InternalDirs { get; set; }
        public Dictionary<int, string> ChildItems { get; set; }
        public List<int> PinnedChildItemsSortOrder { get; set; }
        public List<int> ChildItemsSortOrder { get; set; }
    }

    public class NoteItemCore : NoteItemCoreBase
    {
        public int? ItemIdx { get; set; }
        public string MdFileName { get; set; }
    }

    public class NoteItem : NoteItemCore
    {
        public Dictionary<int, NoteItem> ChildNotes { get; set; }
    }
}