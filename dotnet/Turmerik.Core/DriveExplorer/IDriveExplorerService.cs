using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Components;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveExplorerService
    {
        Task<TrmrkActionResult<DriveItem>> GetRootFolderAsync();
        Task<TrmrkActionResult<DriveItem>> GetFolderAsync(string folderId);
        TrmrkActionResult<string> GetRootDriveFolderUrl();
        TrmrkActionResult<string> GetDriveFolderUrl(string folderId);
        TrmrkActionResult<string> GetDriveFileUrl(string fileId);
        Task<TrmrkActionResult<DriveItem>> GetTextFileAsync(string fileId);
        Task<TrmrkActionResult<DriveItem>> CreateFolderAsync(string parentFolderId, string newFolderName);
        Task<TrmrkActionResult<DriveItem>> CopyFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<TrmrkActionResult<DriveItem>> MoveFolderAsync(string folderId, string newParentFolderId, string newFolderName);
        Task<TrmrkActionResult<DriveItem>> DeleteFolderAsync(string folderId);
        Task<TrmrkActionResult<DriveItem>> CreateTextFileAsync(string parentFolderId, string newFileName, string text);

        Task<TrmrkActionResult<DriveItem>> CreateOfficeLikeFileAsync(
            string parentFolderId,
            string newFileName,
            OfficeLikeFileType officeLikeFileType);

        Task<TrmrkActionResult<DriveItem>> CopyFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<TrmrkActionResult<DriveItem>> MoveFileAsync(string fileId, string newParentFolderId, string newFileName);
        Task<TrmrkActionResult<DriveItem>> DeleteFileAsync(string fileId);

        Task<TrmrkActionResult<DriveItemPutOp>> CreateMultipleFoldersAsync(string parentFolderId,
            List<Tuple<Func<string[], int, string, string>, string>> folderNameFactoriesList);

        Task<TrmrkActionResult<DriveItemPutOp>> CreateMultipleFilesAsync(string parentFolderId,
            List<Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>> fileNameFactoriesList);
    }
}
