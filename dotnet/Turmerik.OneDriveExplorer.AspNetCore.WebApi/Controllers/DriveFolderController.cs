using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Web;
using Turmerik.AspNetCore.Controllers;
using Turmerik.AspNetCore.Helpers;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DriveFolderController : DriveFolderControllerBase
    {
        public DriveFolderController(
            IDriveExplorerService driveExplorerService) : base(
                driveExplorerService)
        {
        }

        // GET: api/<ValuesController>
        [HttpGet]
        public async Task<ActionResult> Get() => await this.GetCoreAsync();

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(string id) => await this.GetCoreAsync(id);

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DriveItemMtbl driveItem) => await this.PostCoreAsync(driveItem);

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] DriveItemOpMtbl driveItem) => await this.PutCoreAsync(id, driveItem);

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id) => await this.DeleteCoreAsync(id);

        [HttpPost("[action]")]
        public async Task<ActionResult> Copy([FromBody] DriveItemMtbl driveItem) => await this.CopyCoreAsync(driveItem);

        [HttpPut("[action]")]
        public async Task<ActionResult> Move([FromBody] DriveItemMtbl driveItem) => await this.MoveCoreAsync(driveItem);

        [HttpPost("[action]/{parentFolderId}")]
        public async Task<ActionResult> CreateMultipleMacros(
            string parentFolderId,
            [FromBody] DriveItemOpMtbl[] driveItemOpsArr) => await this.CreateMultipleMacrosCoreAsync(
                parentFolderId,
                driveItemOpsArr);
    }
}
