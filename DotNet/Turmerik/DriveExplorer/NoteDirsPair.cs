using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteDirsPair : NoteDirsPairIdx
    {
        public NoteDirsPair()
        {
        }

        public NoteDirsPair(NoteDirsPairIdx src) : base(src)
        {
        }

        public string ShortDirName { get; set; }
        public string FullDirNamePart { get; set; }
        public string FullDirName { get; set; }
        public string DocTitle { get; set; }
        public string? DocFileName { get; set; }
    }
}
