﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Code.Core
{
    public class IdentifierNormalizerOpts
    {
        public string InputIdentifier { get; set; }
        public string OtherAllowedChars { get; set; }
        public string OtherStartingAllowedChars { get; set; }
        public string DisalowedStartingCharsPfx { get; set; }
        public char? DisalowedReplacingChar { get; set; }

        public Dictionary<string, string> ReplacingStrsMap { get; set; }

        public List<IdentifierReplacingRegexTuple> ReplacingRegexes { get; set; }
    }
}
