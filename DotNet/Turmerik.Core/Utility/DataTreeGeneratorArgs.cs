using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public class DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
        where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
        where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
    {
        public DataTreeGeneratorArgs(
            TOpts opts)
        {
            Opts = opts ?? throw new ArgumentNullException(nameof(opts));
            RootNodes = new List<DataTreeNode<TNode>>();
            Stack = new Stack<DataTreeNode<TNode>>();
        }

        public TOpts Opts { get; }
        public List<DataTreeNode<TNode>> RootNodes { get; }
        public Stack<DataTreeNode<TNode>> Stack { get; }

        public int Idx { get; set; }
        public DataTreeNode<TNode> Current { get; set; }
        public DataTreeNode<TNode> Next { get; set; }
        public bool Stop { get; set; }
    }
}
