using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IFilteredDriveEntriesNodesRetriever
    {
        DataTreeNodeMtbl<RefTrgDriveFolderTuple> Intersect(
            DataTreeNodeMtbl<FilteredDriveEntries> @ref,
            DataTreeNodeMtbl<FilteredDriveEntries> trg,
            string relPath);

        DataTreeNodeMtbl<RefTrgDriveFolderTuple> Intersect(
            DriveItem refItem,
            DriveItem trgItem,
            string relPath);

        DriveItem Extract(
            DataTreeNodeMtbl<FilteredDriveEntries> @ref,
            DataTreeNodeMtbl<FilteredDriveEntries> trg);

        DriveItem Extract(
            DriveItem refItem,
            DriveItem trgItem);

        DataTreeNodeMtbl<RefTrgDriveFolderTuple> Diff(
            DataTreeNodeMtbl<FilteredDriveEntries> @ref,
            DataTreeNodeMtbl<FilteredDriveEntries> trg,
            string relPath,
            bool? quickDiff = null);

        DataTreeNodeMtbl<RefTrgDriveFolderTuple> Diff(
            DriveItem refItem,
            DriveItem trgItem,
            string relPath,
            bool? quickDiff = null);

        bool HasDiff(
            DriveItem refItem,
            DriveItem trgItem,
            bool? quickDiff = null);
    }

    public class FilteredDriveEntriesNodesRetriever : IFilteredDriveEntriesNodesRetriever
    {
        public DataTreeNodeMtbl<RefTrgDriveFolderTuple> Intersect(
            DataTreeNodeMtbl<FilteredDriveEntries> @ref,
            DataTreeNodeMtbl<FilteredDriveEntries> trg,
            string relPath)
        {
            var refItem = @ref.ExtractItems();
            var trgItem = trg.ExtractItems();

            var retNode = Intersect(refItem, trgItem, relPath);
            return retNode;
        }

        public DataTreeNodeMtbl<RefTrgDriveFolderTuple> Intersect(
            DriveItem refItem,
            DriveItem trgItem,
            string relPath)
        {
            var filesList = trgItem.FolderFiles.Select(
                trgFile => Tuple.Create(
                    refItem.FolderFiles.SingleOrDefault(
                        refFile => refFile.Name == trgFile.Name),
                    trgFile)).Where(
                tuple => tuple.Item2 != null).Select(
                tuple => new RefTrgDriveItemsTuple(
                    tuple.Item1, tuple.Item2,
                    tuple.Item1.Idnf,
                    tuple.Item2.Idnf,
                    Path.Combine(
                        relPath, tuple.Item2.Name),
                    HasDiff(
                        tuple.Item1,
                        tuple.Item2))).ToList();

            var childNodes = trgItem.SubFolders.Select(
                trgFolder => Tuple.Create(refItem.SubFolders.SingleOrDefault(
                    refFolder => refFolder.Name == trgFolder.Name), trgFolder)).Where(
                tuple => tuple.Item1 != null).Select(
                tuple => Intersect(
                    tuple.Item1, tuple.Item2, Path.Combine(
                        relPath, tuple.Item2.Name))).ToList();

            var retNode = new DataTreeNodeMtbl<RefTrgDriveFolderTuple>(
                new RefTrgDriveFolderTuple(filesList,
                    refItem.Idnf,
                    trgItem.Idnf,
                    trgItem.Name, relPath),
                    null, childNodes);

            return retNode;
        }

        public DriveItem Extract(
            DataTreeNodeMtbl<FilteredDriveEntries> @ref,
            DataTreeNodeMtbl<FilteredDriveEntries> trg)
        {
            var refItem = @ref.ExtractItems();
            var trgItem = trg.ExtractItems();

            var retNode = Extract(refItem, trgItem);
            return retNode;
        }

        public DriveItem Extract(
            DriveItem refItem,
            DriveItem trgItem)
        {
            var trgFilteredItem = new DriveItem(trgItem)
            {
                FolderFiles = trgItem.FolderFiles.Where(
                    trgFile => refItem.FolderFiles!.None(
                        refFile => refFile.Name == trgFile.Name)).ToList(),
                SubFolders = trgItem.SubFolders.Select(
                    trgFolder => Tuple.Create(refItem.SubFolders.SingleOrDefault(
                        refFolder => trgFolder.Name == refFolder.Name), trgFolder)).Select(
                    tuple => tuple.Item1 != null ? Extract(
                        tuple.Item1, tuple.Item2) : tuple.Item2).ToList()
            };

            return trgFilteredItem;
        }

        public DataTreeNodeMtbl<RefTrgDriveFolderTuple> Diff(
            DataTreeNodeMtbl<FilteredDriveEntries> @ref,
            DataTreeNodeMtbl<FilteredDriveEntries> trg,
            string relPath,
            bool? quickDiff = null)
        {
            var refItem = @ref.ExtractItems();
            var trgItem = trg.ExtractItems();

            var retNode = Diff(
                refItem,
                trgItem,
                relPath,
                quickDiff);

            return retNode;
        }

        public DataTreeNodeMtbl<RefTrgDriveFolderTuple> Diff(
            DriveItem refItem,
            DriveItem trgItem,
            string relPath,
            bool? quickDiff = null)
        {
            var filesList = trgItem.FolderFiles.Select(
                trgFile => Tuple.Create(
                    refItem.FolderFiles.SingleOrDefault(
                        refFile => refFile.Name == trgFile.Name),
                    trgFile)).Select(
                tuple => new RefTrgDriveItemsTuple(
                    tuple.Item1,
                    tuple.Item2,
                    refItem.Idnf,
                    trgItem.Idnf,
                    Path.Combine(
                        relPath, tuple.Item2.Name),
                    tuple.Item1 != null ? HasDiff(
                        tuple.Item1,
                        tuple.Item2,
                        quickDiff) : true)).ToList();

            filesList.AddRange(refItem.FolderFiles.Where(
                refFile => trgItem.FolderFiles.FindByName(
                    refFile.Name) == null).Select(
                refFile => new RefTrgDriveItemsTuple(
                    refFile, null, refItem.Idnf, null, Path.Combine(
                        relPath, refFile.Name), true)));

            filesList.Sort((a, b) => a.Name.CompareTo(b.Name));

            var childNodes = trgItem.SubFolders.Select(
                trgFolder => Tuple.Create(refItem.SubFolders.SingleOrDefault(
                    refFolder => refFolder.Name == trgFolder.Name), trgFolder)).Select(
                tuple =>
                {
                    DataTreeNodeMtbl<RefTrgDriveFolderTuple> retNode;

                    if (tuple.Item1 != null)
                    {
                        retNode = Diff(
                            tuple.Item1,
                            tuple.Item2,
                            Path.Combine(
                                relPath,
                                tuple.Item2.Name));
                    }
                    else
                    {
                        retNode = tuple.Item2.ToRefTrgDriveFolderTupleTreeNode(
                            Path.Combine(
                                relPath,
                                tuple.Item2.Name));
                    }

                    return retNode;
                }).ToList();

            childNodes.AddRange(refItem.SubFolders.Where(
                refFolder => trgItem.SubFolders.FindByName(
                    refFolder.Name) == null).Select(
                refFolder => refFolder.ToRefTrgDriveFolderTupleTreeNode(
                    Path.Combine(relPath, refFolder.Name), false)));

            childNodes.Sort((a, b) => a.Data.Name.CompareTo(b.Data.Name));

            var retNode = new DataTreeNodeMtbl<RefTrgDriveFolderTuple>(
                new RefTrgDriveFolderTuple(filesList,
                    refItem.Idnf,
                    trgItem.Idnf,
                    trgItem.Name, relPath),
                null, childNodes);

            return retNode;
        }

        public bool HasDiff(
            DriveItem refItem,
            DriveItem trgItem,
            bool? quickDiff = null)
        {
            bool isDiff;

            if (quickDiff == true)
            {
                isDiff = refItem.LastWriteTimeUtcTicks != trgItem.LastWriteTimeUtcTicks;
                isDiff = isDiff || refItem.FileSizeBytes != trgItem.FileSizeBytes;
            }
            else
            {
                isDiff = refItem.TextFileContents != trgItem.TextFileContents;
            }

            return isDiff;
        }
    }
}
