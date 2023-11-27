using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DirsPair;
using Turmerik.DriveExplorer;

namespace Turmerik.Notes.Core
{
    public class NoteItemsTupleCore
    {
        public DriveItemX ParentFolder { get; set; }
        public List<DirsPairTuple> DirsPairTuples { get; set; }
        public List<DirsPairTuple> FileDirsPairTuples { get; set; }
        public List<string> OtherDirNames { get; set; }
        public List<string> OtherFileNames { get; set; }
        public HashSet<int> ExistingNoteDirIdxes { get; set; }
        public HashSet<int> ExistingInternalDirIdxes { get; set; }

        public static NoteItemsTupleCore Create(
            DriveItem parentFolder) => new NoteItemsTupleCore
            {
                ParentFolder = parentFolder.ToItemX(-1),
                DirsPairTuples = new List<DirsPairTuple>(),
                FileDirsPairTuples = new List<DirsPairTuple>(),
                OtherDirNames = new List<string>(),
                OtherFileNames = new List<string>(),
                ExistingInternalDirIdxes = new HashSet<int>(),
                ExistingNoteDirIdxes = new HashSet<int>()
            };
    }
}
