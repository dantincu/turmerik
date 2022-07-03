using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveExplorerServiceEngine
    {
        Task<DriveItem> GetRootFolderAsync();
        Task<DriveItem> GetFolderAsync(string folderId);
        string GetRootDriveFolderUrl();
        string GetDriveFolderUrl(string folderId);
        string GetDriveFileUrl(string fileId);
        Task<DriveItem> GetTextFileAsync(string fileId);
        Task<DriveItem> CreateFolderAsync(string parentFolderId, string newFolderName);
        Task<DriveItem> RenameFolderAsync(string folderId, string newFolderName);
        Task<DriveItem> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<DriveItem> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<DriveItem> DeleteFolderAsync(string folderId);
        Task<DriveItem> CreateTextFileAsync(string parentFolderId, string newFileName, string text);

        Task<DriveItem> CreateOfficeLikeFileAsync(
            string parentFolderId,
            string newFileName,
            OfficeLikeFileType officeLikeFileType);

        Task<DriveItem> RenameFileAsync(string fileId, string newFileName);
        Task<DriveItem> CopyFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<DriveItem> MoveFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<DriveItem> DeleteFileAsync(string fileId);
    }
}
