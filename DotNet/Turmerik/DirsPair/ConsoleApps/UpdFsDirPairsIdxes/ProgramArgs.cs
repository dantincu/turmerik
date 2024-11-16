using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing.IndexesFilter;
using Turmerik.Notes.Core;

namespace Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes
{
    public class ProgramArgs
    {
        public bool? PrintHelpMessage { get; set; }
        public string WorkDir { get; set; }
        public LocalDevicePathMacrosMapMtbl LocalDevicePathsMap { get; set; }
        public bool? InteractiveMode { get; set; }
        public bool? UpdateNotes { get; set; }
        public bool? UpdateSections { get; set; }
        public string? UpdateSectionRank { get; set; }
        public bool? ConvertToNoteSections { get; set; }
        public bool? ConvertToNoteItems { get; set; }
        public bool? SrcFromSections { get; set; }
        public string? SrcSectionRank { get; set; }
        public bool? TrgFromSections { get; set; }
        public string? TrgSectionRank { get; set; }

        public List<IdxesUpdateMapping> IdxesUpdateMappings { get; set; }
    }
}
