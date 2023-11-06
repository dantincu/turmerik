using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Turmerik.Helpers;

namespace Turmerik.Code
{
    public interface ICodeParser
    {
        void Parse<TItem, TParser, TArgs>(
            TArgs args)
            where TItem : CodeSyntaxItem<TItem>
            where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
            where TArgs : ICodeChunkParseArgs<TItem, TParser, TArgs>;

        Task ParseAsync<TItem, TParser, TArgs>(
            TArgs args)
            where TItem : CodeSyntaxItem<TItem>
            where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
            where TArgs : ICodeChunkAsyncParseArgs<TItem, TParser, TArgs>;

        void ParseChunk<TItem, TParser, TArgs>(
            TArgs args,
            IEnumerable<char> nextCodeChunk)
            where TItem : CodeSyntaxItem<TItem>
            where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
            where TArgs : ICodeChunkParseArgsCore<TItem, TParser, TArgs>;
    }

    public class CodeParser : ICodeParser
    {
        public void Parse<TItem, TParser, TArgs>(
            TArgs args)
            where TItem : CodeSyntaxItem<TItem>
            where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
            where TArgs : ICodeChunkParseArgs<TItem, TParser, TArgs>
        {
            var nextCodeChunk = args.NextCodeChunkFactory(args.InputCode.Length);

            while (!args.Stop && (nextCodeChunk?.Any() ?? false))
            {
                ParseChunk<TItem, TParser, TArgs>(args, nextCodeChunk);
                nextCodeChunk = args.NextCodeChunkFactory(args.InputCode.Length);
            }
        }

        public async Task ParseAsync<TItem, TParser, TArgs>(
            TArgs args)
            where TItem : CodeSyntaxItem<TItem>
            where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
            where TArgs : ICodeChunkAsyncParseArgs<TItem, TParser, TArgs>
        {
            var nextCodeChunk = await args.NextCodeChunkFactory(args.InputCode.Length);

            while (nextCodeChunk?.Any() ?? false)
            {
                ParseChunk<TItem, TParser, TArgs>(args, nextCodeChunk);
                nextCodeChunk = await args.NextCodeChunkFactory(args.InputCode.Length);
            }
        }

        public void ParseChunk<TItem, TParser, TArgs>(
            TArgs args,
            IEnumerable<char> nextCodeChunk)
            where TItem : CodeSyntaxItem<TItem>
            where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
            where TArgs : ICodeChunkParseArgsCore<TItem, TParser, TArgs>
        {
            args.InputCode.Append(nextCodeChunk);

            while (args.Stop && args.InputCode.Char != default)
            {
                args.CodeChunkParser.ParseNextNode(args);
                args.OnNewNodeParsed?.Invoke(args);
            }
        }
    }
}
