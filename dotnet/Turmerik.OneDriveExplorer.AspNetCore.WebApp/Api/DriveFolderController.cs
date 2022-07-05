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
        // private readonly IDriveItemNameMacroFactoryResolver nameMacroResolver;
        // private readonly IDriveItemMacrosService driveItemMacrosService;

        public DriveFolderController(
            // IDriveItemMacrosService driveItemMacrosService,
            /* IDriveItemNameMacroFactoryResolver driveItemNameMacroFactoryResolver, */
            IDriveExplorerService driveExplorerService) : base(
                driveExplorerService)
        {
            /* this.driveItemMacrosService = driveItemMacrosService ?? throw new ArgumentNullException(
                nameof(driveItemMacrosService)); */

            /* this.nameMacroResolver = driveItemNameMacroFactoryResolver ?? throw new ArgumentNullException(
                nameof(driveItemNameMacroFactoryResolver)); */

            // this.TryRegisterDriveItemNameMacros();
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
        public async Task<ActionResult> Post([FromBody] DriveItem driveItem)
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
        public async Task<ActionResult> Put(string id, [FromBody] DriveItemOp driveItem)
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
        public async Task<ActionResult> Copy([FromBody] DriveItem driveItem)
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
        public async Task<ActionResult> Move([FromBody] DriveItem driveItem)
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
        public async Task<ActionResult> CreateMultipleMacros(string parentFolderId, [FromBody] DriveItemOp[] driveItemOpsArr)
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

        /* [HttpPost("[action]")]
        public async Task<ActionResult> CreateFolderFromMacro([FromBody] DriveItemOp driveItemOp)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var factoriesList = this.ItemToDriveFolderNameFactoriesList(driveItemOp);

                    var result = await this.DriveExplorerService.CreateMultipleFoldersAsync(
                        driveItemOp.ParentFolderId, factoriesList);

                    return result;
                });

            return actionResult;
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> CreateMultipleFilesFromMacros([FromBody] DriveItemOp driveItemOp)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var factoriesList = this.ToDriveFileNameFactoriesList(driveItemOp.MultipleItems);

                    var result = await this.DriveExplorerService.CreateMultipleFilesAsync(
                        driveItemOp.ParentFolderId, factoriesList);

                    return result;
                });

            return actionResult;
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> CreateFileFromMacro([FromBody] DriveItemOp driveItemOp)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var factoriesList = this.ItemToDriveFileNameFactoriesList(driveItemOp);

                    var result = await this.DriveExplorerService.CreateMultipleFilesAsync(
                        driveItemOp.ParentFolderId, factoriesList);

                    return result;
                });

            return actionResult;
        } */

        private bool TryRegisterDriveItemNameMacros(/* ref Func<Task<TrmrkActionResult<DriveItem>>> action*/)
        {
            bool retVal = true; /* this.HttpContext.Session.TryGetValue<DriveItemNameMacro[]>(
                SessionKeysH.DRIVE_ITEM_NAME_MACROS,
                out var macrosArr); */

            /* var macrosArr = this.driveItemMacrosService.DriveItemNameMacrosService.GetDriveItemNameMacros().SelectMany(
                kvp => kvp.Value.Item2).ToArray(); */

            if (retVal)
            {
                // this.nameMacroResolver.RegisterMacros(macrosArr);
            }
            else
            {
                // action = async () => throw new InternalAppError(HttpStatusCode.BadRequest);
            }

            return retVal;
        }
    }
}
