using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileManager
{
    public class FsManagerService : FileManagerCoreBase, IFsManagerService
    {
        protected readonly IFsManagerGuard fsManagerGuard;

        public FsManagerService(
            IFsManagerGuard fsManagerGuard)
        {
            this.fsManagerGuard = fsManagerGuard ?? throw new ArgumentNullException(
                nameof(fsManagerGuard));
        }

        public async Task<DriveEntryCore[]> ReadPrIdnfsAsync(
            string[] idnfsArr)
        {
            idnfsArr = ValidatePaths(idnfsArr, false);

            var retArr = idnfsArr.Select(idnf => new DriveEntryCore
            {
                Idnf = idnf,
                PrIdnf = Path.GetDirectoryName(idnf)
            }).ToArray();

            return retArr;
        }

        public async Task<DriveEntryCore[]> ReadNamesAsync(
            string[] idnfsArr)
        {
            idnfsArr = ValidatePaths(idnfsArr, false);

            var retArr = idnfsArr.Select(idnf => new DriveEntryCore
            {
                Idnf = idnf,
                Name = Path.GetFileName(idnf)
            }).ToArray();

            return retArr;
        }

        public async Task<DriveEntryCore[]> ReadFileSizesAsync(
            string[] idnfsArr)
        {
            idnfsArr = ValidatePaths(idnfsArr, false);

            var retArr = idnfsArr.Select(idnf => new DriveEntryCore
            {
                Idnf = idnf,
                FileSizeBytes = new FileInfo(idnf).Length
            }).ToArray();

            return retArr;
        }

        public async Task<DriveEntryCore[]> ReadTimeStampsAsync(
            string[] idnfsArr,
            bool returnMillis = false)
        {
            idnfsArr = ValidatePaths(idnfsArr, false);

            var retArr = idnfsArr.Select(idnf => new FileInfo(
                idnf).With(fileInfo => GetTimeStampsCore(
                    fileInfo.CreationTimeUtc,
                    fileInfo.LastWriteTimeUtc,
                    fileInfo.LastAccessTimeUtc,
                    returnMillis).ActWith(obj => obj.Idnf = idnf))).ToArray();

            return retArr;
        }

        public async Task<DriveEntry<string>[]> ReadFileTextContentsAsync(
            string[] idnfsArr)
        {
            idnfsArr = ValidatePaths(idnfsArr, false);

            var retArr = idnfsArr.Select(idnf => new DriveEntry<string>
            {
                Idnf = idnf,
                Content = File.ReadAllText(idnf)
            }).ToArray();

            return retArr;
        }

        public async Task ReadFileRawContentsAsync(
            DriveEntry<Func<Stream, Task>>[] entriesArr)
        {
            ValidatePaths(entriesArr.Select(item => item.Idnf!), false);

            foreach (var entry in entriesArr)
            {
                using var stream = File.Open(entry.Idnf!, FileMode.Open);
                await entry.Content(stream);
            }
        }

        public async Task<FilesAndFoldersTuple<string>> CopyEntriesAsync(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr,
            bool overWrite = false)
        {
            var tuple = ExtractPaths(
                foldersArr,
                filesArr,
                overWrite);

            var retTuple = new FilesAndFoldersTuple<string>
            {
                Folders = tuple.folderIdnfsArr.Select(
                    (folderIdnf, idx) => tuple.folderNewIdnfsArr[idx].ActWith(
                        folderNewIdnf => FsH.CopyDirectory(folderIdnf, folderNewIdnf))).ToList(),
                Files = tuple.fileIdnfsArr.Select(
                    (fileIdnf, idx) => tuple.fileNewIdnfsArr[idx].ActWith(
                        fileNewIdnf => File.Copy(fileIdnf, fileNewIdnf))).ToList(),
            };

            return retTuple;
        }

        public async Task RenameOrMoveEntriesAsync(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr,
            bool overWrite = false)
        {
            var tuple = ExtractPaths(
                foldersArr,
                filesArr,
                overWrite);

            tuple.folderIdnfsArr.ForEach((folderIdnf, idx, @break) =>
                FsH.MoveDirectory(
                    folderIdnf,
                    tuple.folderNewIdnfsArr[idx]));

            tuple.fileIdnfsArr.ForEach((fileIdnf, idx, @break) =>
                File.Move(
                    fileIdnf,
                    tuple.fileNewIdnfsArr[idx]));
        }

        public async Task DeleteEntriesAsync(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr)
        {
            var fileIdnfsArr = ValidatePaths(
                filesArr.Select(entry => entry.Idnf!), false, false);

            var folderIdnfsArr = ValidatePaths(
                foldersArr.Select(entry => entry.Idnf!), false, true);

            folderIdnfsArr.ForEach((folderIdnf, idx, @break) => Directory.Delete(folderIdnf, true));
            fileIdnfsArr.ForEach((fileIdnf, idx, @break) => File.Delete(fileIdnf));
        }

        public async Task<DriveEntryCore[]> WriteFileTextContentsAsync(
            DriveEntry<string>[] entriesArr,
            bool overWrite = false)
        {
            var idnfsArr = ExtractPaths(entriesArr, overWrite, false);
            idnfsArr.ForEach((idnf, idx, @break) => File.WriteAllText(idnf, entriesArr[idx].Content));

            var retArr = entriesArr.Select((entry, idx) => new DriveEntryCore
            {
                Name = entry.Name,
                Idnf = idnfsArr[idx],
                PrIdnf = entry.Idnf,
            }).ToArray();

            return retArr;
        }

        public async Task<DriveEntryCore[]> WriteFileRawContentsAsync(
            DriveEntry<Func<Stream, Task>>[] entriesArr,
            bool overWrite = false)
        {
            var idnfsArr = ExtractPaths(entriesArr, overWrite, false);

            for (int i = 0; i < entriesArr.Length; i++)
            {
                var entry = entriesArr[i];
                var idnf = idnfsArr[i];

                if (File.Exists(idnf))
                {
                    File.Delete(idnf);
                }

                using var stream = File.OpenWrite(idnf);
                await entriesArr[i].Content(stream);
            }

            var retArr = entriesArr.Select((entry, idx) => new DriveEntryCore
            {
                Name = entry.Name,
                Idnf = idnfsArr[idx],
                PrIdnf = entry.Idnf,
            }).ToArray();

            return retArr;
        }

        private string[] ValidatePaths(
            IEnumerable<string> pathsArr,
            bool allowsRootPath,
            bool? areFolders = null,
            long?[]? clientTimeStamps = null)
        {
            var retArr = new string[pathsArr.Count()];
            var areFoldersVal = areFolders ?? false;

            pathsArr.ForEach((path, idx, @break) =>
            {
                fsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(
                    path, allowsRootPath, out string rootedPath);

                retArr[idx] = rootedPath;

                if (clientTimeStamps != null)
                {
                    for (int i = 0; i < clientTimeStamps.Length; i++)
                    {
                        var clientTimeStamp = clientTimeStamps[i];

                        if (clientTimeStamp.HasValue)
                        {
                            ThrowIfClientTimeStampIsOutdated(
                                areFoldersVal ? new DirectoryInfo(path) : new FileInfo(path),
                                clientTimeStamp.Value);
                        }
                    }
                }
            });

            return retArr;
        }

        private void ThrowIfClientTimeStampIsOutdated(
            FileSystemInfo fsInfo,
            long clientTimeStamp) => fsInfo.CreationTimeUtc.Arr(
                fsInfo.LastWriteTimeUtc).Any(refTimeStamp => refTimeStamp.Ticks.TicksToMillis() >= clientTimeStamp).ActIf(
                () => throw new FileManagerException(
                    $"Entry {fsInfo.FullName} is newer than the client's version",
                    System.Net.HttpStatusCode.BadRequest,
                    FsManagerH.DRIVE_ITEM_OUTDATED_CLIENT_FETCH_TIMESTAMP_ERROR_CODE));

        private void ThrowIfPathAlreadyExists(string path) => (File.Exists(path) || Directory.Exists(path)).ActIf(
            () => throw new FileManagerException(
                $"Path {path} already exists", System.Net.HttpStatusCode.BadRequest));

        private OnBeforeCopyOrRenameOrMoveTuple ExtractPaths(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr,
            bool overWriteAllowed)
        {
            var fileTmStmpsArr = filesArr.Select(
                file => file.ClientFetchTimeUtcMillis).ToArray();

            var fileIdnfsArr = ValidatePaths(
                filesArr.Select(entry => entry.Idnf!), false, false, fileTmStmpsArr);

            var fileNewPrIdnfsArr = ValidatePaths(
                filesArr.Select(entry => entry.PrIdnf!), true);

            var fileNewIdnfsArr = fileNewPrIdnfsArr.Select(
                (fileNewPrIdnf, idx) => Path.Combine(fileNewPrIdnf, filesArr[idx].Name)).ToArray();

            var folderTmStmpsArr = foldersArr.Select(
                file => file.ClientFetchTimeUtcMillis).ToArray();

            var folderIdnfsArr = ValidatePaths(
                foldersArr.Select(entry => entry.Idnf!), false, true, folderTmStmpsArr);

            var folderNewPrIdnfsArr = ValidatePaths(
                foldersArr.Select(entry => entry.PrIdnf!), true);

            var folderNewIdnfsArr = folderNewPrIdnfsArr.Select(
                (folderNewPrIdnf, idx) => Path.Combine(folderNewPrIdnf, foldersArr[idx].Name)).ToArray();

            if (!overWriteAllowed)
            {
                new string[][] { fileNewIdnfsArr, folderNewIdnfsArr }.ForEach(
                    arr => arr.ForEach(idnf => ThrowIfPathAlreadyExists(idnf)));
            }
            else
            {
                for (int i = 0; i < fileNewIdnfsArr.Length; i++)
                {
                    var idnf = fileNewIdnfsArr[i];
                    var tmStmp = fileTmStmpsArr[i];

                    if (tmStmp.HasValue)
                    {
                        ThrowIfClientTimeStampIsOutdated(
                            new FileInfo(idnf), tmStmp.Value);
                    }
                }

                for (int i = 0; i < folderNewIdnfsArr.Length; i++)
                {
                    var idnf = folderNewIdnfsArr[i];
                    var tmStmp = folderTmStmpsArr[i];

                    if (tmStmp.HasValue)
                    {
                        ThrowIfClientTimeStampIsOutdated(
                            new FileInfo(idnf), tmStmp.Value);
                    }
                }
            }

            return new()
            {
                fileIdnfsArr = fileIdnfsArr,
                fileNewPrIdnfsArr = fileNewPrIdnfsArr,
                fileNewIdnfsArr = fileNewIdnfsArr,
                folderIdnfsArr = folderIdnfsArr,
                folderNewPrIdnfsArr = folderNewPrIdnfsArr,
                folderNewIdnfsArr = folderNewIdnfsArr
            };
        }

        private string[] ExtractPaths<TContent>(
            DriveEntry<TContent>[] entriesArr,
            bool overWrite,
            bool areFolders)
        {
            var idnfsArr = ValidatePaths(
                entriesArr.Select(
                    entry => entry.Idnf ?? Path.Combine(
                        entry.PrIdnf,
                        entry.Name)),
                false,
                areFolders,
                entriesArr.Select(entry => entry.ClientFetchTimeUtcMillis).ToArray());

            if (!overWrite)
            {
                idnfsArr.ForEach(ThrowIfPathAlreadyExists);
            }

            return idnfsArr;
        }

        private class OnBeforeCopyOrRenameOrMoveTuple
        {
            public string[] fileIdnfsArr { get; set; }
            public string[] fileNewPrIdnfsArr { get; set; }
            public string[] fileNewIdnfsArr { get; set; }
            public string[] folderIdnfsArr { get; set; }
            public string[] folderNewPrIdnfsArr { get; set; }
            public string[] folderNewIdnfsArr { get; set; }
        }
    }
}
