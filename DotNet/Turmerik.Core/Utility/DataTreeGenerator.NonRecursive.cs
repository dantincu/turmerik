using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public class NonRecursiveDataTreeGenerator : DataTreeGeneratorBase
    {
        protected override void GetNodes<TData, TNode, TOpts, TArgs>(
            TArgs args)
        {
            var stack = new Stack<StackData<TData, TNode, TOpts, TArgs>>();
            DataTreeGeneratorStepData nextStep = default;
            var nextNodeRetriever = args.Opts.NextRootNodeRetrieverFactory(args);

            var stackData = new StackData<TData, TNode, TOpts, TArgs>(
                nextNodeRetriever);

            DataTreeNode<TNode> treeNode;
            bool hasNode;

            var sibblingsList = args.RootNodes;
            while (!args.Stop && stackData != null)
            {
                hasNode = nextNodeRetriever(args, out var node);

                if (hasNode)
                {
                    treeNode = new DataTreeNode<TNode>(
                        node, args.Current);

                    args.Next = treeNode;
                    args.Idx = ++stackData.CurrentChildIdx;

                    nextStep = args.Opts.NextStepPredicate(args);

                    switch (nextStep.Value)
                    {
                        case DataTreeGeneratorStep.Next:
                            AddToTreeNodesList<TData, TNode, TOpts, TArgs>(
                                treeNode, sibblingsList);
                            break;
                        case DataTreeGeneratorStep.Push:
                            TryPushStack(args,
                                treeNode, stack,
                                ref stackData,
                                ref nextNodeRetriever,
                                ref sibblingsList);
                            break;
                        case DataTreeGeneratorStep.Pop:
                            TryPopStack(args, stack,
                                ref stackData,
                                ref nextNodeRetriever,
                                ref sibblingsList);
                            break;
                    }
                }
                else
                {
                    TryPopStack(args, stack,
                        ref stackData,
                        ref nextNodeRetriever,
                        ref sibblingsList);
                }
            }
        }

        private void TryPushStack<TData, TNode, TOpts, TArgs>(
            TArgs args,
            DataTreeNode<TNode> treeNode,
            Stack<StackData<TData, TNode, TOpts, TArgs>> stack,
            ref StackData<TData, TNode, TOpts, TArgs> stackData,
            ref TryRetrieve1In1Out<TArgs, TNode> nextNodeRetriever,
            ref List<DataTreeNode<TNode>> sibblingsList)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            TryPushStack<TData, TNode, TOpts, TArgs>(
                args, treeNode, ref sibblingsList);

            stack.Push(stackData);
            nextNodeRetriever = treeNode.Data.NextChildNodeRetrieverFactory(args);
            stackData = new StackData<TData, TNode, TOpts, TArgs>(nextNodeRetriever);
        }

        private void TryPopStack<TData, TNode, TOpts, TArgs>(
            TArgs args,
            Stack<StackData<TData, TNode, TOpts, TArgs>> stack,
            ref StackData<TData, TNode, TOpts, TArgs> stackData,
            ref TryRetrieve1In1Out<TArgs, TNode> nextNodeRetriever,
            ref List<DataTreeNode<TNode>> sibblingsList)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            TryPopStack<TData, TNode, TOpts, TArgs>(args, ref sibblingsList);

            if (stack.Any())
            {
                stackData = stack.Pop();
                nextNodeRetriever = stackData.NextChildRetriever;
            }
            else
            {
                stackData = null;
                nextNodeRetriever = null;
            }
        }

        protected void GetNodes1<TData, TNode, TOpts, TArgs>(
            TArgs args)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            throw new NotImplementedException();
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
                    args, ref nextStep,
                    treeNode))
                {
                    break;
                }

                idx++;
                args.Idx = idx;
                hasNode = nextNodeRetriever(args, out node);
            }
        }

        private bool GetNodes<TData, TNode, TOpts, TArgs>(
            TArgs args,
            ref DataTreeGeneratorStepData nextStep,
            DataTreeNode<TNode> treeNode)
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            throw new NotImplementedException();
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
                        TryPushStack<TData, TNode, TOpts, TArgs>(args, treeNode, ref sibblingsList);
                        GetNodes<TData, TNode, TOpts, TArgs>(args);
                        TryPopStack<TData, TNode, TOpts, TArgs>(args, ref sibblingsList);
                    }
                    ,
                    DataTreeGeneratorStep.Pop => () => TryPopStack<TData, TNode, TOpts, TArgs>(args, ref sibblingsList),
                    _ => () => { }
                });
            }
            else if (nxtStp.Matches)
            {
                AddToTreeNodesList<TData, TNode, TOpts, TArgs>(treeNode, sibblingsList);
            }

            return args.Stop;
        }

        private class StackData<TData, TNode, TOpts, TArgs>
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs>
        {
            public StackData(
                TryRetrieve1In1Out<TArgs, TNode> nextChildRetriever,
                int currentChildIdx = -1)
            {
                NextChildRetriever = nextChildRetriever ?? throw new ArgumentNullException(
                    nameof(nextChildRetriever));

                CurrentChildIdx = currentChildIdx;
            }

            public TryRetrieve1In1Out<TArgs, TNode> NextChildRetriever { get; }
            public int CurrentChildIdx { get; set; }
        }
    }
}
