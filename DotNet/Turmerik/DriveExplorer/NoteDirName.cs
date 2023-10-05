using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteDirName
    {
        public string ShortDirName { get; set; }
        public string FullDirName { get; set; }
        public string JoinStr { get; set; }
        public string FullDirNamePart { get; set; }
        public string Prefix { get; set; }
        public int Idx { get; set; }
        public DirCategory? NoteDirCategory { get; set; }
        public InternalDir? NoteInternalDir { get; set; }
    }
}
