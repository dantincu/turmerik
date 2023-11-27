using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Text
{
    public readonly struct RegexEncodedText
    {
        public RegexEncodedText(
            string rawStr,
            string encodedStr)
        {
            RawStr = rawStr;
            EncodedStr = encodedStr;
        }

        public string RawStr { get; }
        public string EncodedStr { get; }
    }
}
