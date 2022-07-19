using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.Controllers;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DriveFileController : DriveFileControllerBase
    {
        public DriveFileController(IDriveExplorerService driveExplorerService) : base(driveExplorerService)
        {
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(string id) => await this.GetCoreAsync(id);

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DriveItemMtbl driveItem) => await this.PostCoreAsync(driveItem);

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] DriveItemMtbl driveItem) => await this.PutCoreAsync(id, driveItem);

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id) => await this.DeleteCoreAsync(id);

        [HttpPost("[action]")]
        public async Task<ActionResult> Copy([FromBody] DriveItemMtbl driveItem) => await this.CopyCoreAsync(driveItem);

        [HttpPost("[action]")]
        public async Task<ActionResult> Move([FromBody] DriveItemMtbl driveItem) => await this.MoveCoreAsync(driveItem);
    }
}
