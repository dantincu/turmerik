using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public enum DirType
    {
        ShortName,
        FullName
    }

    public enum DirCategory
    {
        Item,
        Internals
    }

    public enum InternalDir
    {
        Root = 1,
        Internals,
        Files
    }
}
