using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveExplorerService
    {
        Task<DriveItem> GetRootFolderAsync();
        Task<DriveItem> GetFolderAsync(string folderId);
        Task<DriveItem> CreateFolderAsync(string parentFolderId, string newFolderName);
        Task<DriveItem> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<DriveItem> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<DriveItem> DeleteFolderAsync(string folderId);
        Task<DriveItem> CreateFileAsync(string parentFolderId, string newFileName);
        Task<DriveItem> CopyFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<DriveItem> MoveFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<DriveItem> DeleteFileAsync(string fileId);
    }
}
