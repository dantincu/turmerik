using Microsoft.AspNetCore.Mvc;
using System.Net;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Api
{
    public abstract class DriveItemControllerBase : ControllerBase
    {
        protected DriveItemControllerBase(
            IDriveExplorerService driveExplorerService)
        {
            DriveExplorerService = driveExplorerService ?? throw new ArgumentNullException(nameof(driveExplorerService));
        }

        protected IDriveExplorerService DriveExplorerService { get; }

        protected async Task<ActionResult> ExecuteAsync<TData>(
            Func<Task<TrmrkActionResult<TData>>> action)
        {
            var result = await action();
            ActionResult actionResult;

            if (result.IsSuccess)
            {
                actionResult = new JsonResult(result.Data);
            }
            else
            {
                var httpStatusCode = result.HttpStatusCode ?? HttpStatusCode.InternalServerError;
                actionResult = this.StatusCode((int)httpStatusCode);
            }

            return actionResult;
        }
    }
}
