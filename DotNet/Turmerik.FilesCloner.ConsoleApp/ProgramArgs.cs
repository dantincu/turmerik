using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;

namespace Turmerik.FilesCloner.ConsoleApp
{
    public class ProgramArgs
    {
        public ProgramConfig Config { get; set; }
        public string WorkDir { get; set; }
        public ProgramConfig.Profile Profile { get; set; }
        public FileCloneArgs SingleFileArgs { get; set; }
    }
}
