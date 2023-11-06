using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Code.Html;
using Turmerik.Code.Xml;

namespace Turmerik.Code.Md
{
    public interface IMdChunkParseArgsCore<TItem, TParser, TArgs> : IHtmlChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : MdSyntaxItem<TItem>
        where TParser : IMdChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IMdChunkParseArgsCore<TItem, TParser, TArgs>
    {
    }

    public interface IMdChunkParseArgs : IMdChunkParseArgsCore<MdSyntaxItem, IMdChunkParser, IMdChunkParseArgs>
    {
    }

    public interface IMdChunkAsyncParseArgs : IMdChunkParseArgsCore<MdSyntaxItem, IMdChunkAsyncParser, IMdChunkAsyncParseArgs>
    {
    }

    public class MdChunkParseArgsCoreBase<TItem, TParser, TArgs> : HtmlChunkParseArgsCoreBase<TItem, TParser, TArgs>, IMdChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : MdSyntaxItem<TItem>
        where TParser : IMdChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IMdChunkParseArgsCore<TItem, TParser, TArgs>
    {
        public MdChunkParseArgsCoreBase(
            ISrcCode inputCode,
            TParser codeChunkParser) : base(
                inputCode,
                codeChunkParser)
        {
        }
    }

    public class MdChunkParseArgs : MdChunkParseArgsCoreBase<MdSyntaxItem, IMdChunkParser, IMdChunkParseArgs>, IMdChunkParseArgs
    {
        public MdChunkParseArgs(
            ISrcCode inputCode,
            IMdChunkParser codeChunkParser,
            Func<int, IEnumerable<char>> nextCodeChunkFactory) : base(
                inputCode,
                codeChunkParser)
        {
            NextCodeChunkFactory = nextCodeChunkFactory ?? throw new ArgumentNullException(
                nameof(nextCodeChunkFactory));
        }

        public Func<int, IEnumerable<char>> NextCodeChunkFactory { get; }
    }

    public class MdChunkParseAsyncArgs : MdChunkParseArgsCoreBase<MdSyntaxItem, IMdChunkAsyncParser, IMdChunkAsyncParseArgs>, IMdChunkAsyncParseArgs
    {
        public MdChunkParseAsyncArgs(
            ISrcCode inputCode,
            IMdChunkAsyncParser codeChunkParser,
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
