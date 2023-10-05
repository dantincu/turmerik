using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkNoteDirsPair.ConsoleApp
{
    public class ProgramArgs
    {
        public string WorkDir { get; set; }
        public string NoteName { get; set; }
        public bool CreateNote { get; set; }
        public bool CreateNoteBook { get; set; }
        public bool CreateNoteFiles { get; set; }
        public bool CreateNoteInternals { get; set; }
        public bool DoNotOpenCreatedDocFile { get; set; }
    }
}
