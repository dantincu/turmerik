using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer.DirsPair.ConsoleApps.RfDirsPairNames
{
    public class ProgramArgs
    {
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
    }
}
