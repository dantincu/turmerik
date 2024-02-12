using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.FilesCloner
{
    public class ProgramArgs
    {
        public Core.Utility.TrmrkUniqueDir TempDir { get; set; }
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public ProgramConfig Config { get; set; }
        public string WorkDir { get; set; }
        public ProgramConfig.Profile Profile { get; set; }
        public FileCloneArgs SingleFileArgs { get; set; }
    }
}
