using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.Notes.Core;

namespace Turmerik.Notes
{
    public class NoteItemsTuple : NoteItemsTupleCore
    {
        public NoteItemsTuple()
        {
        }

        public NoteItemsTuple(NoteItemsTupleCore src)
        {
            ParentFolder = src.ParentFolder;
            ExistingNoteDirIdxes = src.ExistingNoteDirIdxes;
            ExistingInternalDirIdxes = src.ExistingInternalDirIdxes;
        }

        public NoteItem ParentNote { get; set; }
        public NoteBook ParentNoteBook { get; set; }
        public HashSet<int> AllExistingNoteDirIdxes { get; set; }
        public HashSet<int> AllExistingInternalDirIdxes { get; set; }
    }
}
