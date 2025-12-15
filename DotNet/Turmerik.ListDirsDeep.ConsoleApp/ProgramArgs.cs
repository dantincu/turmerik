using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.ListDirsDeep.ConsoleApp
{
    public class ProgramArgs
    {
        public string WorkDir { get; set; }
        public bool IsInteractive { get; set; }
        public string DirNameMatchPatternStr { get; set; }
        public Regex DirNameMatchPattern { get; set; }
        public string ChildDirNameMatchPatternStr { get; set; }
        public Regex ChildDirNameMatchPattern { get; set; }
    }
}
