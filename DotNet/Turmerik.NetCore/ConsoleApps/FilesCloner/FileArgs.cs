using Turmerik.Core.FileSystem;

namespace Turmerik.NetCore.ConsoleApps.FilesCloner
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
