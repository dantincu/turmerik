﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes
{
    public enum CmdCommand
    {
        Help = 1,
        ListNotes,
        CreateNoteBook,
        CreateNoteBookInternal,
        CreateNote,
        CreateNoteInternal,
        CopyNotes,
        DeleteNotes,
        MoveNotes,
        RenameNote,
        NormalizeNote,
        NormalizeNoteIdxes,
    }
}
