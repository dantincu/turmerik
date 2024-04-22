using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public static class FilteredDriveEntriesSynchronizerH
    {
        public static DataTreeNodeMtbl<RefTrgDriveItemsTuple> RefFolderToDriveItemsTupleTreeNode(
            DriveItem refFolder,
            string relPath) => new DataTreeNodeMtbl<RefTrgDriveItemsTuple>(
                new RefTrgDriveItemsTuple(new DriveItem(refFolder, 1), null, relPath), null,
                    refFolder.SubFolders.Select(
                        refSubFolder => RefFolderToDriveItemsTupleTreeNode(
                            refSubFolder, Path.Combine(
                                relPath, refSubFolder.Name))).ToList());

        public static DataTreeNodeMtbl<RefTrgDriveItemsTuple> TrgFolderToDriveItemsTupleTreeNode(
            DriveItem trgFolder,
            string relPath) => new DataTreeNodeMtbl<RefTrgDriveItemsTuple>(
                new RefTrgDriveItemsTuple(null, new DriveItem(trgFolder, 1), relPath), null,
                    trgFolder.SubFolders.Select(
                        trgSubFolder => TrgFolderToDriveItemsTupleTreeNode(
                            trgSubFolder, Path.Combine(
                                relPath, trgSubFolder.Name))).ToList());

        public static DataTreeNodeMtbl<RefTrgDriveFolderTuple> RefFolderToDriveFolderTupleTreeNode(
            DriveItem refFolder,
            string relPath) => new DataTreeNodeMtbl<RefTrgDriveFolderTuple>(
                new RefTrgDriveFolderTuple(refFolder.FolderFiles.Select(
                    refFile => new RefTrgDriveItemsTuple(
                        refFile, null, Path.Combine(
                            relPath, refFile.Name))).ToList(),
                    refFolder.Name, relPath), null, refFolder.SubFolders.Select(
                        refSubFolder => RefFolderToDriveFolderTupleTreeNode(
                            refSubFolder, Path.Combine(
                                relPath, refSubFolder.Name))).ToList());

        public static DataTreeNodeMtbl<RefTrgDriveFolderTuple> TrgFolderToDriveFolderTupleTreeNode(
            DriveItem trgFolder,
            string relPath) => new DataTreeNodeMtbl<RefTrgDriveFolderTuple>(
                new RefTrgDriveFolderTuple(trgFolder.FolderFiles.Select(
                    trgFile => new RefTrgDriveItemsTuple(
                        null, trgFile, Path.Combine(
                            relPath, trgFile.Name))).ToList(),
                    trgFolder.Name, relPath), null, trgFolder.SubFolders.Select(
                        refSubFolder => TrgFolderToDriveFolderTupleTreeNode(
                            refSubFolder, Path.Combine(
                                relPath, refSubFolder.Name))).ToList());

        public class PrintDiffOpts
        {
            public FilteredDriveEntriesSynchronizerOpts SyncOpts { get; set; }
            public DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffResult { get; set; }
            public int? RowsToPrint { get; set; }
            public int LeftToPrintFromChunk { get; set; }
        }
    }
}
