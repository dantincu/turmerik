using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.AppConfig;
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
        private readonly IAppSettings appSettings;

        public ExplorerControllerBase(
            IDriveItemMacrosService driveItemMacrosService,
            IAppSettings appSettings)
        {
            this.driveItemMacrosService = driveItemMacrosService ?? throw new ArgumentNullException(nameof(driveItemMacrosService));
            this.appSettings = appSettings ?? throw new ArgumentNullException(nameof(appSettings));
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

        protected async Task<ActionResult> GetAppSettingsCoreAsync()
        {
            var actionResult = await ExecuteAsync(
                async () => new TrmrkActionResult<IAppSettings>(true, this.appSettings));

            return actionResult;
        }
    }
}
