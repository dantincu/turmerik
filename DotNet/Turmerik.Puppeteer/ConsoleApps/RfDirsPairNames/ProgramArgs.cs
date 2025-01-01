using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.DirsPair;

namespace Turmerik.Puppeteer.ConsoleApps.RfDirsPairNames
{
    public class ProgramArgs
    {
        public bool? PrintHelpMessage { get; set; }
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public string ParentDirPath { get; set; }
        public string ShortNameDirPath { get; set; }
        public string ShortDirName { get; set; }
        public string FullDirName { get; set; }
        public string FullDirNamePart { get; set; }
        public string FullDirPath { get; set; }
        public string MdFilePath { get; set; }
        public string MdFileName { get; set; }
        public string MdTitle { get; set; }
        public bool? InteractiveMode { get; set; }
        public bool? UpdateMdFile { get; set; }
        public bool? SkipPdfFileCreation { get; set; }
        public bool? SkipShortNameDirPath { get; set; }
        public string? SkipUntilPath { get; set; }
        public string[]? RecursiveMatchingDirNamesArr { get; set; }
        public Regex[]? RecursiveMatchingDirNameRegexsArr { get; set; }
        public bool? OpenMdFileAndDeferUpdate { get; set; }
        public bool? OpenMdFileAndAddLinks { get; set; }
        public bool? UpdateTimeStamp { get; set; }

        public MdLink[]? MdLinksToAddArr { get; set; }
    }
}
