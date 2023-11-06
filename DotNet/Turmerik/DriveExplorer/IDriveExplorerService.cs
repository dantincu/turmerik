﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.DriveExplorer
{
    public interface IDriveExplorerService : IDriveItemsRetriever
    {
        Task<string> GetDriveFolderWebUrlAsync(string idnf);
        Task<string> GetDriveFileWebUrlAsync(string idnf);
        Task<DriveItem> CreateFolderAsync(string prIdnf, string newFolderName);
        Task<DriveItem> RenameFolderAsync(string idnf, string newFolderName);
        Task<DriveItem> CopyFolderAsync(string idnf, string newPrIdnf, string newFolderName);
        Task<DriveItem> MoveFolderAsync(string idnf, string newPrIdnf, string newFolderName);
        Task<DriveItem> DeleteFolderAsync(string idnf);
        Task<DriveItem> CreateTextFileAsync(string prIdnf, string newFileName, string text);

        Task<DriveItem> CreateOfficeLikeFileAsync(
            string prIdnf,
            string newFileName,
            OfficeFileType officeLikeFileType);

        Task<DriveItem> RenameFileAsync(string idnf, string newFileName);
        Task<DriveItem> CopyFileAsync(string idnf, string newPrIdnf, string newFileName);
        Task<DriveItem> MoveFileAsync(string idnf, string newPrIdnf, string newFileName);
        Task<DriveItem> DeleteFileAsync(string idnf);
    }
}
