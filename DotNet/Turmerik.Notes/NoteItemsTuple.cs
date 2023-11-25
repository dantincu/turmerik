using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.Notes;

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
            AllExistingNoteDirIdxes = src.AllExistingNoteDirIdxes;
            AllExistingInternalDirIdxes = src.AllExistingInternalDirIdxes;
            ExistingNoteDirIdxes = src.ExistingNoteDirIdxes;
            ExistingInternalDirIdxes = src.ExistingInternalDirIdxes;
        }

        public NoteItem ParentNote { get; set; }
        public NoteBook ParentNoteBook { get; set; }
    }
}
