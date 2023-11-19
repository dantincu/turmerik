using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes
{
    public enum NoteDirType
    {
        ShortName,
        FullName
    }

    public enum NoteDirPfxType
    {
        Main,
        Alt
    }

    public enum NoteDirCategory
    {
        Item,
        Internals
    }

    public enum NoteInternalDir
    {
        Root = 1,
        Internals,
        Files
    }

    public readonly struct NoteDirTypeTuple
    {
        public NoteDirTypeTuple(
            NoteDirCategory dirCat,
            NoteDirType dirType,
            NoteDirPfxType dirPfxType)
        {
            DirCat = dirCat;
            DirType = dirType;
            DirPfxType = dirPfxType;
        }

        public NoteDirCategory DirCat { get; }
        public NoteDirType DirType { get; }
        public NoteDirPfxType DirPfxType { get; }
    }
}
