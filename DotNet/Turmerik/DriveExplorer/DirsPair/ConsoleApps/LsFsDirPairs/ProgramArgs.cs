using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.DriveExplorer.DirsPair.ConsoleApps.LsFsDirPairs
{
    public class ProgramArgs
    {
        public string WorkDir { get; set; }
        public bool? ShowLastCreatedFirst { get; set; }
        public bool? ShowOtherDirNames { get; set; }
        public NoteItemsTupleCore NoteItemsTuple { get; set; }
    }
}
