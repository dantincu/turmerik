using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteDirsPairOpts : NoteDirsPairIdxOpts
    {
        public string Title { get; set; }
        public InternalDir[] NoteInternalDirs { get; set; }
        public bool CreateNoteBook { get; set; }
        public char AltSpaceChar { get; set; }
        public int? SortIdx { get; set; }
    }
}
