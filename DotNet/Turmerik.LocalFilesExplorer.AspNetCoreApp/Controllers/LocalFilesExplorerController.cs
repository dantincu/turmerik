using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using Turmerik.AspNetCore.Utility;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.LocalFilesExplorer.AspNetCoreApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class LocalFilesExplorerController : ControllerBase
    {
        private readonly IDriveExplorerService dvExplrSvc;

        public LocalFilesExplorerController(
            IDriveExplorerService dvExplrSvc)
        {
            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(nameof(dvExplrSvc));
        }

        [HttpGet]
        public Task<DriveItem> GetItem(
            string idnf) => TryGetAsync(() => dvExplrSvc.GetItemAsync(idnf, true));

        [HttpGet]
        public Task<DriveItem> GetFolder(
            string idnf) => TryGetAsync(() => dvExplrSvc.GetFolderAsync(idnf, true));

        [HttpGet]
        public Task<bool> ItemExists(
            string idnf) => TryGetAsync(() => dvExplrSvc.ItemExistsAsync(idnf));

        [HttpGet]
        public Task<bool> FolderExists(
            string idnf) => TryGetAsync(() => dvExplrSvc.FolderExistsAsync(idnf));

        [HttpGet]
        public Task<bool> FileExists(
            string idnf) => TryGetAsync(() => dvExplrSvc.FileExistsAsync(idnf));

        [HttpGet]
        public Task<string> GetFileText(
            string idnf) => TryGetAsync(() => dvExplrSvc.GetFileTextAsync(idnf));

        [HttpGet]
        public Task<string> GetDriveFolderWebUrl(
            string idnf) => TryGetAsync(() => dvExplrSvc.GetDriveFolderWebUrlAsync(
                idnf));

        [HttpGet]
        public Task<string> GetDriveFileWebUrl(
            string idnf) => TryGetAsync(() => dvExplrSvc.GetDriveFileWebUrlAsync(
                idnf));

        [HttpPost]
        public Task<DriveItem> CreateFolder(
            string prIdnf, string newFolderName) => TryGetAsync(() => dvExplrSvc.CreateFolderAsync(
                prIdnf, newFolderName, true));

        [HttpPost]
        public Task<DriveItem> RenameFolder(
            string idnf, string newFolderName) => TryGetAsync(() => dvExplrSvc.RenameFolderAsync(
                idnf, newFolderName, true));

        [HttpPost]
        public Task<DriveItem> CopyFolder(
            string idnf, string newPrIdnf, string newFolderName) => TryGetAsync(() => dvExplrSvc.CopyFolderAsync(
                idnf, newPrIdnf, newFolderName, true));

        [HttpPost]
        public Task<DriveItem> MoveFolder(
            string idnf, string newPrIdnf, string newFolderName) => TryGetAsync(() => dvExplrSvc.MoveFolderAsync(
                idnf, newPrIdnf, newFolderName, true));

        [HttpPost]
        public Task<DriveItem> DeleteFolder(
            string idnf) => TryGetAsync(() => dvExplrSvc.DeleteFolderAsync(idnf, true));

        [HttpPost]
        public Task<DriveItem> CreateTextFile(
            string prIdnf, string newFileName, string text) => TryGetAsync(() => dvExplrSvc.CreateTextFileAsync(
                prIdnf, newFileName, text));

        [HttpPost]
        public Task<DriveItem> CreateOfficeLikeFile(
            string prIdnf,
            string newFileName,
            OfficeFileType officeLikeFileType) => TryGetAsync(() => dvExplrSvc.CreateOfficeLikeFileAsync(
                prIdnf, newFileName, officeLikeFileType));

        [HttpPost]
        public Task<DriveItem> RenameFile(
            string idnf, string newFileName) => TryGetAsync(() => dvExplrSvc.RenameFileAsync(
                idnf, newFileName));

        [HttpPost]
        public Task<DriveItem> CopyFile(
            string idnf, string newPrIdnf, string newFileName) => TryGetAsync(() => dvExplrSvc.CopyFileAsync(
                idnf, newPrIdnf, newFileName));

        [HttpPost]
        public Task<DriveItem> MoveFile(
            string idnf, string newPrIdnf, string newFileName) => TryGetAsync(() => dvExplrSvc.MoveFileAsync(
                idnf, newPrIdnf, newFileName));

        [HttpPost]
        public Task<DriveItem> DeleteFile(
            string idnf) => TryGetAsync(() => dvExplrSvc.DeleteFileAsync(idnf));

        private async Task<TResult> TryGetAsync<TResult>(
            Func<Task<TResult>> action)
        {
            TResult result = default;

            try
            {
                result = await action();
            }
            catch (DirectoryNotFoundException ex)
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
            }
            catch (FileNotFoundException ex)
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
            }
            catch (DriveExplorerException exc)
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await HttpContext.Response.WriteAsJsonAsync(exc.Message);
                await HttpContext.Response.CompleteAsync();
            }
            catch
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }

            return result;
        }
    }
}
