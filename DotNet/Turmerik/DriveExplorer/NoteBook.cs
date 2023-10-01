using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteBook
    {
        public int? InternalDirIdx { get; set; }
        public Dictionary<int, NoteItem> Notes { get; set; }
    }
}
