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
}
