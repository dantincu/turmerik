using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.FileManager
{
    public interface IFileManagerServiceCore
    {
        Task<DriveEntryCore[]> ReadPathIdnfsAsync(
            DriveEntryCore[] itemsArr);

        Task<DriveEntryCore[]> ReadPrIdnfsAsync(
            string[] idnfsArr);

        Task<DriveEntryCore[][]> ReadSubFolderIdnfsAsync(
            string[] idnfsArr);

        Task<DriveEntryCore[][]> ReadFolderFileIdnfsAsync(
            string[] idnfsArr);

        Task<DriveEntryX<DriveEntryCore>[]> ReadFolderChildIdnfsAsync(
            string[] idnfsArr);

        Task<DriveEntryCore[]> ReadNamesAsync(
            string[] idnfsArr);

        Task<DriveEntryCore[]> ReadFileSizesAsync(
            string[] idnfsArr);

        Task<DriveEntryCore[]> ReadTimeStampsAsync(
            string[] idnfsArr,
            bool returnMillis = false);

        Task<DriveEntry<string>[]> ReadFileTextContentsAsync(
            string[] idnfsArr);

        Task<FilesAndFoldersTuple<string>> CopyEntriesAsync(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr,
            bool overWrite = false);

        Task RenameOrMoveEntriesAsync(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr,
            bool overWrite = false);

        Task DeleteEntriesAsync(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr);

        Task<DriveEntryCore[]> WriteFileTextContentsAsync(
            DriveEntry<string>[] entriesArr,
            bool overWrite = false);
    }
}
