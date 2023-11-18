using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes.ConsoleApps
{
    public enum CmdCommand
    {
        ListNotes = 0,
        CreateNoteBook,
        CreateNoteBookInternal,
        CreateNote,
        CreateNoteInternal,
        CopyNotes,
        DeleteNotes,
        MoveNotes,
        RenameNote,
        NormalizeSortIndexes,
        NormalizeNoteIndexes,
    }
}
