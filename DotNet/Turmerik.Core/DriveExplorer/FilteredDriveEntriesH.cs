using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public static class FilteredDriveEntriesH
    {
        public static void AssertTreeNodeIsValid(
            DataTreeNodeMtbl<FilteredDriveEntries> treeNode,
            int depth = 0,
            Action<DataTreeNodeMtbl<FilteredDriveEntries>> mainAssertAction = null,
            Action<DataTreeNodeMtbl<FilteredDriveEntries>, string, string> namesAssertAction = null)
        {
            mainAssertAction ??= retNode =>
            {
                if (retNode.ChildNodes.Count != retNode.Data.FilteredSubFolders.Count)
                {
                    throw new InvalidOperationException(string.Join(" ",
                        $"Filtered sub folders count {retNode.Data.FilteredSubFolders.Count}",
                        $"is different than children count {retNode.ChildNodes.Count}",
                        $"for parent folder identifier {retNode.Data.PrFolderIdnf}"));
                }
            };

            namesAssertAction ??= (retNode, childNodeName, filteredFolderName) =>
            {
                if (childNodeName != filteredFolderName)
                {
                    throw new InvalidOperationException(string.Join(" ",
                        $"Child node name \"{childNodeName}\" should be equal to",
                        $"filtered folder name {filteredFolderName}",
                        $"for parent folder identifier {retNode.Data.PrFolderIdnf}"));
                }
            };

            mainAssertAction(treeNode);

            if (depth > 0)
            {
                for (int i = 0; i < treeNode.ChildNodes.Count; i++)
                {
                    var childNode = treeNode.ChildNodes[i];
                    var subFolder = treeNode.Data.FilteredSubFolders[i];

                    namesAssertAction(
                        childNode,
                        childNode.Data.PrFolderName,
                        subFolder.Name);

                    AssertTreeNodeIsValid(
                        childNode,
                        depth - 1,
                        mainAssertAction,
                        namesAssertAction);
                }
            }
        }
    }
}
