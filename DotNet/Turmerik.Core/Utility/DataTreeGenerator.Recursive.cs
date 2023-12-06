using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public class RecursiveDataTreeGenerator : DataTreeGeneratorBase
    {
        protected override void GetNodes<TData, TNode, TOpts, TArgs>(
            TArgs args,
            Stack<DataTreeNode<TNode>> stack)
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
                    args, ref nextStep,
                    treeNode, stack))
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
            DataTreeNode<TNode> treeNode,
            Stack<DataTreeNode<TNode>> stack)
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
                        TryPushStack<TData, TNode, TOpts, TArgs>(args, treeNode, sibblingsList, stack);
                        GetNodes<TData, TNode, TOpts, TArgs>(args, stack);
                        TryPopStack<TData, TNode, TOpts, TArgs>(args, stack);
                    }
                    ,
                    DataTreeGeneratorStep.Pop => () => TryPopStack<TData, TNode, TOpts, TArgs>(args, stack),
                    _ => () => { }
                });
            }
            else if (nxtStp.Matches)
            {
                AddToTreeNodesList<TData, TNode, TOpts, TArgs>(treeNode, sibblingsList);
            }

            return args.Stop;
        }
    }
}
