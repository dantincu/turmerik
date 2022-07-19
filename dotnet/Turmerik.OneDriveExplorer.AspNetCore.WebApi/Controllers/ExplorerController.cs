using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.Controllers;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExplorerController : ExplorerControllerBase
    {
        public ExplorerController(
            IDriveItemMacrosService driveItemMacrosService) : base(driveItemMacrosService)
        {
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> GetDriveItemMacros() => await this.GetDriveItemMacrosCoreAsync();
    }
}
