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
        public static DataTreeNodeMtbl<RefTrgDriveFolderTuple> ToRefTrgDriveFolderTupleTreeNode(
            this DriveItem folder,
            string prIdnf,
            string relPath,
            bool isTarget = true)
        {
            var folderFiles = folder.FolderFiles.Select(
                file =>
                {
                    var retTuple = new RefTrgDriveItemsTuple(
                        isTarget ? null : file,
                        isTarget ? file : null,
                        isTarget ? null : file.Idnf,
                        isTarget ? file.Idnf : null,
                        Path.Combine(
                            relPath, file.Name),
                        true);

                    return retTuple;
                }).ToList();

            var childNodesList = folder.SubFolders.Select(
                subFolder => subFolder.ToRefTrgDriveFolderTupleTreeNode(
                    subFolder.Idnf,
                    Path.Combine(relPath, subFolder.Name))).ToList();

            var retTuple = new RefTrgDriveFolderTuple(
                folderFiles,
                isTarget ? null : prIdnf,
                isTarget ? prIdnf : null,
                folder.Name,
                relPath);

            var retNode = new DataTreeNodeMtbl<RefTrgDriveFolderTuple>(
                retTuple, null, childNodesList);

            return retNode;
        }

        public class PrintDiffOpts
        {
            public FilteredDriveEntriesSynchronizerOpts SyncOpts { get; set; }
            public DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffResult { get; set; }
            public bool? TreatAllAsDiff { get; set; }
            public int? RowsToPrint { get; set; }
            public int LeftToPrintFromChunk { get; set; }
            public bool? Interactive { get; set; }
        }
    }
}
