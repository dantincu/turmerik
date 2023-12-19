using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turmerik.DriveExplorer;

namespace Turmerik.LocalFilesExplorer.AspNetCoreApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class LocalFilesExplorerController
    {
        private readonly IDriveExplorerService dvExplrSvc;

        public LocalFilesExplorerController(
            IDriveExplorerService dvExplrSvc)
        {
            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(nameof(dvExplrSvc));
        }

        [HttpGet]
        public Task<DriveItem> GetItemAsync(
            string idnf) => dvExplrSvc.GetItemAsync(idnf, true);

        [HttpGet]
        public Task<DriveItem> GetFolderAsync(
            string idnf) => dvExplrSvc.GetFolderAsync(idnf, true);

        [HttpGet]
        public Task<bool> ItemExistsAsync(
            string idnf) => dvExplrSvc.ItemExistsAsync(idnf);

        [HttpGet]
        public Task<bool> FolderExistsAsync(
            string idnf) => dvExplrSvc.FolderExistsAsync(idnf);

        [HttpGet]
        public Task<bool> FileExistsAsync(
            string idnf) => dvExplrSvc.FileExistsAsync(idnf);

        [HttpGet]
        public Task<string> GetFileTextAsync(
            string idnf) => dvExplrSvc.GetFileTextAsync(idnf);

        [HttpGet]
        public Task<string> GetDriveFolderWebUrlAsync(
            string idnf) => dvExplrSvc.GetDriveFolderWebUrlAsync(
                idnf);

        [HttpGet]
        public Task<string> GetDriveFileWebUrlAsync(
            string idnf) => dvExplrSvc.GetDriveFileWebUrlAsync(
                idnf);

        [HttpPost]
        public Task<DriveItem> CreateFolderAsync(
            string prIdnf, string newFolderName) => dvExplrSvc.CreateFolderAsync(
                prIdnf, newFolderName, true);

        [HttpPost]
        public Task<DriveItem> RenameFolderAsync(
            string idnf, string newFolderName) => dvExplrSvc.RenameFolderAsync(
                idnf, newFolderName, true);

        [HttpPost]
        public Task<DriveItem> CopyFolderAsync(
            string idnf, string newPrIdnf, string newFolderName) => dvExplrSvc.CopyFolderAsync(
                idnf, newPrIdnf, newFolderName, true);

        [HttpPost]
        public Task<DriveItem> MoveFolderAsync(
            string idnf, string newPrIdnf, string newFolderName) => dvExplrSvc.MoveFolderAsync(
                idnf, newPrIdnf, newFolderName, true);

        [HttpPost]
        public Task<DriveItem> DeleteFolderAsync(
            string idnf) => dvExplrSvc.DeleteFolderAsync(idnf, true);

        [HttpPost]
        public Task<DriveItem> CreateTextFileAsync(
            string prIdnf, string newFileName, string text) => dvExplrSvc.CreateTextFileAsync(
                prIdnf, newFileName, text);

        [HttpPost]
        public Task<DriveItem> CreateOfficeLikeFileAsync(
            string prIdnf,
            string newFileName,
            OfficeFileType officeLikeFileType) => dvExplrSvc.CreateOfficeLikeFileAsync(
                prIdnf, newFileName, officeLikeFileType);

        [HttpPost]
        public Task<DriveItem> RenameFileAsync(
            string idnf, string newFileName) => dvExplrSvc.RenameFileAsync(
                idnf, newFileName);

        [HttpPost]
        public Task<DriveItem> CopyFileAsync(
            string idnf, string newPrIdnf, string newFileName) => dvExplrSvc.CopyFileAsync(
                idnf, newPrIdnf, newFileName);

        [HttpPost]
        public Task<DriveItem> MoveFileAsync(
            string idnf, string newPrIdnf, string newFileName) => dvExplrSvc.MoveFileAsync(
                idnf, newPrIdnf, newFileName);

        [HttpPost]
        public Task<DriveItem> DeleteFileAsync(
            string idnf) => dvExplrSvc.DeleteFileAsync(idnf);
    }
}
