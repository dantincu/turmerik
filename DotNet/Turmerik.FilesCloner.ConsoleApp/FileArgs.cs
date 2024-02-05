using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;

namespace Turmerik.FilesCloner.ConsoleApp
{
    public class FileArgs
    {
        public FsEntryLocator InputFileLocator { get; set; }
        public FsEntryLocator CloneDirLocator { get; set; }
        public string CloneFileNameTpl { get; set; }
        public bool? UseChecksum { get; set; }
        public List<string> CloneTplLines { get; set; }
    }
}
