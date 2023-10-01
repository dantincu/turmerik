using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteDirsPairIdxOpts
    {
        public string[] ExistingEntriesArr { get; set; }
        public bool CreateInternalDirs { get; set; }
        public NoteDirCategory DirCategory { get; set; }
        public string NoteItemJson { get; set; }
        public string NoteBookJson { get; set; }
    }
}
