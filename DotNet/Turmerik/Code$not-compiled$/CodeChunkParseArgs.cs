using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Code.Md;
using Turmerik.Helpers;

namespace Turmerik.Code
{
    public interface ICodeChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : CodeSyntaxItem<TItem>
        where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
        where TArgs : ICodeChunkParseArgsCore<TItem, TParser, TArgs>
    {
        ISrcCode InputCode { get; }
        TParser CodeChunkParser { get; }
        List<TItem> RootNodes { get; }
        Stack<TItem> NodePath { get; }

        Action<TArgs> OnNewNodeParsed { get; set; }
        bool Stop { get; set; }

        TItem? ParentNode { get; set; }
        TItem? CurrentNode { get; set; }

        bool PushIfNotNull();
        TItem? PushIfNotNull(TItem? newParent);
        int AddIfNotNull();
        KeyValuePair<int, TItem?> AddIfNotNull(TItem? sibbling);
        int PopIfNotNull();
    }

    public interface ICodeChunkParseArgs<TItem, TParser, TArgs> : ICodeChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : CodeSyntaxItem<TItem>
        where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
        where TArgs : ICodeChunkParseArgs<TItem, TParser, TArgs>
    {
        Func<int, IEnumerable<char>> NextCodeChunkFactory { get; }
    }

    public interface ICodeChunkAsyncParseArgs<TItem, TParser, TArgs> : ICodeChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : CodeSyntaxItem<TItem>
        where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
        where TArgs : ICodeChunkAsyncParseArgs<TItem, TParser, TArgs>
    {
        Func<int, Task<IEnumerable<char>>> NextCodeChunkFactory { get; }
    }

    public abstract class CodeChunkParseArgsCoreBase<TItem, TParser, TArgs> : ICodeChunkParseArgsCore<TItem, TParser, TArgs>
        where TItem : CodeSyntaxItem<TItem>
        where TParser : ICodeChunkParserCore<TItem, TParser, TArgs>
        where TArgs : ICodeChunkParseArgsCore<TItem, TParser, TArgs>
    {
        protected CodeChunkParseArgsCoreBase(
            ISrcCode inputCode,
            TParser codeChunkParser)
        {
            this.InputCode = inputCode ?? throw new ArgumentNullException(
                nameof(inputCode));

            this.CodeChunkParser = codeChunkParser ?? throw new ArgumentNullException(
                nameof(codeChunkParser));

            RootNodes = new List<TItem>();
            NodePath = new Stack<TItem>();
        }

        public ISrcCode InputCode { get; }
        public TParser CodeChunkParser { get; }
        public List<TItem> RootNodes { get; }
        public Stack<TItem> NodePath { get; }

        public Action<TArgs> OnNewNodeParsed { get; set; }
        public bool Stop { get; set; }

        public TItem? ParentNode { get; set; }
        public TItem? CurrentNode { get; set; }

        public bool PushIfNotNull()
        {
            bool retVal = CurrentNode != null;

            if (retVal)
            {
                NodePath.Push(CurrentNode!);
                ParentNode = CurrentNode;
                CurrentNode = null;
            }

            return retVal;
        }

        public TItem? PushIfNotNull(TItem? newParent)
        {
            if (newParent != null)
            {
                CurrentNode = newParent;
                PushIfNotNull();
            }

            return newParent;
        }

        public int AddIfNotNull()
        {
            int idx = -1;

            if (CurrentNode != null)
            {
                if (ParentNode != null)
                {
                    ParentNode.AddChildNode(
                        CurrentNode!);

                    idx = ParentNode.ChildNodes!.Count - 1;
                }
                else
                {
                    RootNodes.Add(CurrentNode!);
                    idx = RootNodes.Count - 1;
                }
            }

            return idx;
        }

        public KeyValuePair<int, TItem?> AddIfNotNull(TItem? sibbling)
        {
            int idx = -1;

            if (sibbling != null)
            {
                CurrentNode = sibbling;
                idx = AddIfNotNull();
            }

            return new KeyValuePair<int, TItem?>(idx, sibbling);
        }

        public int PopIfNotNull()
        {
            int idx = -1;
            CurrentNode = ParentNode;

            if (NodePath.Any())
            {
                ParentNode = NodePath.Pop();
                idx = ParentNode.ChildNodes?.IndexOf(CurrentNode!) ?? -1;
            }
            else
            {
                ParentNode = null;
            }

            return idx;
        }
    }
}
