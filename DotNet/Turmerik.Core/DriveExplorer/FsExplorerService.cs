using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileManager;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IFsExplorerService : IFsItemsRetriever, IDriveExplorerService
    {
    }

    public class FsExplorerService : FsItemsRetriever, IFsExplorerService
    {
        public FsExplorerService(
            IFsManagerGuard fsManagerGuard,
            ITimeStampHelper timeStampHelper,
            IPascalOrCamelCaseToWordsConverter pascalOrCamelCaseToWordsConverter) : base(
                fsManagerGuard,
                timeStampHelper,
                pascalOrCamelCaseToWordsConverter)
        {
        }

        public async Task<DriveItem> CopyFileAsync(
            string idnf,
            string newPrIdnf,
            string newFileName)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var filePath);
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(newPrIdnf, true, out var newPrFolderPath);

            string newPath = Path.Combine(
                newPrFolderPath, newFileName);

            File.Copy(filePath, newPath);

            var newEntry = new FileInfo(newPath);
            var item = GetDriveItem(newEntry);

            return item;
        }

        public async Task<DriveItem> CopyFolderAsync(
            string idnf,
            string newPrIdnf,
            string newFolderName,
            bool? retMinimalInfo)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var folderPath);
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(newPrIdnf, true, out var newPrFolderPath);

            string newPath = Path.Combine(
                newPrFolderPath, newFolderName);

            FsH.CopyDirectory(
                idnf,
                newPath);

            var newEntry = new DirectoryInfo(newPath);
            var item = GetDriveItem(newEntry);

            RemoveAdditionalInfoIfReq(item, retMinimalInfo);
            return item;
        }

        public async Task<DriveItem> CreateFolderAsync(
            string prIdnf,
            string newFolderName,
            bool? retMinimalInfo)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(prIdnf, true, out var newPrFolderPath);

            string newPath = Path.Combine(
                newPrFolderPath, newFolderName);

            Directory.CreateDirectory(newPath);

            var newEntry = new DirectoryInfo(newPath);
            var item = GetDriveItem(newEntry);

            RemoveAdditionalInfoIfReq(item, retMinimalInfo);
            return item;
        }

        public async Task<DriveItem> CreateOfficeLikeFileAsync(
            string prIdnf,
            string newFileName,
            OfficeFileType officeLikeFileType)
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
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(prIdnf, false, out var prFolderPath);

            string newPath = Path.Combine(
                prFolderPath, newFileName);

            File.WriteAllText(newPath, text);

            var newEntry = new FileInfo(newPath);
            var item = GetDriveItem(newEntry);

            return item;
        }

        public async Task<DriveItem> DeleteFileAsync(string idnf)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var filePath);

            var fileInfo = new FileInfo(filePath);
            var driveItem = GetDriveItem(fileInfo);

            fileInfo.Delete();
            return driveItem;
        }

        public async Task<DriveItem> DeleteFolderAsync(
            string idnf,
            bool? retMinimalInfo)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var folderPath);

            var dirInfo = new DirectoryInfo(folderPath);
            var driveItem = GetDriveItem(dirInfo);

            dirInfo.Delete(true);

            SortChildItems(driveItem);
            RemoveAdditionalInfoIfReq(driveItem, retMinimalInfo);

            return driveItem;
        }

        public async Task<string> GetDriveFolderWebUrlAsync(
            string idnf) => GetDriveItemUrl(idnf);

        public async Task<string> GetDriveFileWebUrlAsync(
            string idnf) => GetDriveItemUrl(idnf);

        public async Task<DriveItem> MoveFileAsync(
            string idnf,
            string newPrIdnf,
            string newFileName)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var filePath);
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(newPrIdnf, true, out var newPrFolderPath);

            string path = filePath;

            string newPath = Path.Combine(
                newPrFolderPath, newFileName);

            File.Move(path, newPath);
            var newEntry = new FileInfo(newPath);

            var item = GetDriveItem(newEntry);
            return item;
        }

        public async Task<DriveItem> MoveFolderAsync(
            string idnf,
            string newPrIdnf,
            string newFolderName,
            bool? retMinimalInfo)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, false, out var folderPath);
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(newPrIdnf, true, out var newPrFolderPath);

            string path = folderPath;
            string newPrPath = newPrFolderPath;

            string newPath = Path.Combine(
                newPrPath, newFolderName);

            FsH.MoveDirectory(path, newPath);

            var newEntry = new DirectoryInfo(newPath);
            var item = GetDriveItem(newEntry);

            SortChildItems(item);
            RemoveAdditionalInfoIfReq(item, retMinimalInfo);

            return item;
        }

        public async Task<DriveItem> RenameFileAsync(
            string idnf,
            string newFileName)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, true, out var filePath);
            string parentDirPath = Path.GetDirectoryName(filePath);

            var result = await MoveFileAsync(
                filePath, parentDirPath, newFileName);

            return result;
        }

        public async Task<DriveItem> RenameFolderAsync(
            string idnf,
            string newFolderName,
            bool? retMinimalInfo)
        {
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(idnf, true, out var filePath);
            string parentPath = Path.GetDirectoryName(filePath);
            FsManagerGuard.ThrowIfPathIsNotValidAgainstRootPath(parentPath, true, out _);

            var result = await MoveFolderAsync(
                filePath, parentPath, newFolderName, retMinimalInfo);

            return result;
        }

        private string GetDriveItemUrl(
            string path) => $"file://{path}";
    }
}
