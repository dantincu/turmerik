using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.Code.Core
{
    public class IdentifierReplacingRegexTuple
    {
        public Regex Regex { get; set; }
        public Func<string, string> ReplacingTextFactory { get; set; }
        public string ReplacingText { get; set; }
    }
}
