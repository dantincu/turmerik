using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;

namespace Turmerik.PrintDupplicateTextLines.ConsoleApp
{
    public class ProgramArgs
    {
        public string WorkDir { get; set; }
        public string TextFileNamePattern { get; set; }
        public string? SkipUntilPath { get; set; }
        public string? FilterLines { get; set; }
        public Regex? FilterLinesRegex { get; set; }
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public string[]? RecursiveMatchingDirNamesArr { get; set; }
        public Regex[]? RecursiveMatchingDirNameRegexsArr { get; set; }
    }
}
