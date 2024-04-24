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
        public static DataTreeNodeMtbl<RefTrgDriveFolderTuple> ToRefTrgDriveFolderTuple(
            this DriveItem folder,
            string prIdnf,
            string relPath,
            bool isTarget = true) => new DataTreeNodeMtbl<RefTrgDriveFolderTuple>(
                new RefTrgDriveFolderTuple(folder.FolderFiles.Select(
                    file => new RefTrgDriveItemsTuple(
                        isTarget ? null : folder,
                        isTarget ? folder : null,
                        isTarget ? null : folder.Idnf,
                        isTarget ? folder.Idnf : null,
                        Path.Combine(
                            relPath, folder.Name),
                        true)).ToList(),
                    isTarget ? null : prIdnf,
                    isTarget ? prIdnf : null,
                    folder.Name,
                    relPath));

        public class PrintDiffOpts
        {
            public FilteredDriveEntriesSynchronizerOpts SyncOpts { get; set; }
            public DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffResult { get; set; }
            public bool? TreatAllAsDiff { get; set; }
            public int? RowsToPrint { get; set; }
            public int LeftToPrintFromChunk { get; set; }
        }
    }
}
