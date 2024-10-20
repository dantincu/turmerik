using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.LocalFilesExplorer.WebApi.Controllers.Anonymous
{
    [AllowAnonymous]
    public class FilesController : FilesControllerBase
    {
        public FilesController(
            IDriveExplorerService driveExplorerService) : base(
                driveExplorerService)
        {
        }
    }
}
