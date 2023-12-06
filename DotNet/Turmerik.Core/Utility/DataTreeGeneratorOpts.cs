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
            Func<TArgs, TryRetrieve1In1Out<TArgs, TNode>> nextRootNodeRetrieverFactory,
            Func<TArgs, DataTreeGeneratorStepData> nextStepPredicate)
        {
            ArgsFactory = argsFactory;

            NextRootNodeRetrieverFactory = nextRootNodeRetrieverFactory ?? throw new ArgumentNullException(
                nameof(nextRootNodeRetrieverFactory));

            NextStepPredicate = nextStepPredicate ?? throw new ArgumentNullException(
                nameof(nextStepPredicate));
        }

        public Func<TOpts, TArgs> ArgsFactory { get; }
        public Func<TArgs, TryRetrieve1In1Out<TArgs, TNode>> NextRootNodeRetrieverFactory { get; }
        public Func<TArgs, DataTreeGeneratorStepData> NextStepPredicate { get; }
    }
}
