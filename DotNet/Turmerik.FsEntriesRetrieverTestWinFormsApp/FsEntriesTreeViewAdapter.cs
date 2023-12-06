using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Utility;

namespace Turmerik.FsEntriesRetrieverTestWinFormsApp
{
    public class FsEntriesTreeViewAdapter
    {
        public void AddTreeViewNodes(
            TreeView treeView,
            List<DataTreeNode<FsEntriesRetrieverNode>> nodesHcy)
        {
            AddTreeViewNodes(treeView.Nodes, nodesHcy);
        }

        private void AddTreeViewNodes(
            TreeNodeCollection nodesCollection,
            List<DataTreeNode<FsEntriesRetrieverNode>> nodesHcy)
        {
            foreach (var dataNode in nodesHcy)
            {
                var data = dataNode.Data.Value;
                var treeNode = new TreeNode(data.Name);

                nodesCollection.Add(treeNode);

                if (data.IsFolder == true)
                {
                    AddTreeViewNodes(
                        treeNode.Nodes,
                        dataNode.ChildNodes);
                }
            }
        }
    }
}
