﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes
{
    public class NoteDirsPairOpts
    {
        public string PrIdnf { get; set; }
        public string Title { get; set; }
        public int? SortIdx { get; set; }
        public bool IsPinned { get; set; }
        public bool OpenMdFile { get; set; }
        public bool CreateNoteBookDirsPair { get; set; }
        public bool CreateNoteInternalDirsPair { get; set; }
        public bool CreateNoteFilesDirsPair { get; set; }
    }
}
