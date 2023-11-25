using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer.Notes
{
    public class NoteItemsTupleCore
    {
        public DriveItemX ParentFolder { get; set; }
        public HashSet<int> AllExistingNoteDirIdxes { get; set; }
        public HashSet<int> AllExistingInternalDirIdxes { get; set; }
        public HashSet<int> ExistingNoteDirIdxes { get; set; }
        public HashSet<int> ExistingInternalDirIdxes { get; set; }
    }
}
