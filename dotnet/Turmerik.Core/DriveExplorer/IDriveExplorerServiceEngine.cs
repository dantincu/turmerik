using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveExplorerServiceEngine
    {
        Task<DriveItemMtbl> GetRootFolderAsync();
        Task<DriveItemMtbl> GetFolderAsync(string folderId);
        string GetRootDriveFolderUrl();
        string GetDriveFolderUrl(string folderId);
        string GetDriveFileUrl(string fileId);
        Task<DriveItemMtbl> GetTextFileAsync(string fileId);
        Task<DriveItemMtbl> CreateFolderAsync(string parentFolderId, string newFolderName);
        Task<DriveItemMtbl> RenameFolderAsync(string folderId, string newFolderName);
        Task<DriveItemMtbl> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<DriveItemMtbl> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<DriveItemMtbl> DeleteFolderAsync(string folderId);
        Task<DriveItemMtbl> CreateTextFileAsync(string parentFolderId, string newFileName, string text);

        Task<DriveItemMtbl> CreateOfficeLikeFileAsync(
            string parentFolderId,
            string newFileName,
            OfficeLikeFileType officeLikeFileType);

        Task<DriveItemMtbl> RenameFileAsync(string fileId, string newFileName);
        Task<DriveItemMtbl> CopyFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<DriveItemMtbl> MoveFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<DriveItemMtbl> DeleteFileAsync(string fileId);
    }
}
