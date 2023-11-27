using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.Core.Text
{
    public class CommonRegexesH
    {
        public static readonly Regex HtmlEntity = new Regex(@"&[a-z];");
    }
}
