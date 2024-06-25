using Json.More;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.LocalFilesExplorer.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IDriveExplorerService driveExplorerService;

        public FilesController(
            IDriveExplorerService driveExplorerService)
        {
            this.driveExplorerService = driveExplorerService ?? throw new ArgumentNullException(
                nameof(driveExplorerService));
        }

        [HttpGet]
        [Route("api/[controller]/file-text-contents")]
        public async Task<IActionResult> GetFileTextContents(
            [FromQuery] DriveItemCore driveItem)
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
        [Route("api/[controller]/folder-entries")]
        public async Task<IActionResult> GetFolderEntries(
            [FromQuery] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.Idnf))
                {
                    driveItem = await driveExplorerService.GetFolderAsync(driveItem.Idnf, false);
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
        [Route("api/[controller]/create-text-file")]
        public async Task<IActionResult> CreateTextFile(
            [FromBody] DriveItemCore driveItem)
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
        [Route("api/[controller]/create-folder")]
        public async Task<IActionResult> CreateFolder(
            [FromBody] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.PrIdnf))
                {
                    driveItem = await driveExplorerService.CreateFolderAsync(
                        driveItem.PrIdnf,
                        driveItem.Name,
                        false);

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
        [Route("api/[controller]/delete-file")]
        public async Task<IActionResult> DeleteFile(
            [FromQuery] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.Idnf))
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
        [Route("api/[controller]/delete-folder")]
        public async Task<IActionResult> DeleteFolder(
            [FromQuery] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.Idnf))
                {
                    await driveExplorerService.DeleteFolderAsync(driveItem.Idnf, false);
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
        [Route("api/[controller]/move-file")]
        public async Task<IActionResult> MoveFile(
            [FromBody] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(
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
        [Route("api/[controller]/move-folder")]
        public async Task<IActionResult> MoveFolder(
            [FromBody] DriveItemCore driveItem)
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
                        false);

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
        [Route("api/[controller]/rename-file")]
        public async Task<IActionResult> RenameFile(
            [FromBody] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.Idnf))
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
        [Route("api/[controller]/rename-folder")]
        public async Task<IActionResult> RenameFolder(
            [FromBody] DriveItemCore driveItem)
        {
            IActionResult actionResult;

            try
            {
                if (await driveExplorerService.FolderExistsAsync(driveItem.Idnf))
                {
                    driveItem = await driveExplorerService.RenameFolderAsync(
                        driveItem.Idnf,
                        driveItem.Name,
                        false);

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
