using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
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
            RecursiveMatchingDirNamesArr = src.RecursiveMatchingDirNamesArr;
            RecursiveMatchingDirNameRegexsArr = src.RecursiveMatchingDirNameRegexsArr;
            RemoveExisting = src.RemoveExisting;
        }

        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public bool PrintHelpMessage { get; set; }
        public string WorkDir { get; set; }
        public string[]? RecursiveMatchingDirNamesArr { get; set; }
        public Regex[]? RecursiveMatchingDirNameRegexsArr { get; set; }
        public bool RemoveExisting { get; set; }
    }
}
