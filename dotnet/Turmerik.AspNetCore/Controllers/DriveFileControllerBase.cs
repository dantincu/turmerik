using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.AspNetCore.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public abstract class DriveFileControllerBase : DriveItemControllerBase
    {
        public DriveFileControllerBase(IDriveExplorerService driveExplorerService) : base(driveExplorerService)
        {
        }

        protected async Task<ActionResult> GetCoreAsync(string id)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.GetTextFileAsync(id);
                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> PostCoreAsync(DriveItemMtbl driveItem)
        {
            Func<Task<TrmrkActionResult<DriveItemMtbl>>> action = null;

            if (driveItem.OfficeLikeFileType.HasValue)
            {
                action = () => DriveExplorerService.CreateOfficeLikeFileAsync(
                    driveItem.ParentFolderId, driveItem.Name, driveItem.OfficeLikeFileType.Value);
            }
            else
            {
                action = () => DriveExplorerService.CreateTextFileAsync(
                    driveItem.ParentFolderId, driveItem.Name, string.Empty);
            }

            var actionResult = await ExecuteAsync(action);
            return actionResult;
        }

        protected async Task<ActionResult> PutCoreAsync(string id, DriveItemMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.RenameFileAsync(id, driveItem.Name);
                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> DeleteCoreAsync(string id)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.DeleteFileAsync(id);
                    return result;
                });

            return actionResult;
        }

        protected async Task<ActionResult> CopyCoreAsync(DriveItemMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await DriveExplorerService.CopyFileAsync(
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
                    var result = await DriveExplorerService.MoveFileAsync(
                        driveItem.Id, driveItem.ParentFolderId, driveItem.Name);

                    return result;
                });

            return actionResult;
        }
    }
}
