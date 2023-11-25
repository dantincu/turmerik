﻿using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.DriveExplorer.DirsPair
{
    public class DirsPairTuple
    {
        public NoteDirCategory NoteDirCat { get; set; }
        public NoteDirPfxType NoteDirPfxType { get; set; }
        public NoteInternalDir? NoteInternalDir { get; set; }
        public int NoteIdx { get; set; }
        public string ShortDirName { get; set; }
        public string FullDirName { get; set; }
        public string FullDirNamePart { get; set; }
        public Dictionary<string, string> DirNamesMap { get; set; }
    }
}
