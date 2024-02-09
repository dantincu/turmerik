using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.Core.TextParsing
{
    public class MatchDataMtbl
    {
        public Match Data { get; set; }
        public int Index { get; set; }
        public int ReplIndex { get; set; }
        public int Length {  get; set; }
        public string Value { get; set; }
    }
}
