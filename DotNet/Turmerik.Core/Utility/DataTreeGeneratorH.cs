using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.Utility
{
    public static class DataTreeGeneratorH
    {
        public static DataTreeGeneratorStepData ToData(
            this DataTreeGeneratorStep step,
            bool matches = false) => new DataTreeGeneratorStepData(
                matches, step);

        public static List<TData> GetHcyStack<TData>(
            this DataTreeNode<TData> dataTreeNode)
        {
            var stackList = new List<TData>();

            while (dataTreeNode != null)
            {
                stackList.Insert(0, dataTreeNode.Data);
                dataTreeNode = dataTreeNode.ParentNode;
            }

            return stackList;
        }

        public static Func<TArgs, TNode, bool> OnChildNodesIterated<TData, TNode, TOpts, TArgs>()
            where TNode : DataTreeGeneratorNode<TData, TNode, TOpts, TArgs>
            where TOpts : DataTreeGeneratorOpts<TData, TNode, TOpts, TArgs>
            where TArgs : DataTreeGeneratorArgs<TData, TNode, TOpts, TArgs> => (
                args, node) => node.OnlyMatchesIfHasChildren != true || args.Current.ChildNodes.Any();
    }
}
