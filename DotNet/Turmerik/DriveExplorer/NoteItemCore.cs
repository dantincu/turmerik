using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class NoteItemCore
    {
        public string Title { get; set; }
        public int? ItemIdx { get; set; }

        public Dictionary<InternalDir, int> InternalDirs { get; set; }
        public Dictionary<int, string> ChildItems { get; set; }
    }
}
