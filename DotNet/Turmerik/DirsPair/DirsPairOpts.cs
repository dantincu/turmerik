using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DirsPair
{
    public class DirsPairOpts
    {
        public string PrIdnf { get; set; }
        public string Title { get; set; }
        public bool OpenMdFile { get; set; }
        public int MaxFsEntryNameLength { get; set; }
        public string ShortDirName { get; set; }
        public string FullDirNamePart { get; set; }
        public string JoinStr { get; set; }
        public string MdFileName { get; set; }
        public string MdFileContentsTemplate { get; set; }
        public string MdFileFirstContent { get; set; }
        public string KeepFileName { get; set; }
        public string KeepFileContents { get; set; }
        public string TrmrkGuidInputName { get; set; }
        public bool ThrowIfAnyItemAlreadyExists { get; set; }
        public bool CreateNote { get; set; }
        public bool CreateNoteBook { get; set; }
        public bool CreateNoteInternalsDir { get; set; }
        public bool CreateNoteFilesDir { get; set; }
    }
}
