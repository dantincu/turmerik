using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Web;
using Turmerik.AspNetCore.Helpers;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Turmerik.AspNetCore.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public abstract class DriveFolderControllerBase : DriveItemControllerBase
    {
        public DriveFolderControllerBase(
            IDriveExplorerService driveExplorerService) : base(
                driveExplorerService)
        {
        }

        protected async Task<ActionResult> GetCoreAsync()
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.GetRootFolderAsync();
                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> GetCoreAsync(string id)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.GetFolderAsync(id);
                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> PostCoreAsync(DriveItemMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.CreateFolderAsync(
                        driveItem.ParentFolderId, driveItem.Name);
                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> PutCoreAsync(string id, DriveItemOpMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.RenameFolderAsync(id, driveItem.Name);
                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> DeleteCoreAsync(string id)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.DeleteFolderAsync(id);
                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> CopyCoreAsync(DriveItemMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.CopyFolderAsync(
                        driveItem.Id, driveItem.ParentFolderId, driveItem.Name);

                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> MoveCoreAsync(DriveItemMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.MoveFolderAsync(
                        driveItem.Id, driveItem.ParentFolderId, driveItem.Name);

                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> CreateMultipleMacrosCoreAsync(string parentFolderId, DriveItemOpMtbl[] driveItemOpsArr)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.CreateMultipleAsync(
                        parentFolderId, driveItemOpsArr);

                    return result;
                });

            return actionResult;
        }
    }
}
