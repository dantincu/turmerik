using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class MkNoteDirsPairWorkArgs
    {
        public MkNoteDirsPairArgs ProgArgs { get; set; }
        public string WorkDir { get; set; }
        public string[] ExistingEntriesArr { get; set; }
        public DirCategory DirCat { get; set; }
        public string NoteItemJson { get; set; }
        public string NoteBookJson { get; set; }
    }
}
