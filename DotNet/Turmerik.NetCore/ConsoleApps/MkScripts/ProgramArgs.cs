using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.MkScripts
{
    public enum ProgramCommand
    {
        Create = 0,
        Remove
    }

    public class ProgramArgs
    {
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public ProgramConfig Config { get; set; }
        public string ProfileName { get; set; }
        public string SectionName { get; set; }
        public string RelDirPathsFilterName { get; set; }
        public string ContentArgsFilterName { get; set; }
        public ProgramConfig.Profile Profile { get; set; }
        public ProgramConfig.ProfileSection Section { get; set; }

        public ProgramCommand Command { get; set; }
    }
}
