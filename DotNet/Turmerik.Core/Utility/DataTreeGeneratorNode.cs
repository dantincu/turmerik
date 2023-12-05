using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public class DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
        where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
        where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
        where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
    {
        public DataTreeGeneratorNode(
            TData value,
            TryRetrieve1<TArgs, TNode, TNode> nextChildNodeRetriever)
        {
            Value = value;

            NextChildNodeRetriever = nextChildNodeRetriever ?? throw new ArgumentNullException(
                nameof(nextChildNodeRetriever));
        }

        public TData Value { get; }
        public TryRetrieve1<TArgs, TNode, TNode> NextChildNodeRetriever { get; }
    }
}
