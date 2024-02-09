using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.Core.TextParsing
{
    public class RegexReplacerResult
    {
        public RegexReplacerOpts NormOpts { get; set; }
        public List<MatchDataMtbl> MatchesList { get; set; }

        public string ReplacedText { get; set; }
    }
}
