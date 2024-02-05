using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;

namespace Turmerik.FilesCloner.ConsoleApp
{
    public class FileCloneArgs
    {
        public string WorkDir { get; set; }
        public string InputText { get; set; }
        public FileArgs File { get; set; }
        public bool CloneInputFile { get; set; }
    }
}
