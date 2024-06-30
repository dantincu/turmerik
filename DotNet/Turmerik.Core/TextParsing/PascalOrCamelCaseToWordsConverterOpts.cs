using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.TextParsing
{
    public class PascalOrCamelCaseToWordsConverterOpts
    {
        public PascalOrCamelCaseToWordsConverterOpts()
        {
        }

        public PascalOrCamelCaseToWordsConverterOpts(
            PascalOrCamelCaseToWordsConverterOpts opts)
        {
            InputStr = opts.InputStr;
            DecapitalizeAll = opts.DecapitalizeAll;
            CapitalizeFirst = opts.CapitalizeFirst;
            RemovableChars = opts.RemovableChars;
        }

        public string InputStr { get; set; }
        public bool CapitalizeFirst { get; set; }
        public bool DecapitalizeAll { get; set; }
        public char[] RemovableChars { get; set; }
    }
}
