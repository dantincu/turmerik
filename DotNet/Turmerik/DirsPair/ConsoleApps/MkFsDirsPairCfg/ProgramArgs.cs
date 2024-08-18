using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.DirsPair.ConsoleApps.MkFsDirsPairCfg
{
    public class ProgramArgs
    {
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public string BasePath { get; set; }
    }
}
