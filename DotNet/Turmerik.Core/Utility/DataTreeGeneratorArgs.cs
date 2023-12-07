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
        }

        public TOpts Opts { get; }
        public List<DataTreeNode<TNode>> RootNodes { get; }

        public int LevelIdx { get; set; }
        public int Idx { get; set; }
        public DataTreeNode<TNode> Current { get; set; }
        public DataTreeNode<TNode> Next { get; set; }
        public bool Stop { get; set; }
        public int RemoveOnPop { get; set; }
    }
}
