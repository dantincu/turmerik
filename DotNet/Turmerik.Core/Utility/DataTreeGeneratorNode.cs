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
            Func<TArgs, TryRetrieve1In1Out<TArgs, TNode>> nextChildNodeRetrieverFactory)
        {
            Value = value;

            NextChildNodeRetrieverFactory = nextChildNodeRetrieverFactory ?? throw new ArgumentNullException(
                nameof(nextChildNodeRetrieverFactory));
        }

        public TData Value { get; }
        public Func<TArgs, TryRetrieve1In1Out<TArgs, TNode>> NextChildNodeRetrieverFactory { get; }
    }
}
