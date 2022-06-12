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
        public async Task<ActionResult> Put(string id, [FromBody] DriveItemPutOp driveItemPutOp)
        {
            Func<Task<TrmrkActionResult<DriveItem>>> action = null;

            List<Tuple<Func<string[], int, string, string>, string>> folderNameFactoriesList = null;
            List<Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>> fileNameFactoriesList = null;

            switch (driveItemPutOp.DriveItemOp.Value)
            {
                case DriveItemOp.CreateFile:
                    if (driveItemPutOp.OfficeLikeFileType.HasValue)
                    {
                        action = () => this.DriveExplorerService.CreateOfficeLikeFileAsync(
                            driveItemPutOp.ParentFolderId, driveItemPutOp.Name, driveItemPutOp.OfficeLikeFileType.Value);
                    }
                    else
                    {
                        action = () => this.DriveExplorerService.CreateTextFileAsync(
                            driveItemPutOp.ParentFolderId, driveItemPutOp.Name, string.Empty);
                    }

                    break;

                case DriveItemOp.MoveFolder:
                    action = () => this.DriveExplorerService.MoveFolderAsync(
                        id, driveItemPutOp.ParentFolderId, driveItemPutOp.Name);
                    break;

                case DriveItemOp.CopyFolder:
                    action = () => this.DriveExplorerService.CopyFolderAsync(
                        id, driveItemPutOp.ParentFolderId, driveItemPutOp.Name);
                    break;

                case DriveItemOp.MoveFile:
                    action = () => this.DriveExplorerService.MoveFileAsync(
                        id, driveItemPutOp.ParentFolderId, driveItemPutOp.Name);
                    break;

                case DriveItemOp.CopyFile:
                    action = () => this.DriveExplorerService.CopyFileAsync(
                        id, driveItemPutOp.ParentFolderId, driveItemPutOp.Name);
                    break;

                case DriveItemOp.DeleteFile:
                    action = () => this.DriveExplorerService.DeleteFileAsync(id);
                    break;

                case DriveItemOp.CreateMultipleFolders:
                    if (TryRegisterDriveItemNameMacros(ref action))
                    {
                        folderNameFactoriesList = driveItemPutOp.MultipleItems.Select(
                            item => new Tuple<Func<string[], int, string, string>, string>(
                                nameMacroResolver.Resolve(
                                    item.NameMacro),
                                item.NameMacro.SrcName)).ToList();
                    }

                    break;
                case DriveItemOp.CreateMultipleFiles:
                    if (TryRegisterDriveItemNameMacros(ref action))
                    {
                        fileNameFactoriesList = driveItemPutOp.MultipleItems.Select(
                        item => new Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>(
                            nameMacroResolver.Resolve(
                                item.NameMacro),
                            item.NameMacro.SrcName,
                            item.OfficeLikeFileType)).ToList();
                    }

                    break;
                case DriveItemOp.CreateFolderFromMacro:
                    if (TryRegisterDriveItemNameMacros(ref action))
                    {
                        folderNameFactoriesList = new List<Tuple<Func<string[], int, string, string>, string>>()
                        {
                            new Tuple<Func<string[], int, string, string>, string>(
                                nameMacroResolver.Resolve(driveItemPutOp.NameMacro),
                                driveItemPutOp.NameMacro.SrcName)
                        };
                    }

                    break;
                case DriveItemOp.CreateFileFromMacro:
                    if (TryRegisterDriveItemNameMacros(ref action))
                    {
                        fileNameFactoriesList = new List<Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>>()
                        {
                            new Tuple<Func<string[], int, string, string>, string, OfficeLikeFileType?>(
                                nameMacroResolver.Resolve(driveItemPutOp.NameMacro),
                                driveItemPutOp.NameMacro.SrcName,
                                driveItemPutOp.OfficeLikeFileType)
                        };
                    }
                    break;
                default:
                    action = async () => throw new InternalAppError(HttpStatusCode.InternalServerError);
                    break;
            }

            if (action == null)
            {
                if (folderNameFactoriesList != null && fileNameFactoriesList == null)
                {
                    action = async () => (await DriveExplorerService.CreateMultipleFoldersAsync(
                        id,
                        folderNameFactoriesList)).WithHelper(
                        result => new TrmrkActionResult<DriveItem>(
                            result.IsSuccess,
                            result.Data,
                            result.ErrorViewModel,
                            result.HttpStatusCode));
                }
                else if (folderNameFactoriesList == null && fileNameFactoriesList != null)
                {
                    action = async () => (await DriveExplorerService.CreateMultipleFilesAsync(
                        id,
                        fileNameFactoriesList)).WithHelper(
                        result => new TrmrkActionResult<DriveItem>(
                            result.IsSuccess,
                            result.Data,
                            result.ErrorViewModel,
                            result.HttpStatusCode));
                }
                else
                {
                    action = async () => throw new InternalAppError(HttpStatusCode.InternalServerError);
                }
            }

            var actionResult = await ExecuteAsync(action);
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

        private async Task<ActionResult> ExecuteAsync(
            Func<Task<TrmrkActionResult<DriveItem>>> action)
        {
            var result = await action();
            ActionResult actionResult;

            if (result.IsSuccess)
            {
                actionResult = new JsonResult(result.Data);
            }
            else
            {
                var httpStatusCode = result.HttpStatusCode ?? HttpStatusCode.InternalServerError;
                actionResult = this.StatusCode((int)httpStatusCode);
            }

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
    }
}
