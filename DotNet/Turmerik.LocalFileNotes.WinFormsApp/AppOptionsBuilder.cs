using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public class AppOptionsBuilder
    {
        public async Task BuildAsync(AppOptionsMtbl opts)
        {
            opts.NoteBookFormOpts = new NoteBookFormOpts
            {
                NoteBook = new NoteBook
                {
                    Title = "My Personal Note Book",
                }
            };
        }
    }
}
