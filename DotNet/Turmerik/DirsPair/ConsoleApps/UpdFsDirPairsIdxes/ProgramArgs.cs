using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.TextParsing.IndexesFilter;
using Turmerik.Notes.Core;

namespace Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes
{
    public class ProgramArgs
    {
        public string WorkDir { get; set; }
        public bool? InteractiveMode { get; set; }

        public List<IdxesUpdateMapping> IdxesUpdateMappings { get; set; }
    }
}
