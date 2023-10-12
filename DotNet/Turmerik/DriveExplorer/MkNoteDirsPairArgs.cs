using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.DriveExplorer
{
    public class MkNoteDirsPairArgs
    {
        public string WorkDir { get; set; }
        public string NoteName { get; set; }
        public bool CreateNote { get; set; }
        public bool CreateNoteBook { get; set; }
        public bool CreateNoteFiles { get; set; }
        public bool CreateNoteInternals { get; set; }
        public bool OpenCreatedDocFile { get; set; }
        public int? SortIdx { get; set; }
    }
}
