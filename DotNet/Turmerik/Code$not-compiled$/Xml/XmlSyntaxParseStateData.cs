using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Code.Xml
{
    public class XmlSyntaxParseStateData
    {
        public XmlSyntaxParseErrorData Error { get; set; }
        public bool IsTag { get; set; }
        public bool IsQuotedText { get; set; }
        public bool IsCData { get; set; }
        public bool IsComment { get; set; }
    }
}
