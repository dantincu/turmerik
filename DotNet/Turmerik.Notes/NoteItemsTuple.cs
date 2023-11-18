using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes
{
    public class NoteItemsTuple
    {
        public DriveItem ParentFolder { get; set; }
        public NoteItemCore ParentNote { get; set; }
        public NoteBookCore ParentNoteBook { get; set; }
        public List<NoteItemCore> ChildNotes { get; set; }
        public HashSet<int> AllExistingNoteDirIdxes { get; set; }
        public HashSet<int> AllExistingInternalDirIdxes { get; set; }
        public HashSet<int> ExistingNoteDirIdxes { get; set; }
        public HashSet<int> ExistingInternalDirIdxes { get; set; }
    }
}
