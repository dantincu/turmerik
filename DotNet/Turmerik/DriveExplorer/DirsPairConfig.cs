using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class DirsPairConfig
    {
        public int? FileNameMaxLength { get; set; }
        public string MdFileName { get; set; }
        public string KeepFileName { get; set; }
        public string KeepFileContentsTemplate { get; set; }
        public string MdFileContentsTemplate { get; set; }
    }
}
