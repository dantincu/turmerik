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
            Func<TArgs, DataTreeGeneratorStepData> nextStepPredicate,
            Func<TArgs, TNode, bool> onChildNodesIterated = null)
        {
            ArgsFactory = argsFactory;

            NextRootNodeRetrieverFactory = nextRootNodeRetrieverFactory ?? throw new ArgumentNullException(
                nameof(nextRootNodeRetrieverFactory));

            NextStepPredicate = nextStepPredicate ?? throw new ArgumentNullException(
                nameof(nextStepPredicate));

            OnChildNodesIterated = onChildNodesIterated ?? DataTreeGeneratorH.OnChildNodesIterated<TData, TNode, TOpts, TArgs>();
        }

        public Func<TOpts, TArgs> ArgsFactory { get; }
        public Func<TArgs, TryRetrieve1In1Out<TArgs, TNode>> NextRootNodeRetrieverFactory { get; }
        public Func<TArgs, DataTreeGeneratorStepData> NextStepPredicate { get; }
        public Func<TArgs, TNode, bool> OnChildNodesIterated { get; }
    }
}
