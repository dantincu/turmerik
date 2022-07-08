using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Web;
using Turmerik.AspNetCore.Helpers;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriveFolderController : DriveItemControllerBase
    {
        public DriveFolderController(
            IDriveExplorerService driveExplorerService) : base(
                driveExplorerService)
        {
        }

        // GET: api/<ValuesController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.GetRootFolderAsync();
                    return result;
                });

            return actionResult;
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(string id)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.GetFolderAsync(id);
                    return result;
                });

            return actionResult;
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DriveItemMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.CreateFolderAsync(
                        driveItem.ParentFolderId, driveItem.Name);
                    return result;
                });

            return actionResult;
        }

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] DriveItemOpMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.RenameFolderAsync(id, driveItem.Name);
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
                    var result = await this.DriveExplorerService.DeleteFolderAsync(id);
                    return result;
                });

            return actionResult;
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> Copy([FromBody] DriveItemMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.CopyFolderAsync(
                        driveItem.Id, driveItem.ParentFolderId, driveItem.Name);

                    return result;
                });

            return actionResult;
        }

        [HttpPut("[action]")]
        public async Task<ActionResult> Move([FromBody] DriveItemMtbl driveItem)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.MoveFolderAsync(
                        driveItem.Id, driveItem.ParentFolderId, driveItem.Name);

                    return result;
                });

            return actionResult;
        }

        [HttpPost("[action]/{parentFolderId}")]
        public async Task<ActionResult> CreateMultipleMacros(string parentFolderId, [FromBody] DriveItemOpMtbl[] driveItemOpsArr)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var result = await this.DriveExplorerService.CreateMultipleAsync(
                        parentFolderId, driveItemOpsArr);

                    return result;
                });

            return actionResult;
        }
    }
}
