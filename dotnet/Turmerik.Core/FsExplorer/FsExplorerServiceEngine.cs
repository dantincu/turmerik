using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using static System.Environment;

namespace Turmerik.Core.FsExplorer
{
    public class FsExplorerServiceEngine : IDriveExplorerServiceEngine
    {
        private static readonly ReadOnlyDictionary<OfficeLikeFileType, ReadOnlyCollection<string>> officeLikeFileTypesFileNameExtensions;

        static FsExplorerServiceEngine()
        {
            officeLikeFileTypesFileNameExtensions = new Dictionary<OfficeLikeFileType, ReadOnlyCollection<string>>
            {
                { OfficeLikeFileType.Docs, new string[] { ".docx", ".doc" }.RdnlC() },
                { OfficeLikeFileType.Sheets, new string[] { ".xlsx", ".xls" }.RdnlC() },
                { OfficeLikeFileType.Slides, new string[] { ".pptx" , ".ppt" }.RdnlC() },
            }.RdnlD();
        }

        public FsExplorerServiceEngine(
            ITimeStampHelper timeStampHelper)
        {
            this.TimeStampHelper = timeStampHelper ?? throw new ArgumentNullException(nameof(timeStampHelper));
        }

        private ITimeStampHelper TimeStampHelper { get; }

        public async Task<DriveItem> CopyFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            string newPath = Path.Combine(newParentFolderId, newFileName);
            File.Copy(fileId, newPath);

            var newEntry = new FileInfo(newPath);
            var item = GetDriveItem(newEntry);

            return item;
        }

        public async Task<DriveItem> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            string newPath = Path.Combine(newParentFolderId, newFolderName);
            FsH.CopyDirectory(folderId, newPath);

            var newEntry = new DirectoryInfo(newPath);
            var item = GetDriveItem(newEntry);

            return item;
        }

        public async Task<DriveItem> CreateFolderAsync(string parentFolderId, string newFolderName)
        {
            string newPath = Path.Combine(parentFolderId, newFolderName);
            Directory.CreateDirectory(newPath);

            var newEntry = new DirectoryInfo(newPath);
            var item = GetDriveItem(newEntry);

            return item;
        }

        public async Task<DriveItem> CreateOfficeLikeFileAsync(string parentFolderId, string newFileName, OfficeLikeFileType officeLikeFileType)
        {
            var result = await CreateTextFileAsync(parentFolderId, newFileName, string.Empty);
            return result;
        }

        public async Task<DriveItem> CreateTextFileAsync(string parentFolderId, string newFileName, string text)
        {
            string newPath = Path.Combine(parentFolderId, newFileName);
            File.WriteAllText(newPath, text);

            var newEntry = new FileInfo(newPath);
            var item = GetDriveItem(newEntry);

            return item;
        }

        public async Task<DriveItem> DeleteFileAsync(string fileId)
        {
            var fileInfo = new FileInfo(fileId);
            var driveItem = GetDriveItem(fileInfo);

            fileInfo.Delete();
            return driveItem;
        }

        public async Task<DriveItem> DeleteFolderAsync(string folderId)
        {
            var dirInfo = new DirectoryInfo(folderId);
            var driveItem = GetDriveItem(dirInfo);

            dirInfo.Delete(true);
            return driveItem;
        }

        public string GetDriveFileUrl(string fileId)
        {
            string fileUrl = this.GetDriveItemUrl(fileId);
            return fileUrl;
        }

        public string GetDriveFolderUrl(string folderId)
        {
            string folderUrl = this.GetDriveItemUrl(folderId);
            return folderUrl;
        }

        public string GetRootDriveFolderUrl()
        {
            return string.Empty;
        }

        public async Task<DriveItem> GetFolderAsync(string folderId)
        {
            var entry = new DirectoryInfo(folderId);
            var folder = GetDriveItem(entry);

            folder.ParentFolderId = Path.GetDirectoryName(entry.FullName);

            var driveItemsArr = entry.EnumerateFileSystemInfos(
                ).Select(GetDriveItem).ToArray();

            folder.SubFolders = driveItemsArr.Where(
                item => item.IsFolder == true).ToList();

            folder.FolderFiles = driveItemsArr.Where(
                item => item.IsFolder != true).ToList();

            return folder;
        }

        public async Task<DriveItem> GetRootFolderAsync()
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
                SubFolders = fsEntriesList,
                FolderFiles = new List<DriveItem>()
            };

            return rootFolder;
        }

        public async Task<DriveItem> GetTextFileAsync(string fileId)
        {
            var entry = new FileInfo(fileId);
            var fileItem = GetDriveItem(entry);

            fileItem.ParentFolderId = Path.GetDirectoryName(entry.FullName);
            fileItem.TextFileContent = File.ReadAllText(fileId);

            return fileItem;
        }

        public async Task<DriveItem> MoveFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            string newPath = Path.Combine(newParentFolderId, newFileName);

            File.Move(fileId, newPath);
            var newEntry = new FileInfo(newPath);

            var item = GetDriveItem(newEntry);
            return item;
        }

        public async Task<DriveItem> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            string newPath = Path.Combine(newParentFolderId, newFolderName);
            FsH.MoveDirectory(folderId, newPath);

            var newEntry = new DirectoryInfo(newPath);
            var item = GetDriveItem(newEntry);

            return item;
        }

        public async Task<DriveItem> RenameFileAsync(string fileId, string newFileName)
        {
            var result = await this.MoveFileAsync(fileId, Path.GetDirectoryName(fileId), newFileName);
            return result;
        }

        public async Task<DriveItem> RenameFolderAsync(string folderId, string newFolderName)
        {
            var result = await this.MoveFolderAsync(folderId, Path.GetDirectoryName(folderId), newFolderName);
            return result;
        }

        private DriveItem GetDriveItem(FileSystemInfo fSysInfo)
        {
            var fsItemMtbl = new DriveItem
            {
                Id = fSysInfo.FullName,
                Name = fSysInfo.Name,
                /* CreationTimeStr = TimeStampHelper.TmStmp(fsInfo.CreationTime, true, TimeStamp.Seconds),
                LastAccessTimeStr = TimeStampHelper.TmStmp(fsInfo.LastAccessTime, true, TimeStamp.Seconds),
                LastWriteTimeStr = TimeStampHelper.TmStmp(fsInfo.LastWriteTime, true, TimeStamp.Seconds) */
            };

            if (fSysInfo is DirectoryInfo dirInfo)
            {
                fsItemMtbl.IsFolder = true;
            }
            else if (fSysInfo is FileInfo fInfo)
            {
                fsItemMtbl.OfficeLikeFileType = this.GetOfficeLikeFileType(fInfo);
            }

            return fsItemMtbl;
        }

        private OfficeLikeFileType? GetOfficeLikeFileType(FileInfo fInfo)
        {
            var matchKvp = officeLikeFileTypesFileNameExtensions.SingleOrDefault(
                kvp => kvp.Value.Contains(fInfo.Extension));

            OfficeLikeFileType? retVal = null;

            if (matchKvp.Value != null)
            {
                retVal = matchKvp.Key;
            }

            return retVal;
        }

        private string GetDriveItemUrl(string driveItemId)
        {
            string driveItemUrl = $"file://{driveItemId}";
            return driveItemUrl;
        }
    }
}
