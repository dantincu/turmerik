using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExplorerController : TrmrkControllerBase
    {
        private readonly IDriveItemMacrosService driveItemMacrosService;

        public ExplorerController(
            IDriveItemMacrosService driveItemMacrosService)
        {
            this.driveItemMacrosService = driveItemMacrosService ?? throw new ArgumentNullException(nameof(driveItemMacrosService));
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> GetDriveItemMacros()
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = this.driveItemMacrosService.GetDriveItemMacrosAggregate();
                    return new TrmrkActionResult<DriveItemMacrosAggregate>(true, result);
                });

            return actionResult;
        }
    }
}
