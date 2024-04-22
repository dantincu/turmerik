using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
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

        public static DriveItem ExtractItemsCore<TNode, TChildNodes>(
            TNode rootNode,
            bool extractFiltered = true)
            where TNode : IDataTreeNode<FilteredDriveEntries, TNode, TChildNodes>
            where TChildNodes : IEnumerable<TNode>
        {
            var retNode = new DriveItem
            {
                Idnf = rootNode.Data.PrFolderIdnf,
                Name = rootNode.Data.PrFolderName,
                FolderFiles = GetFolderFilesList<TNode, TChildNodes>(rootNode, extractFiltered),
                SubFolders = rootNode.ChildNodes.Select(
                    childNode => ExtractItemsCore<TNode, TChildNodes>(childNode, extractFiltered)).ToList()
            };

            return retNode;
        }

        public static DriveItem ExtractItems(
            this DataTreeNodeMtbl<FilteredDriveEntries> rootNode,
            bool extractFiltered = true) => ExtractItemsCore<DataTreeNodeMtbl<FilteredDriveEntries>, List<DataTreeNodeMtbl<FilteredDriveEntries>>>(
                rootNode, extractFiltered);

        public static DriveItem ExtractItems(
            this DataTreeNodeImmtbl<FilteredDriveEntries> rootNode,
            bool extractFiltered = true) => ExtractItemsCore<DataTreeNodeImmtbl<FilteredDriveEntries>, ReadOnlyCollection<DataTreeNodeImmtbl<FilteredDriveEntries>>>(
                rootNode, extractFiltered);

        public static List<DriveItem> ExtractItems(
            this List<DataTreeNodeMtbl<FilteredDriveEntries>> rootNodesList,
            bool extractFiltered = true) => rootNodesList.Select(
                rootNode => ExtractItems(rootNode, extractFiltered)).ToList();

        public static ReadOnlyCollection<DriveItem> ExtractItems(
            this ReadOnlyCollection<DataTreeNodeImmtbl<FilteredDriveEntries>> rootNodesList,
            bool extractFiltered = true) => rootNodesList.Select(
                rootNode => ExtractItems(rootNode, extractFiltered)).RdnlC();

        public static List<DriveItem> GetFolderFilesList<TNode, TChildNodes>(
            TNode rootNode,
            bool extractFiltered = true)
            where TNode : IDataTreeNode<FilteredDriveEntries, TNode, TChildNodes>
            where TChildNodes : IEnumerable<TNode> => extractFiltered ? rootNode.Data.FilteredFolderFiles : rootNode.Data.AllFolderFiles;

        public static List<DriveItem> GetSubFoldersList<TNode, TChildNodes>(
            TNode rootNode,
            bool extractFiltered = true)
            where TNode : IDataTreeNode<FilteredDriveEntries, TNode, TChildNodes>
            where TChildNodes : IEnumerable<TNode> => extractFiltered ? rootNode.Data.FilteredSubFolders : rootNode.Data.AllSubFolders;
    }
}
