using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public class DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
        where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
        where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
        where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
    {
        public DataTreeGeneratorOpts(
            Func<TOpts, TArgs> argsFactory,
            TryRetrieve<TArgs, TNode> nextRootNodeRetriever,
            Func<TArgs, DataTreeGeneratorStepData> nextStepPredicate)
        {
            ArgsFactory = argsFactory;
            NextRootNodeRetriever = nextRootNodeRetriever;
            NextStepPredicate = nextStepPredicate;
        }

        public Func<TOpts, TArgs> ArgsFactory { get; }
        public TryRetrieve<TArgs, TNode> NextRootNodeRetriever { get; }
        public Func<TArgs, DataTreeGeneratorStepData> NextStepPredicate { get; }
    }
}
