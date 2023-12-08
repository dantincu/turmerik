using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalFileNotes.WinFormsApp.Settings;

namespace Turmerik.LocalFileNotes.WinFormsApp.Db
{
    public class FsNoteBook
    {
        public int? NoteId { get; set; }
        public string NoteBookDirPath { get; set; }
        public string NoteBookTitle { get; set; }
        public ReopenNoteBookBehaviorType? ReopenNoteBookBehaviorType { get; set; }
    }
}
