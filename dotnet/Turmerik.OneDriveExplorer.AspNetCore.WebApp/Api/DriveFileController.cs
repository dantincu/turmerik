using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriveFileController : DriveItemControllerBase
    {
        public DriveFileController(IDriveExplorerService driveExplorerService) : base(driveExplorerService)
        {
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(string id)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.GetTextFileAsync(id);
                    return result;
                });

            return actionResult;
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DriveItem driveItem)
        {
            Func<Task<TrmrkActionResult<DriveItem>>> action = null;

            if (driveItem.OfficeLikeFileType.HasValue)
            {
                action = () => this.DriveExplorerService.CreateOfficeLikeFileAsync(
                    driveItem.ParentFolderId, driveItem.Name, driveItem.OfficeLikeFileType.Value);
            }
            else
            {
                action = () => this.DriveExplorerService.CreateTextFileAsync(
                    driveItem.ParentFolderId, driveItem.Name, string.Empty);
            }

            var actionResult = await ExecuteAsync(action);
            return actionResult;
        }

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] DriveItem driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.MoveFileAsync(
                        id, driveItem.ParentFolderId, driveItem.Name);

                    return result;
                });

            return actionResult;
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.DeleteFileAsync(id);
                    return result;
                });

            return actionResult;
        }
    }
}
