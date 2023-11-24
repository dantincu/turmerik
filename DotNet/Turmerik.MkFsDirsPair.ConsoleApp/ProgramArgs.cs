using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer.DirsPair;

namespace Turmerik.MkFsDirsPair.ConsoleApp
{
    public class ProgramArgs
    {
        public string WorkDir { get; set; }
        public bool OpenMdFile { get; set; }
        public bool SkipMdFileCreation { get; set; }
        public string Title { get; set; }
        public string ShortDirName { get; set; }
        public string FullDirNamePart { get; set; }
        public string FullDirNameJoinStr { get; set; }
        public DirsPairConfig.DirNameTplT DirNameTpl { get; set; }
    }
}
