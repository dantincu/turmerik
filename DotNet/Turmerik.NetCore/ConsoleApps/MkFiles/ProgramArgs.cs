﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.MkFiles
{
    public class ProgramArgs
    {
        public bool? PrintHelpMessage { get; set; }
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public ProgramConfig Config { get; set; }
        public string ProfileName { get; set; }
        public ProgramConfig.Profile Profile { get; set; }
    }
}
