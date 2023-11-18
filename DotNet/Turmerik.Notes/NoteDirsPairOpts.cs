using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Notes.ConsoleApps;

namespace Turmerik.Notes
{
    public class NoteDirsPairOpts
    {
        public string PrIdnf { get; set; }
        public string Title { get; set; }
        public int? SortIdx { get; set; }
        public bool IsPinned { get; set; }
        public bool OpenMdFile { get; set; }
        public bool CreateNoteFilesDirsPair { get; set; }
        public bool CreateNoteInternalDirsPair { get; set; }
        public CmdCommand Command { get; set; }
        public string[]? SrcNote { get; set; }
        public string[]? SrcNoteIdx { get; set; }
        public string[]? DestnNote { get; set; }
        public string[]? DestnNoteIdx { get; set; }
    }
}
