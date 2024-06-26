﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Notes.Core;

namespace Turmerik.DirsPair.ConsoleApps.LsFsDirPairs
{
    public class ProgramArgs
    {
        public bool? PrintHelpMessage { get; set; }
        public string WorkDir { get; set; }
        public bool? ShowLastCreatedFirst { get; set; }
        public bool? ShowOtherDirNames { get; set; }
        public NoteItemsTupleCore NoteItemsTuple { get; set; }
    }
}
