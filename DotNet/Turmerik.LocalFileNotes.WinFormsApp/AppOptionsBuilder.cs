using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public class AppOptionsBuilder
    {
        public async Task BuildAsync(AppOptionsMtbl opts)
        {
            // opts.LaunchNoteBookFormDirectly = true;

            opts.NoteBookFormOpts = new NoteBookFormOpts
            {
                NoteBook = new Notes.NoteBook
                {
                    Title = "My Personal Note Book",
                }
            };
        }
    }
}
