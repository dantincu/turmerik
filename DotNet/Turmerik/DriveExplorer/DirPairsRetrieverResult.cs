using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class DirPairsRetrieverResult
    {
        public string WorkDir { get; set; }
        public string[] ExistingDirsArr { get; set; }
        public Dictionary<int, NoteItemCore> Notes { get; set; }
        public Dictionary<string, List<NoteDirName>> NoteDirPairs { get; set; }
        public Dictionary<string, List<NoteDirName>> InternalDirPairs { get; set; }
        public Dictionary<string, List<NoteDirName>> AmbgDirPairs { get; set; }
        public List<string> AmbgEntryNames { get; set; }
    }
}
