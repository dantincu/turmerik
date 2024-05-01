using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Notes.Core;

namespace Turmerik.Notes
{
    public class NoteDirsPairOpts
    {
        public string PrIdnf { get; set; }
        public string Title { get; set; }
        public int? SortIdx { get; set; }
        public int? NoteIdx { get; set; }
        public bool? IsSection { get; set; }
        public bool OpenMdFile { get; set; }
        public bool CreateNoteFilesDirsPair { get; set; }
        public bool CreateNoteInternalDirsPair { get; set; }
        public CmdCommand Command { get; set; }
        public string[]? SrcNote { get; set; }
        public string[]? SrcNoteIdx { get; set; }
        public string[]? DestnNote { get; set; }
        public string[]? DestnNoteIdx { get; set; }
        public string[] NotesOrder { get; set; }
        public string[] NoteIdxesOrder { get; set; }
    }
}
