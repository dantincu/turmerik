using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Code.Xml
{
    public enum XmlSyntaxParseError
    {
        None = 0,
        UnexpectedTokenInsideQuotedText,
        UnexpectedNwLnInsideQuotedText,
        UnexpectedTokenAfterAttrNvpJoinToken,
        UnexpectedWsAfterAttrNvpJoinToken,
        UnexpectedTokenInsideTag,
        UnexpectedTokenInsideIdnf,
    }

    public class XmlSyntaxParseErrorData
    {
        public XmlSyntaxParseError ErrorType { get; set; }
        public int InvalidStrStIdx { get; set; }
        public string InvalidStr { get; set; }
    }
}
