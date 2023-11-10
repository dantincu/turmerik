using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkFsNoteDirsPair.ConsoleApp
{
    public class ProgramArgs
    {
        public string WorkDir { get; set; }
        public string NoteTitle { get; set; }
        public int? SortIdx { get; set; }
        public bool IsPinned { get; set; }
        public bool OpenMdFile { get; set; }
        public bool CreateNoteBookDirsPair { get; set; }
        public bool CreateNoteInternalDirsPair { get; set; }
        public bool CreateNoteFilesDirsPair { get; set; }
    }
}
