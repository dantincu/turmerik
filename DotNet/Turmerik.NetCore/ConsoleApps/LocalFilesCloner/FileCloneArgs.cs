using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
{
    public class FileCloneArgs
    {
        public string InputText { get; set; }
        public ProgramConfig.File File { get; set; }
        public bool CloneInputFile { get; set; }
    }
}
