using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes
{
    public class DirsPairOpts
    {
        public string PrIdnf { get; set; }
        public string Title { get; set; }
        public int MaxFsEntryNameLength { get; set; }
        public string ShortDirName { get; set; }
        public string FullDirNamePart { get; set; }
        public string JoinStr { get; set; }
        public string MdFileNameTemplate { get; set; }
        public string MdFileContentsTemplate { get; set; }
        public string KeepFileName { get; set; }
        public string KeepFileNameContents { get; set; }
        public bool ThrowIfAnyItemAlreadyExists { get; set; }
    }
}
