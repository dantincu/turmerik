using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Code.Xml
{
    public interface IXmlChunkParseArgsCore<TItem, TParser, TArgs> : ICodeChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : XmlSyntaxItem<TItem>
        where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IXmlChunkParseArgsCore<TItem, TParser, TArgs>
    {
        XmlSyntaxParseStateData ParseState { get; set; }
    }

    public interface IXmlChunkParseArgs : IXmlChunkParseArgsCore<XmlSyntaxItem, IXmlChunkParser, IXmlChunkParseArgs>
    {
    }

    public interface IXmlChunkAsyncParseArgs : IXmlChunkParseArgsCore<XmlSyntaxItem, IXmlChunkAsyncParser, IXmlChunkAsyncParseArgs>
    {
    }

    public class XmlChunkParseArgsCoreBase<TItem, TParser, TArgs> : CodeChunkParseArgsCoreBase<TItem, TParser, TArgs>, IXmlChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : XmlSyntaxItem<TItem>
        where TParser : IXmlChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IXmlChunkParseArgsCore<TItem, TParser, TArgs>
    {
        public XmlChunkParseArgsCoreBase(
            ISrcCode inputCode,
            TParser codeChunkParser) : base(
                inputCode,
                codeChunkParser)
        {
            ParseState = new XmlSyntaxParseStateData();
        }

        public XmlSyntaxParseStateData ParseState { get; set; }
    }

    public class XmlChunkParseArgs : XmlChunkParseArgsCoreBase<XmlSyntaxItem, IXmlChunkParser, IXmlChunkParseArgs>, IXmlChunkParseArgs
    {
        public XmlChunkParseArgs(ISrcCode inputCode, IXmlChunkParser codeChunkParser) : base(inputCode, codeChunkParser)
        {
        }

        public Func<int, IEnumerable<char>> NextCodeChunkFactory => throw new NotImplementedException();
    }

    public class XmlChunkAsyncParseArgs : XmlChunkParseArgsCoreBase<XmlSyntaxItem, IXmlChunkAsyncParser, IXmlChunkAsyncParseArgs>, IXmlChunkAsyncParseArgs
    {
        public XmlChunkAsyncParseArgs(ISrcCode inputCode, IXmlChunkAsyncParser codeChunkParser) : base(inputCode, codeChunkParser)
        {
        }

        public Func<int, Task<IEnumerable<char>>> NextCodeChunkFactory => throw new NotImplementedException();
    }
}
