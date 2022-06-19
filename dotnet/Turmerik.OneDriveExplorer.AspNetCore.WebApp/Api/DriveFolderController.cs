using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Web;
using Turmerik.AspNetCore.Helpers;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriveFolderController : DriveItemControllerBase
    {
        private readonly IDriveItemNameMacroFactoryResolver nameMacroResolver;

        public DriveFolderController(
            IDriveExplorerService driveExplorerService,
            IDriveItemNameMacroFactoryResolver driveItemNameMacroFactoryResolver) : base(
                driveExplorerService)
        {
            this.nameMacroResolver = driveItemNameMacroFactoryResolver ?? throw new ArgumentNullException(
                nameof(driveItemNameMacroFactoryResolver));
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

        [HttpPost("[action]")]
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

        [HttpPost("[action]")]
        public async Task<ActionResult> CreateMultipleFoldersFromMacros([FromBody] DriveItemOp driveItemOp)
        {
            var actionResult = await ExecuteAsync(
                async () =>
                {
                    var factoriesList = this.ToDriveFolderNameFactoriesList(driveItemOp.MultipleItems);

                    var result = await this.DriveExplorerService.CreateMultipleFoldersAsync(
                        driveItemOp.ParentFolderId, factoriesList);

                    return result;
                });

            return actionResult;
        }

        [HttpPost("[action]")]
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
        }

        private bool TryRegisterDriveItemNameMacros(ref Func<Task<TrmrkActionResult<DriveItem>>> action)
        {
            bool retVal = this.HttpContext.Session.TryGetValue<DriveItemNameMacro[]>(
                SessionKeysH.DRIVE_ITEM_NAME_MACROS,
                out var macrosArr);

            if (retVal)
            {
                nameMacroResolver.RegisterMacros(macrosArr);
            }
            else
            {
                action = async () => throw new InternalAppError(HttpStatusCode.BadRequest);
            }

            return retVal;
        }

        private Tuple<Func<string[], int, string, string>, string> ToDriveFolderNameFactory(
            DriveItemOp driveItemOp)
        {
            var macro = driveItemOp.NameMacro;

            var tuple = new Tuple<Func<string[], int, string, string>, string>(
                nameMacroResolver.Resolve(macro),
                macro.SrcName);

            return tuple;
        }

        private Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?> ToDriveFileNameFactory(
            DriveItemOp driveItemOp)
        {
            var macro = driveItemOp.NameMacro;

            var tuple = new Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>(
                nameMacroResolver.Resolve(macro),
                macro.SrcName,
                driveItemOp.OfficeLikeFileType);

            return tuple;
        }

        private List<Tuple<Func<string[], int, string, string>, string>> ItemToDriveFolderNameFactoriesList(
            DriveItemOp driveItemOp)
        {
            var retList = new List<Tuple<Func<string[], int, string, string>, string>>()
            {
                this.ToDriveFolderNameFactory(driveItemOp)
            };

            return retList;
        }

        private List<Tuple<Func<string[], int, string, string>, string>> ToDriveFolderNameFactoriesList(
            List<DriveItemOp> driveItemOpsList)
        {
            var retList = driveItemOpsList.Select(this.ToDriveFolderNameFactory).ToList();
            return retList;
        }

        private List<Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>> ItemToDriveFileNameFactoriesList(
            DriveItemOp driveItemOp)
        {
            var retList = new List<Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>>()
            {
                this.ToDriveFileNameFactory(driveItemOp)
            };

            return retList;
        }

        private List<Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>> ToDriveFileNameFactoriesList(
            List<DriveItemOp> driveItemOpsList)
        {
            var retList = driveItemOpsList.Select(this.ToDriveFileNameFactory).ToList();
            return retList;
        }
    }
}
