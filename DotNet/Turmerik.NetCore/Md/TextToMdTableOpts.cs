using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.NetCore.Md
{
    public class TextToMdTableOpts
    {
        public string InputText { get; set; }
        public string Separator { get; set; }
        public bool FirstLineIsHeader { get; set; }
        public bool InsertSpacesBetweenTokens { get; set; }
        public bool SurroundLineWithCellSep { get; set; }
    }
}
