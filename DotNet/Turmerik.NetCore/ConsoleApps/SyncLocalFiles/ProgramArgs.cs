using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.SyncLocalFiles
{
    public class ProgramArgs
    {
        public string WorkDir { get; set; }
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public ProgramConfig Config { get; set; }
        public string ProfileName { get; set; }
        
        public Dictionary<string, string[]> SrcFolderNamesMap { get; set; }

        public ProgramConfig.Profile Profile { get; set; }
        public ProgramConfig.SrcFolder[] SrcFolders { get; set; }

        public FileSyncType FileSyncType { get; set; }
        public bool? PropagatePush { get; set; }
        public bool? Interactive { get; set; }
        public bool? SkipDiff { get; set; }
        public int? RowsToPrint { get; set; }
    }
}
