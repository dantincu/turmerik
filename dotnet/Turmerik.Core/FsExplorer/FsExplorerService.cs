using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using static System.Environment;

namespace Turmerik.Core.FsExplorer
{
    public class FsExplorerService : DriveExplorerServiceBase, IDriveExplorerService
    {
        public FsExplorerService(
            ITimeStampHelper timeStampHelper) : base(
                timeStampHelper)
        {
        }

        public async Task<TrmrkActionResult<DriveItem>> GetFolderAsync(string folderId)
        {
            var actionResult = ExecuteCore(
                () =>
                {
                    var entry = new DirectoryInfo(folderId);
                    var folder = GetDriveItem(entry);

                    var driveItemsArr = entry.EnumerateFileSystemInfos(
                        ).Select(GetDriveItem).ToArray();

                    folder.SubFolders = driveItemsArr.Where(
                        item => item.IsFolder == true).ToList();

                    folder.FolderFiles = driveItemsArr.Where(
                        item => item.IsFolder != true).ToList();

                    var result = new TrmrkActionResult<DriveItem>(
                        true, folder, null, null);

                    return result;
                });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> GetRootFolderAsync()
        {
            var actionResult = ExecuteCore(
                () =>
                {
                    var fsEntriesList = new List<DriveItem>();

                    var drives = DriveInfo.GetDrives(
                        ).Where(d => d.IsReady).Select(
                        d => new DriveItem
                        {
                            Id = d.Name,
                            Name = d.Name,
                            IsFolder = true,
                        });

                    string userHomePath = GetFolderPath(SpecialFolder.UserProfile);

                    var folders = new Dictionary<SpecialFolder, string>
                    {
                        { SpecialFolder.UserProfile, "User Home" },
                        { SpecialFolder.ApplicationData, "Application Data" },
                        { SpecialFolder.MyDocuments, "Documents" },
                        { SpecialFolder.MyPictures, "Pictures" },
                        { SpecialFolder.MyVideos, "Videos" },
                        { SpecialFolder.MyMusic, "Music" },
                        { SpecialFolder.Desktop, "Desktop" }
                    }.Select(
                        kvp =>
                        {
                            string path = GetFolderPath(kvp.Key);
                            string name = path;

                            if (name.StartsWith(userHomePath))
                            {
                                name = name.Substring(userHomePath.Length).TrimStart('/', '\\');
                                name = $"~{Path.DirectorySeparatorChar}{name}";
                            }

                            DirectoryInfo dirInfo = new DirectoryInfo(path);
                            var item = GetDriveItem(dirInfo);

                            item.Name = name;
                            return item;
                        });

                    fsEntriesList.AddRange(drives);
                    fsEntriesList.AddRange(folders);

                    var rootFolder = new DriveItem
                    {
                        Id = string.Empty,
                        Name = "This PC",
                        IsFolder = true,
                        IsRootFolder = true,
                        SubFolders = fsEntriesList
                    };

                    var result = new TrmrkActionResult<DriveItem>(
                        true, rootFolder);

                    return result;
                });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> CopyFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            var actionResult = ExecuteCore(() =>
            {
                string newPath = Path.Combine(newParentFolderId, newFileName);
                File.Copy(fileId, newPath);

                var newEntry = new FileInfo(newPath);
                var item = GetDriveItem(newEntry);

                var result = new TrmrkActionResult<DriveItem>(
                    true, item);

                return result;
            });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            var actionResult = ExecuteCore(() =>
            {
                string newPath = Path.Combine(newParentFolderId, newFolderName);
                FsH.CopyDirectory(folderId, newPath, true);

                var newEntry = new DirectoryInfo(newPath);
                var item = GetDriveItem(newEntry);

                var result = new TrmrkActionResult<DriveItem>(
                    true, item);

                return result;
            });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> CreateTextFileAsync(string parentFolderId, string newFileName, string text)
        {
            var actionResult = ExecuteCore(() =>
            {
                string newPath = Path.Combine(parentFolderId, newFileName);
                File.WriteAllText(newPath, text);

                var newEntry = new FileInfo(newPath);
                var item = GetDriveItem(newEntry);

                var result = new TrmrkActionResult<DriveItem>(
                    true, item);

                return result;
            });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> CreateOfficeLikeFileAsync(
            string parentFolderId,
            string newFileName,
            OfficeLikeFileType officeLikeFileType)
        {
            var actionResult = await ExecuteCoreAsync(async () =>
            {
                var result = await CreateTextFileAsync(parentFolderId, newFileName, string.Empty);
                return result;
            });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> CreateFolderAsync(string parentFolderId, string newFolderName)
        {
            var actionResult = ExecuteCore(() =>
            {
                string newPath = Path.Combine(parentFolderId, newFolderName);
                Directory.CreateDirectory(newPath);

                var newEntry = new DirectoryInfo(newPath);
                var item = GetDriveItem(newEntry);

                var result = new TrmrkActionResult<DriveItem>(
                    true, item);

                return result;
            });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> DeleteFileAsync(string fileId)
        {
            var actionResult = ExecuteCore(() =>
            {
                var fileInfo = new FileInfo(fileId);
                var driveItem = GetDriveItem(fileInfo);

                fileInfo.Delete();

                var result = new TrmrkActionResult<DriveItem>(
                    true, driveItem);

                return result;
            });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> DeleteFolderAsync(string folderId)
        {
            var actionResult = ExecuteCore(() =>
            {
                var dirInfo = new DirectoryInfo(folderId);
                var driveItem = GetDriveItem(dirInfo);

                dirInfo.Delete(true);

                var result = new TrmrkActionResult<DriveItem>(
                    true, driveItem);

                return result;
            });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> MoveFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            var actionResult = ExecuteCore(() =>
            {
                string newPath = Path.Combine(newParentFolderId, newFileName);
                File.Move(fileId, newPath);

                var newEntry = new FileInfo(newPath);
                var item = GetDriveItem(newEntry);

                var result = new TrmrkActionResult<DriveItem>(
                    true, item);

                return result;
            });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItem>> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            var actionResult = ExecuteCore(() =>
            {
                string newPath = Path.Combine(newParentFolderId, newFolderName);
                FsH.MoveDirectory(folderId, newPath, true);

                var newEntry = new DirectoryInfo(newPath);
                var item = GetDriveItem(newEntry);

                var result = new TrmrkActionResult<DriveItem>(
                    true, item);

                return result;
            });

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItemPutOp>> CreateMultipleFoldersAsync(
            string parentFolderId,
            List<Tuple<Func<string[], int, string, string>, string>> folderNameFactoriesList)
        {
            var factoriesList = folderNameFactoriesList.Select(
                tuple => new Tuple<Func<string[], int, string, string>, string, Action<string>>(
                    tuple.Item1, tuple.Item2, path => Directory.CreateDirectory(path))).ToList();

            var actionResult = await CreateMultipleEntriesAsync(
                parentFolderId, factoriesList);

            return actionResult;
        }

        public async Task<TrmrkActionResult<DriveItemPutOp>> CreateMultipleFilesAsync(
            string parentFolderId,
            List<Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>> fileNameFactoriesList)
        {
            var factoriesList = fileNameFactoriesList.Select(
                tuple => new Tuple<Func<string[], int, string, string>, string, Action<string>>(
                    tuple.Item1, tuple.Item2, path => File.WriteAllText(path, string.Empty))).ToList();

            var actionResult = await CreateMultipleEntriesAsync(
                parentFolderId, factoriesList);

            return actionResult;
        }

        protected override HttpStatusCode? GetHttpStatusCode(Exception exc)
        {
            var httpStatusCode = base.GetHttpStatusCode(exc);

            if (exc is SecurityException)
            {
                httpStatusCode = HttpStatusCode.NotFound;
            }

            return httpStatusCode;
        }

        private DriveItem GetDriveItem(FileSystemInfo fsInfo)
        {
            var fsItemMtbl = new DriveItem
            {
                Id = fsInfo.FullName,
                Name = fsInfo.Name,
                CreationTimeStr = TimeStampHelper.TmStmp(fsInfo.CreationTime, true, TimeStamp.Seconds),
                LastAccessTimeStr = TimeStampHelper.TmStmp(fsInfo.LastAccessTime, true, TimeStamp.Seconds),
                LastWriteTimeStr = TimeStampHelper.TmStmp(fsInfo.LastWriteTime, true, TimeStamp.Seconds)
            };

            var dirInfo = fsInfo as DirectoryInfo;

            if (dirInfo != null)
            {
                fsItemMtbl.IsFolder = true;
            }

            return fsItemMtbl;
        }

        private async Task<TrmrkActionResult<DriveItemPutOp>> CreateMultipleEntriesAsync(
            string parentFolderId,
            List<Tuple<Func<string[], int, string, string>, string, Action<string>>> fileNameFactoriesList)
        {
            var actionResult = await ExecuteCoreAsync(async () =>
            {
                var factoriesList = fileNameFactoriesList.Select(
                    tuple => new Tuple<Func<string[], int, string, string>, string, Func<string, int, Task<DriveItemPutOp>>>(
                        tuple.Item1, tuple.Item2, async (name, idx) =>
                        {
                            string path = Path.Combine(parentFolderId, name);
                            tuple.Item3(path);

                            DateTime now = DateTime.Now;
                            string nowStr = TimeStampHelper.TmStmp(now, true, TimeStamp.Seconds);

                            return new DriveItemPutOp
                            {
                                Id = path,
                                Name = name,
                                FileNameExtension = Path.GetExtension(name),
                                CreationTimeStr = nowStr,
                                LastAccessTimeStr = nowStr,
                                LastWriteTimeStr = nowStr
                            };
                        })).ToList();

                var parentDirInfo = new DirectoryInfo(parentFolderId);

                var existingEntriesArr = parentDirInfo.EnumerateFileSystemInfos()
                    .Select(ent => ent.Name).ToArray();

                var result = await base.CreateMultipleEntriesAsync(
                    existingEntriesArr,
                    factoriesList);

                return new TrmrkActionResult<DriveItemPutOp>(true, result);
            },
            exc => DefaultExceptionHandler(exc).WithHelper(
                result => new TrmrkActionResult<DriveItemPutOp>(
                    false, null, result.ErrorViewModel, result.HttpStatusCode)));

            return actionResult;
        }
    }
}
