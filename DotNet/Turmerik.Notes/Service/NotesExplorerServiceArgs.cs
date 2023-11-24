using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.Notes.Service
{
    public class NotesExplorerServiceArgs
    {
        public CmdCommand Command { get; set; }
        public string[] SrcNote { get; set; }
        public string SrcDirIdnf { get; set; }
        public string[] SrcNoteIdx { get; set; }
        public string[] DestnNote { get; set; }
        public string DestnDirIdnf { get; set; }
        public string[] DestnNoteIdx { get; set; }
        public string[] NotesOrder { get; set; }
        public string[] NoteIdxesOrder { get; set; }
        public string NoteTitle { get; set; }
        public bool? IsPinned { get; set; }
        public int? SortIdx { get; set; }
        public int? NoteIdx { get; set; }
        public bool OpenMdFile { get; set; }
        public bool CreateNoteInternalDirsPair { get; set; }
        public bool CreateNoteFilesDirsPair { get; set; }
    }
}
