using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Code.Html;
using Turmerik.Code.Xml;

namespace Turmerik.Code.Md
{
    public interface IMdChunkParserCore<TItem, TParser, TArgs> : IHtmlChunkParserCore<TItem, TParser, TArgs>
        where TItem : MdSyntaxItem<TItem>
        where TParser : IMdChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IMdChunkParseArgsCore<TItem, TParser, TArgs>
    {
    }

    public interface IMdChunkParser : IMdChunkParserCore<MdSyntaxItem, IMdChunkParser, IMdChunkParseArgs>
    {
    }

    public interface IMdChunkAsyncParser : IMdChunkParserCore<MdSyntaxItem, IMdChunkAsyncParser, IMdChunkAsyncParseArgs>
    {
    }

    public abstract class MdChunkParserCoreBase<TItem, TParser, TArgs> : HtmlChunkParserCoreBase<TItem, TParser, TArgs>, IMdChunkParserCore<TItem, TParser, TArgs>
        where TItem : MdSyntaxItem<TItem>, new()
        where TParser : IMdChunkParserCore<TItem, TParser, TArgs>
        where TArgs : IMdChunkParseArgsCore<TItem, TParser, TArgs>
    {
        public override void ParseNextNode(TArgs args)
        {
            throw new NotImplementedException();
        }
    }

    public class MdChunkParser : MdChunkParserCoreBase<MdSyntaxItem, IMdChunkParser, IMdChunkParseArgs>, IMdChunkParser
    {
    }

    public class MdChunkAsyncParser : MdChunkParserCoreBase<MdSyntaxItem, IMdChunkAsyncParser, IMdChunkAsyncParseArgs>, IMdChunkAsyncParser
    {
    }
}
