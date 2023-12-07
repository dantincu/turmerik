using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public interface IDataTreeGeneratorFactory
    {
        IDataTreeGenerator Default { get; }
        IDataTreeGenerator Recursive { get; }
        IDataTreeGenerator NonRecursive { get; }

        IDataTreeGenerator<TData, TNode, TOpts, TArgs> CreateDefault<TData, TNode, TOpts, TArgs>()
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>;

        IDataTreeGenerator<TData, TNode, TOpts, TArgs> CreateRecursive<TData, TNode, TOpts, TArgs>()
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>;

        IDataTreeGenerator<TData, TNode, TOpts, TArgs> CreateNonRecursive<TData, TNode, TOpts, TArgs>()
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>;
    }

    public class DataTreeGeneratorFactory : IDataTreeGeneratorFactory
    {
        public DataTreeGeneratorFactory()
        {
            Recursive = new RecursiveDataTreeGenerator();
            NonRecursive = new NonRecursiveDataTreeGenerator();
        }

        public IDataTreeGenerator Default => NonRecursive;
        public IDataTreeGenerator Recursive { get; }
        public IDataTreeGenerator NonRecursive { get; }

        public IDataTreeGenerator<TData, TNode, TOpts, TArgs> CreateDefault<TData, TNode, TOpts, TArgs>()
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs> => new DataTreeGenerator<TData, TNode, TOpts, TArgs>(
                Default);

        public IDataTreeGenerator<TData, TNode, TOpts, TArgs> CreateRecursive<TData, TNode, TOpts, TArgs>()
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs> => new DataTreeGenerator<TData, TNode, TOpts, TArgs>(
                Recursive);

        public IDataTreeGenerator<TData, TNode, TOpts, TArgs> CreateNonRecursive<TData, TNode, TOpts, TArgs>()
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs> => new DataTreeGenerator<TData, TNode, TOpts, TArgs>(
                NonRecursive);
    }
}
