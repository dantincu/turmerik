using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Notes.ConsoleApps;

namespace Turmerik.MkFsNoteDirsPair.ConsoleApp
{
    public class ProgramArgs
    {
        public CmdCommand Command { get; set; }
        public string[] SrcNote { get; set; }
        public string SrcDirIdnf { get; set; }
        public string[] SrcNoteIdx { get; set; }
        public string[] DestnNote { get; set; }
        public string DestnDirIdnf { get; set; }
        public string[] DestnNoteIdx { get; set; }
        public string NoteTitle { get; set; }
        public int? SortIdx { get; set; }
        public bool IsPinned { get; set; }
        public bool OpenMdFile { get; set; }
        public bool NormalizeSortIdxes { get; set; }
        public bool NormalizeNoteIdxes { get; set; }
        public bool CreateNoteInternalDirsPair { get; set; }
        public bool CreateNoteFilesDirsPair { get; set; }
        public bool? ListNotes { get; set; }
        public bool? CopyNote { get; set; }
        public bool? CopyNoteIdx { get; set; }
        public bool? MoveNote { get; set; }
        public bool? MoveNoteIdx { get; set; }
        public bool? RenameNote { get; set; }
        public bool? RenameNoteIdx { get; set; }
        public bool? DeleteNote { get; set; }
        public bool? DeleteNoteIdx { get; set; }
    }
}
