using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp.Db
{
    public class AppSession
    {
        public int? SessionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastOpenedAt { get; set; }
        public DateTime LastActiveAt { get; set; }
        public DateTime? LastClosedAt { get; set; }
        public int? NoteBookId { get; set; }

        public FsNoteBook NoteBook { get; set; }
    }
}
