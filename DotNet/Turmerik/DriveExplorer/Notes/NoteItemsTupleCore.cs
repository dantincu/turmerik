using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer.DirsPair;

namespace Turmerik.DriveExplorer.Notes
{
    public class NoteItemsTupleCore
    {
        public DriveItemX ParentFolder { get; set; }
        public List<DirsPairTuple> DirsPairTuples { get; set; }
        public List<string> OtherDirNames { get; set; }
        public HashSet<int> AllExistingNoteDirIdxes { get; set; }
        public HashSet<int> AllExistingInternalDirIdxes { get; set; }
        public HashSet<int> ExistingNoteDirIdxes { get; set; }
        public HashSet<int> ExistingInternalDirIdxes { get; set; }

        public static NoteItemsTupleCore Create(
            DriveItem parentFolder) => new NoteItemsTupleCore
            {
                ParentFolder = parentFolder.ToItemX(-1),
                DirsPairTuples = new List<DirsPairTuple>(),
                OtherDirNames = new List<string>(),
                AllExistingInternalDirIdxes = new HashSet<int>(),
                AllExistingNoteDirIdxes = new HashSet<int>(),
                ExistingInternalDirIdxes= new HashSet<int>(),
                ExistingNoteDirIdxes = new HashSet<int>()
            };
    }
}
