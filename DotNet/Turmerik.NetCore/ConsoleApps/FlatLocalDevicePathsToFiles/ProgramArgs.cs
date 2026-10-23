using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.FlatLocalDevicePathsToFiles
{
    public class ProgramArgs
    {
        public string DestnDirPath { get; set; }
        public LocalDevicePathMacrosMapMtbl LocalDevicePathMacrosMap { get; set; }
    }
}
