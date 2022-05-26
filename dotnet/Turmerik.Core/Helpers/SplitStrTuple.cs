using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Helpers
{
    public class SplitStrTuple
    {
        public SplitStrTuple(string str, char chr)
        {
            Str = str;
            Chr = chr;
        }

        public string Str { get; }
        public char Chr { get; }
    }
}
