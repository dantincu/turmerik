using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
{
    public class ProgramArgs
    {
        public Core.Utility.TrmrkUniqueDir TempDir { get; set; }
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public ProgramConfig Config { get; set; }
        public ProgramConfig.Profile Profile { get; set; }
        public FileCloneArgs SingleFileArgs { get; set; }
    }
}
