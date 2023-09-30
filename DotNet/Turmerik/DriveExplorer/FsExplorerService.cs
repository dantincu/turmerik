using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.FileSystem;
using Turmerik.Text;
using Turmerik.Utility;

namespace Turmerik.DriveExplorer
{
    public interface IFsExplorerServiceEngine : IFsEntriesRetriever, IDriveExplorerService
    {
    }

    public class FsExplorerService : FsEntriesRetriever, IFsExplorerServiceEngine
    {
        public FsExplorerService(
            ITimeStampHelper timeStampHelper) : base(timeStampHelper)
        {
        }

        public async Task<DriveItem> CopyFileAsync(
            string idnf,
            string newPrIdnf,
            string newFileName)
        {
            string newPath = Path.Combine(
                newPrIdnf, newFileName);

            File.Copy(idnf, newPath);

            var newEntry = new FileInfo(newPath);
            var item = GetDriveItem(newEntry, false);

            return item;
        }

        public async Task<DriveItem> CopyFolderAsync(
            string idnf,
            string newPrIdnf,
            string newFolderName)
        {
            string newPath = Path.Combine(
                newPrIdnf, newFolderName);

            FsH.CopyDirectory(
                idnf,
                newPath);

            var newEntry = new DirectoryInfo(newPath);
            var item = GetDriveItem(newEntry, false);

            return item;
        }

        public async Task<DriveItem> CreateFolderAsync(
            string prIdnf,
            string newFolderName)
        {
            string newPath = Path.Combine(
                prIdnf, newFolderName);

            Directory.CreateDirectory(newPath);

            var newEntry = new DirectoryInfo(newPath);
            var item = GetDriveItem(newEntry, false);

            return item;
        }

        public async Task<DriveItem> CreateOfficeLikeFileAsync(
            string prIdnf,
            string newFileName,
            OfficeLikeFileType officeLikeFileType)
        {
            var result = await CreateTextFileAsync(
                prIdnf,
                newFileName,
                string.Empty);

            return result;
        }

        public async Task<DriveItem> CreateTextFileAsync(
            string prIdnf,
            string newFileName,
            string text)
        {
            string newPath = Path.Combine(
                prIdnf, newFileName);

            File.WriteAllText(newPath, text);

            var newEntry = new FileInfo(newPath);
            var item = GetDriveItem(newEntry, false);

            return item;
        }

        public async Task<DriveItem> DeleteFileAsync(string idnf)
        {
            var fileInfo = new FileInfo(idnf);
            var driveItem = GetDriveItem(fileInfo, false);

            fileInfo.Delete();
            return driveItem;
        }

        public async Task<DriveItem> DeleteFolderAsync(string idnf)
        {
            var dirInfo = new DirectoryInfo(idnf);
            var driveItem = GetDriveItem(dirInfo, false);

            dirInfo.Delete(true);
            return driveItem;
        }

        public async Task<string> GetDriveFolderWebUrlAsync(
            string idnf) => GetDriveItemUrl(idnf);

        public async Task<string> GetDriveFileWebUrlAsync(
            string idnf) => GetDriveItemUrl(idnf);

        public async Task<DriveItem> GetTextFileAsync(string idnf)
        {
            string path = idnf;
            var entry = new FileInfo(path);

            var fileItem = GetDriveItem(entry, false);
            fileItem.TextFileContent = File.ReadAllText(path);

            return fileItem;
        }

        public async Task<DriveItem> MoveFileAsync(
            string idnf,
            string newPrIdnf,
            string newFileName)
        {
            string path = idnf;
            string newPath = Path.Combine(path, newFileName);

            File.Move(path, newPath);
            var newEntry = new FileInfo(newPath);

            var item = GetDriveItem(newEntry, false);
            return item;
        }

        public async Task<DriveItem> MoveFolderAsync(
            string idnf,
            string newPrIdnf,
            string newFolderName)
        {
            string path = idnf;
            string newPrPath = newPrIdnf;

            string newPath = Path.Combine(
                newPrPath, newFolderName);

            FsH.MoveDirectory(path, newPath);

            var newEntry = new DirectoryInfo(newPath);
            var item = GetDriveItem(newEntry, false);

            return item;
        }

        public async Task<DriveItem> RenameFileAsync(
            string idnf,
            string newFileName)
        {
            string parentIdnf = Path.GetDirectoryName(idnf);

            var result = await MoveFileAsync(
                idnf, parentIdnf, newFileName);

            return result;
        }

        public async Task<DriveItem> RenameFolderAsync(
            string idnf,
            string newFolderName)
        {
            string parentIdnf = Path.GetDirectoryName(idnf);

            var result = await MoveFolderAsync(
                idnf, parentIdnf, newFolderName);

            return result;
        }

        private string GetDriveItemUrl(
            string path) => $"file://{path}";
    }
}
