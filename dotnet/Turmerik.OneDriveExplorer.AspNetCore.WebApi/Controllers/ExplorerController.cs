using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.AppConfig;
using Turmerik.AspNetCore.Controllers;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApi.Controllers
{
    // [Authorize]
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ExplorerController : ExplorerControllerBase
    {
        public ExplorerController(
            IDriveItemMacrosService driveItemMacrosService,
            IAppSettings appSettings) : base(
                driveItemMacrosService,
                appSettings)
        {
        }

        [HttpGet]
        public async Task<ActionResult> GetDriveItemMacros() => await this.GetDriveItemMacrosCoreAsync();

        [HttpGet]
        public async Task<ActionResult> GetAppSettings() => await this.GetAppSettingsCoreAsync();
    }
}
