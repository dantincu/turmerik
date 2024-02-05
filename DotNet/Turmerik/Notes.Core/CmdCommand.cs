using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes.Core
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
        UpdateNote,
        ReorderNotes,
        NormalizeNote,
        NormalizeNoteIdxes,
        NormalizeNotesHcy,
    }

    public enum TrmrkStorageOption
    {
        IndexedDB,
        FileSystemApi,
        MsGraphApi,
        GoogleApi,
        DropBoxApi,
        LocalFilesTrmrkRestApi,
        WinOSLocalFilesTrmrkRestApi,
        MsGraphTrmrkRestApi,
        GoogleTrmrkRestApi,
        DropBoxTrmrkRestApi,
    }
}
