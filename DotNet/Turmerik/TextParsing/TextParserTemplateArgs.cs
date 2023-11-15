using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Utility;

namespace Turmerik.TextParsing
{
    public class TextParserTemplateArgs<TNode, TArgs>
        where TArgs : TextParserTemplateArgs<TNode, TArgs>
    {
        public TextParserTemplateArgs(
            TextParserTemplateOpts<TNode, TArgs> opts)
        {
            Opts = opts ?? throw new ArgumentNullException(nameof(opts));
            RootNodes = new List<DataTreeNode<TNode>>();
            Stack = new Stack<DataTreeNode<TNode>>();
        }

        public TextParserTemplateOpts<TNode, TArgs> Opts { get; }
        public List<DataTreeNode<TNode>> RootNodes { get; }
        public Stack<DataTreeNode<TNode>> Stack { get; }

        public int Idx { get; set; }
        public DataTreeNode<TNode> Parent { get; set; }
        public DataTreeNode<TNode> Current { get; set; }
        public bool Stop { get; set; }
    }
}
