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

        void GetNodes<TData, TNode, TOpts, TArgs>(
            TArgs args)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>;

        bool GetNodes<TData, TNode, TOpts, TArgs>(
            TArgs args,
            ref DataTreeGeneratorStepData nextStep,
            DataTreeNode<TNode> treeNode)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>;
    }

    public class DataTreeGenerator : IDataTreeGenerator
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
            GetNodes<TData, TNode, TOpts, TArgs>(args);

            return args;
        }

        public void GetNodes<TData, TNode, TOpts, TArgs>(
            TArgs args)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            DataTreeGeneratorStepData nextStep = default;
            TryRetrieve1In1Out<TArgs, TNode> nextNodeRetriever;
            
            if (args.Current != null)
            {
                nextNodeRetriever = args.Current.Data.NextChildNodeRetrieverFactory(args);
            }
            else
            {
                nextNodeRetriever = args.Opts.NextRootNodeRetrieverFactory(args);
            }

            int idx = 0;
            bool hasNode = nextNodeRetriever(args, out var node);

            while (hasNode)
            {
                var treeNode = new DataTreeNode<TNode>(
                    node, args.Current);

                if (GetNodes<TData, TNode, TOpts, TArgs>(
                    args,
                    ref nextStep,
                    treeNode))
                {
                    break;
                }

                idx++;
                args.Idx = idx;
                hasNode = nextNodeRetriever(args, out node);
            }
        }

        public bool GetNodes<TData, TNode, TOpts, TArgs>(
            TArgs args,
            ref DataTreeGeneratorStepData nextStep,
            DataTreeNode<TNode> treeNode)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            args.Next = treeNode;
            var sibblingsList = args.Current?.ChildNodes ?? args.RootNodes;
            nextStep = args.Opts.NextStepPredicate(args);
            var nxtStp = nextStep;

            if (!args.Stop)
            {
                FuncH.ExecuteFirstAction(nxtStp.Value switch
                {
                    DataTreeGeneratorStep.Next => () => nxtStp.Matches.ActIf(
                        () => AddToTreeNodesList<TData, TNode, TOpts, TArgs>(treeNode, sibblingsList)),
                    DataTreeGeneratorStep.Push => () =>
                    {
                        PushStack<TData, TNode, TOpts, TArgs>(args, treeNode, sibblingsList);
                        GetNodes<TData, TNode, TOpts, TArgs>(args);
                        TryPopStack<TData, TNode, TOpts, TArgs>(args);
                    },
                    DataTreeGeneratorStep.Pop => () => TryPopStack<TData, TNode, TOpts, TArgs>(args),
                    _ => () => { }
                });
            }
            else if (nxtStp.Matches)
            {
                AddToTreeNodesList<TData, TNode, TOpts, TArgs>(treeNode, sibblingsList);
            }

            return args.Stop;
        }

        private void PushStack<TData, TNode, TOpts, TArgs>(
            TArgs args,
            DataTreeNode<TNode> treeNode,
            List<DataTreeNode<TNode>> treeNodesList)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            AddToTreeNodesList<TData, TNode, TOpts, TArgs>(treeNode, treeNodesList);

            if (args.Current != null)
            {
                args.Stack.Push(args.Current);
            }
            
            args.Current = treeNode;
            args.Next = default;
        }

        private void AddToTreeNodesList<TData, TNode, TOpts, TArgs>(
            DataTreeNode<TNode> treeNode,
            List<DataTreeNode<TNode>> treeNodesList)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            treeNodesList.Add(treeNode ?? throw new ArgumentNullException(
                nameof(treeNode)));
        }

        private void TryPopStack<TData, TNode, TOpts, TArgs>(
            TArgs args)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            args.Next = args.Current;

            if (args.Stack.Any())
            {
                args.Current = args.Stack.Pop();
            }
            else
            {
                args.Current = default;
            }
        }
    }
}
