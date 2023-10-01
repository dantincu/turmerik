using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteDirsPairOpts : NoteDirsPairIdxOpts
    {
        public string Title { get; set; }
        public NoteInternalDir[] NoteInternalDirs { get; set; }
        public bool CreateNoteBook { get; set; }
        public char AltSpaceChar { get; set; }
    }
}
