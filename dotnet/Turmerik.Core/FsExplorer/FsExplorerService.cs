using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
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

        public async Task<DriveItem> GetFolderAsync(string folderId)
        {
            throw new NotImplementedException();
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
                SubFolders = fsEntriesList
            };

            return rootFolder;
        }

        public async Task<DriveItem> CopyFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            throw new NotImplementedException();
        }

        public async Task<DriveItem> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            throw new NotImplementedException();
        }

        public async Task<DriveItem> CreateFileAsync(string parentFolderId, string newFileName)
        {
            throw new NotImplementedException();
        }

        public async Task<DriveItem> CreateFolderAsync(string parentFolderId, string newFolderName)
        {
            throw new NotImplementedException();
        }

        public async Task<DriveItem> DeleteFileAsync(string fileId)
        {
            throw new NotImplementedException();
        }

        public async Task<DriveItem> DeleteFolderAsync(string folderId)
        {
            throw new NotImplementedException();
        }

        public async Task<DriveItem> MoveFileAsync(string fileId, string newParentFolderId, string newFileName)
        {
            throw new NotImplementedException();
        }

        public async Task<DriveItem> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName)
        {
            throw new NotImplementedException();
        }

        private DriveItem GetDriveItem(FileSystemInfo fsInfo)
        {
            var fsItemMtbl = new DriveItem
            {
                Id = fsInfo.FullName,
                Name = fsInfo.Name,
                // CreationTime = fsInfo.CreationTime,
                CreationTimeStr = TimeStampHelper.TmStmp(fsInfo.CreationTime, true, TimeStamp.Seconds),
                // LastAccessTime = fsInfo.LastAccessTime,
                LastAccessTimeStr = TimeStampHelper.TmStmp(fsInfo.LastAccessTime, true, TimeStamp.Seconds),
                // LastWriteTime = fsInfo.LastWriteTime,
                LastWriteTimeStr = TimeStampHelper.TmStmp(fsInfo.LastWriteTime, true, TimeStamp.Seconds)
            };

            var dirInfo = fsInfo as DirectoryInfo;

            if (dirInfo != null)
            {
                fsItemMtbl.IsFolder = true;
            }
            else
            {
                // fsItemMtbl.FileNameExtension = Path.GetExtension(fsItemMtbl.Name);
            }

            return fsItemMtbl;
        }
    }
}
