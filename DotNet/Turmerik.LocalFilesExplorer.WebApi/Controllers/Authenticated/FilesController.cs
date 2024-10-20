using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.LocalFilesExplorer.WebApi.Controllers.Authenticated
{
    [Authorize]
    public class FilesController : FilesControllerBase
    {
        public FilesController(
            IDriveExplorerService driveExplorerService) : base(
                driveExplorerService)
        {
        }
    }
}
