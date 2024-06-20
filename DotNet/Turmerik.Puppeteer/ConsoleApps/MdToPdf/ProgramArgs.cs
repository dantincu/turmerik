using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.Puppeteer.ConsoleApps.MdToPdf
{
    public class ProgramArgs
    {
        public ProgramArgs()
        {
        }

        public ProgramArgs(ProgramArgs src)
        {
            LocalDevicePathsMap = src.LocalDevicePathsMap;
            PrintHelpMessage = src.PrintHelpMessage;
            WorkDir = src.WorkDir;
            Recursive = src.Recursive;
            RemoveExisting = src.RemoveExisting;
        }

        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public bool PrintHelpMessage { get; set; }
        public string WorkDir { get; set; }
        public bool Recursive { get; set; }
        public bool RemoveExisting { get; set; }
    }
}
