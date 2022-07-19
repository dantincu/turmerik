using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

namespace Turmerik.AspNetCore.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public abstract class ExplorerControllerBase : TrmrkControllerBase
    {
        private readonly IDriveItemMacrosService driveItemMacrosService;

        public ExplorerControllerBase(
            IDriveItemMacrosService driveItemMacrosService)
        {
            this.driveItemMacrosService = driveItemMacrosService ?? throw new ArgumentNullException(nameof(driveItemMacrosService));
        }

        protected async Task<ActionResult> GetDriveItemMacrosCoreAsync()
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = driveItemMacrosService.GetDriveItemMacrosAggregate();
                    return new TrmrkActionResult<DriveItemMacrosAggregate>(true, result);
                });

            return actionResult;
        }
    }
}
