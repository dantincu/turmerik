using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes
{
    public class NoteItemsTuple
    {
        public DriveItemX ParentFolder { get; set; }
        public NoteItem ParentNote { get; set; }
        public NoteBook ParentNoteBook { get; set; }
        public HashSet<int> AllExistingNoteDirIdxes { get; set; }
        public HashSet<int> AllExistingInternalDirIdxes { get; set; }
        public HashSet<int> ExistingNoteDirIdxes { get; set; }
        public HashSet<int> ExistingInternalDirIdxes { get; set; }
    }
}
