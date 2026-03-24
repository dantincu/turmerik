using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.NetCore.ConsoleApps.UpdateNoteChildren
{
    public class ProgramArgs
    {
        public ProgramArgs()
        {
        }

        public ProgramArgs(ProgramArgs src)
        {
            this.LocalDevicePathsMap = src.LocalDevicePathsMap;
            this.WorkDir = src.WorkDir;
            this.InfiniteDepthRecursive = src.InfiniteDepthRecursive;
            this.OnlyRunIfValidJsonAlreadyExists = src.OnlyRunIfValidJsonAlreadyExists;
        }

        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public string WorkDir { get; set; }
        public bool InfiniteDepthRecursive { get; set; }
        public bool? OnlyRunIfValidJsonAlreadyExists { get; set; }
    }
}
