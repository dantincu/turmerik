using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Code.Xml;

namespace Turmerik.Code.Html
{
    public interface IHtmlChunkParseArgsCore<TItem, TParser, TArgs> : IXmlChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : HtmlSyntaxItem<TItem>
        where TParser : IHtmlChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IHtmlChunkParseArgsCore<TItem, TParser, TArgs>
    {
    }

    public interface IHtmlChunkParseArgs : IHtmlChunkParseArgsCore<HtmlSyntaxItem, IHtmlChunkParser, IHtmlChunkParseArgs>
    {
    }

    public interface IHtmlChunkAsyncParseArgs : IHtmlChunkParseArgsCore<HtmlSyntaxItem, IHtmlChunkAsyncParser, IHtmlChunkAsyncParseArgs>
    {
    }

    public class HtmlChunkParseArgsCoreBase<TItem, TParser, TArgs> : XmlChunkParseArgsCoreBase<TItem, TParser, TArgs>, IHtmlChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : HtmlSyntaxItem<TItem>
        where TParser : IHtmlChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IHtmlChunkParseArgsCore<TItem, TParser, TArgs>
    {
        public HtmlChunkParseArgsCoreBase(
            ISrcCode inputCode,
            TParser codeChunkParser) : base(
                inputCode,
                codeChunkParser)
        {
        }
    }

    public class HtmlChunkParseArgs : HtmlChunkParseArgsCoreBase<HtmlSyntaxItem, IHtmlChunkParser, IHtmlChunkParseArgs>, IHtmlChunkParseArgs
    {
        public HtmlChunkParseArgs(
            ISrcCode inputCode,
            IHtmlChunkParser codeChunkParser,
            Func<int, IEnumerable<char>> nextCodeChunkFactory) : base(
                inputCode,
                codeChunkParser)
        {
            NextCodeChunkFactory = nextCodeChunkFactory ?? throw new ArgumentNullException(
                nameof(nextCodeChunkFactory));
        }

        public Func<int, IEnumerable<char>> NextCodeChunkFactory { get; }
    }

    public class HtmlChunkAsyncParseArgs : HtmlChunkParseArgsCoreBase<HtmlSyntaxItem, IHtmlChunkAsyncParser, IHtmlChunkAsyncParseArgs>, IHtmlChunkAsyncParseArgs
    {
        public HtmlChunkAsyncParseArgs(
            ISrcCode inputCode,
            IHtmlChunkAsyncParser codeChunkParser,
            Func<int, Task<IEnumerable<char>>> nextCodeChunkFactory) : base(
                inputCode,
                codeChunkParser)
        {
            NextCodeChunkFactory = nextCodeChunkFactory ?? throw new ArgumentNullException(
                nameof(nextCodeChunkFactory));
        }

        public Func<int, Task<IEnumerable<char>>> NextCodeChunkFactory { get; }
    }
}
