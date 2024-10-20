using Json.More;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Turmerik.Core.DriveExplorer;
using Turmerik.LocalFilesExplorer.WebApi.ModelBinders;

namespace Turmerik.LocalFilesExplorer.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class FilesControllerBase : ControllerBase
    {
        private readonly IDriveExplorerService driveExplorerService;

        public FilesControllerBase(
            IDriveExplorerService driveExplorerService)
        {
            this.driveExplorerService = driveExplorerService ?? throw new ArgumentNullException(
                nameof(driveExplorerService));
        }

        [HttpGet]
        [Route("file-text-contents")]
        public async Task<IActionResult> GetFileTextContents(
            [FromQuery][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FileExistsAsync(driveItem.Idnf))
                {
                    var textContent = await driveExplorerService.GetFileTextAsync(driveItem.Idnf);
                    actionResult = Ok(textContent);
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpGet]
        [Route("root-folder-entries")]
        public async Task<IActionResult> GetRootFolderEntries()
        {
            IActionResult actionResult;

            try
            {
                var driveItem = await driveExplorerService.GetFolderAsync(string.Empty, false);
                actionResult = Ok(driveItem);
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpGet]
        [Route("folder-entries")]
        public async Task<IActionResult> GetFolderEntries(
            [FromQuery][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (string.IsNullOrWhiteSpace(driveItem.Idnf))
                {
                    driveItem.Idnf = ".";
                }

                if (await driveExplorerService.FolderExistsAsync(driveItem.Idnf))
                {
                    driveItem = await driveExplorerService.GetFolderAsync(driveItem.Idnf, null);
                    actionResult = Ok(driveItem);
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpPost]
        [Route("create-text-file")]
        public async Task<IActionResult> CreateTextFile(
            [FromBody][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.PrIdnf))
                {
                    driveItem = await driveExplorerService.CreateTextFileAsync(
                        driveItem.PrIdnf,
                        driveItem.Name,
                        driveItem.TextFileContents ?? string.Empty);

                    driveItem.TextFileContents = null;
                    actionResult = Ok(driveItem);
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpPost]
        [Route("create-folder")]
        public async Task<IActionResult> CreateFolder(
            [FromBody][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.PrIdnf))
                {
                    driveItem = await driveExplorerService.CreateFolderAsync(
                        driveItem.PrIdnf,
                        driveItem.Name,
                        null);

                    actionResult = Ok(driveItem);
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpDelete]
        [Route("delete-file")]
        public async Task<IActionResult> DeleteFile(
            [FromQuery][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FileExistsAsync(driveItem.Idnf))
                {
                    await driveExplorerService.DeleteFileAsync(driveItem.Idnf);
                    actionResult = Ok();
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpDelete]
        [Route("delete-folder")]
        public async Task<IActionResult> DeleteFolder(
            [FromQuery][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.Idnf))
                {
                    await driveExplorerService.DeleteFolderAsync(driveItem.Idnf, null);
                    actionResult = Ok();
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpPatch]
        [Route("move-file")]
        public async Task<IActionResult> MoveFile(
            [FromBody][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FileExistsAsync(
                    driveItem.Idnf) && await driveExplorerService.FolderExistsAsync(
                    driveItem.PrIdnf))
                {
                    driveItem = await driveExplorerService.MoveFileAsync(
                        driveItem.Idnf,
                        driveItem.PrIdnf,
                        driveItem.Name);

                    actionResult = Ok();
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpPatch]
        [Route("move-folder")]
        public async Task<IActionResult> MoveFolder(
            [FromBody][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(
                    driveItem.Idnf) && await driveExplorerService.FolderExistsAsync(
                    driveItem.PrIdnf))
                {
                    driveItem = await driveExplorerService.MoveFolderAsync(
                        driveItem.Idnf,
                        driveItem.PrIdnf,
                        driveItem.Name,
                        null);

                    actionResult = Ok();
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpPatch]
        [Route("rename-file")]
        public async Task<IActionResult> RenameFile(
            [FromBody][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FileExistsAsync(driveItem.Idnf))
                {
                    driveItem = await driveExplorerService.RenameFileAsync(
                        driveItem.Idnf,
                        driveItem.Name);

                    actionResult = Ok();
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpPatch]
        [Route("rename-folder")]
        public async Task<IActionResult> RenameFolder(
            [FromBody][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.Idnf))
                {
                    driveItem = await driveExplorerService.RenameFolderAsync(
                        driveItem.Idnf,
                        driveItem.Name,
                        null);

                    actionResult = Ok();
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpPatch]
        [Route("copy-file")]
        public async Task<IActionResult> CopyFile(
            [FromBody][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FileExistsAsync(driveItem.Idnf))
                {
                    driveItem = await driveExplorerService.CopyFileAsync(
                        driveItem.Idnf,
                        driveItem.PrIdnf,
                        driveItem.Name);

                    actionResult = Ok();
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        [HttpPatch]
        [Route("copy-folder")]
        public async Task<IActionResult> CopyFolder(
            [FromBody][ModelBinder(BinderType = typeof(AcceptMissingPropsModelBinder<DriveItemCore>))] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.Idnf))
                {
                    driveItem = await driveExplorerService.CopyFolderAsync(
                        driveItem.Idnf,
                        driveItem.PrIdnf,
                        driveItem.Name,
                        null);

                    actionResult = Ok();
                }
                else
                {
                    actionResult = NotFound();
                }
            }
            catch (Exception exc)
            {
                actionResult = GetErrorActionResult(exc);
            }

            return actionResult;
        }

        private IActionResult GetErrorActionResult(
            Exception exc) => StatusCode(
                (int)HttpStatusCode.InternalServerError,
                exc.Message);
    }
}
