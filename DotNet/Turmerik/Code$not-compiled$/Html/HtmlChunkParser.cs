using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Code.Xml;

namespace Turmerik.Code.Html
{
    public interface IHtmlChunkParserCore<TItem, TParser, TArgs> : IXmlChunkParserCore<TItem, TParser, TArgs>
        where TItem : HtmlSyntaxItem<TItem>
        where TParser : IHtmlChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IHtmlChunkParseArgsCore<TItem, TParser, TArgs>
    {
    }

    public interface IHtmlChunkParser : IHtmlChunkParserCore<HtmlSyntaxItem, IHtmlChunkParser, IHtmlChunkParseArgs>
    {
    }

    public interface IHtmlChunkAsyncParser : IHtmlChunkParserCore<HtmlSyntaxItem, IHtmlChunkAsyncParser, IHtmlChunkAsyncParseArgs>
    {
    }

    public abstract class HtmlChunkParserCoreBase<TItem, TParser, TArgs> : XmlChunkParserCoreBase<TItem, TParser, TArgs>, IHtmlChunkParserCore<TItem, TParser, TArgs>
        where TItem : HtmlSyntaxItem<TItem>, new()
        where TParser : IHtmlChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IHtmlChunkParseArgsCore<TItem, TParser, TArgs>
    {
        public override void ParseNextNode(TArgs args)
        {
            throw new NotImplementedException();
        }
    }

    public class HtmlChunkParser : HtmlChunkParserCoreBase<HtmlSyntaxItem, IHtmlChunkParser, IHtmlChunkParseArgs>, IHtmlChunkParser
    {
    }

    public class HtmlChunkAsyncParser : HtmlChunkParserCoreBase<HtmlSyntaxItem, IHtmlChunkAsyncParser, IHtmlChunkAsyncParseArgs>, IHtmlChunkAsyncParser
    {
    }
}
