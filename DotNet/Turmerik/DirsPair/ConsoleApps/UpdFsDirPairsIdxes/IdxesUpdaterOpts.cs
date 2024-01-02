using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes
{
    public class IdxesUpdaterOpts
    {
        public int MinIdx { get; set; }
        public int MaxIdx { get; set; }
        public bool IncIdx { get; set; }

        public int DfStIdx { get; set; }
        public int DfEndIdx { get; set; }

        public int IdxIncVal { get; set; }
        public Comparison<int> IdxComparison { get; set; }

        public int[] PrevIdxes { get; set; }
        public IdxesUpdateMapping[] IdxesUpdateMappings { get; set; }
    }
}
