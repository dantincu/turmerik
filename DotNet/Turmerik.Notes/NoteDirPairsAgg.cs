using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes
{
    public class NoteDirPairsAgg
    {
        public NoteItemCore ParentNote { get; set; }
        public NoteBookCore ParentNoteBook { get; set; }
        public List<NoteItemCore> ChildNotes { get; set; }
        public HashSet<int> AllExistingNoteDirIdxes { get; set; }
        public HashSet<int> AllExistingInternalDirIdxes { get; set; }
        public HashSet<int> ExistingNoteDirIdxes { get; set; }
        public HashSet<int> ExistingInternalDirIdxes { get; set; }
    }
}
