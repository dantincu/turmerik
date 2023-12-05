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
            var nextNodeRetriever = args.Opts.NextRootNodeRetriever;
            
            if (args.Parent != null)
            {
                nextNodeRetriever = (TArgs ag, out TNode node) => args.Parent.Data.NextChildNodeRetriever(
                    ag, args.Parent.Data, out node);
            }

            int idx = 0;
            bool hasNode = nextNodeRetriever(args, out var node);

            while (hasNode)
            {
                var treeNode = new DataTreeNode<TNode>(
                    node, args.Parent);

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
            args.Current = treeNode;
            var sibblingsList = args.Parent?.ChildNodes ?? args.RootNodes;
            nextStep = args.Opts.NextStepPredicate(args);
            var nxtStp = nextStep;

            if (!args.Stop)
            {
                FuncH.ExecuteFirstAction(nxtStp.Value switch
                {
                    DataTreeGeneratorStep.Next => () => nxtStp.Matches.ActIf(
                        () => sibblingsList.Add(treeNode)),
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
            treeNodesList.Add(treeNode);
            args.Stack.Push(treeNode);

            args.Parent = treeNode;
            args.Current = default;
        }

        private void TryPopStack<TData, TNode, TOpts, TArgs>(
            TArgs args)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            args.Current = args.Parent;

            if (args.Stack.Any())
            {
                args.Parent = args.Stack.Pop();
            }
            else
            {
                args.Parent = default;
                args.Stop = true;
            }
        }
    }
}
