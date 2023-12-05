using System;
using System.Collections.Generic;
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
    }
}
