using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;

namespace Turmerik.ConvertFsDirPairsToNotes.ConsoleApp
{
    public class AppSettings
    {
        public NoteDirsPairSettings TrmrkDirPairs { get; set; }
    }

    public class ProgramSettings
    {
        public string RefDirPath { get; set; }
        public string SrcDirPath { get; set; }
        public string DestnDirPath { get; set; }
        public string NotesDirPath { get; set; }
    }
}
