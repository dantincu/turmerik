using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public interface IDataTreeGenerator
    {
        TArgs GetNodes<TData, TNode, TOpts, TArgs>(
            TOpts opts)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>;
    }

    public abstract class DataTreeGeneratorBase : IDataTreeGenerator
    {
        public TArgs GetNodes<TData, TNode, TOpts, TArgs>(
            TOpts opts)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            var argsFactory = opts.ArgsFactory.FirstNotNull(
                o => o.CreateFromSrc<TArgs>());

            var args = argsFactory(opts);
            var stack = new Stack<DataTreeNode<TNode>>();

            GetNodes<TData, TNode, TOpts, TArgs>(args, stack);
            return args;
        }

        protected abstract void GetNodes<TData, TNode, TOpts, TArgs>(
            TArgs args,
            Stack<DataTreeNode<TNode>> stack)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>;

        protected void AddToTreeNodesList<TData, TNode, TOpts, TArgs>(
            DataTreeNode<TNode> treeNode,
            List<DataTreeNode<TNode>> treeNodesList)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            treeNodesList.Add(treeNode ?? throw new ArgumentNullException(
                nameof(treeNode)));
        }

        protected bool TryPushStack<TData, TNode, TOpts, TArgs>(
            TArgs args,
            DataTreeNode<TNode> treeNode,
            List<DataTreeNode<TNode>> treeNodesList,
            Stack<DataTreeNode<TNode>> stack)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            AddToTreeNodesList<TData, TNode, TOpts, TArgs>(treeNode, treeNodesList);
            bool push = args.Current != null;

            if (push)
            {
                stack.Push(args.Current);
            }

            args.Current = treeNode;
            args.Next = default;

            return push;
        }

        protected bool TryPopStack<TData, TNode, TOpts, TArgs>(
            TArgs args,
            Stack<DataTreeNode<TNode>> stack)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            args.Next = args.Current;
            bool pop = stack.Any();

            if (pop)
            {
                args.Current = stack.Pop();
            }
            else
            {
                args.Current = default;
            }

            return pop;
        }
    }
}
