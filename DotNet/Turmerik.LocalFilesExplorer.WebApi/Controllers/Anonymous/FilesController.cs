using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.LocalFilesExplorer.WebApi.Controllers.Anonymous
{
    public class FilesController : FilesControllerBase
    {
        public FilesController(
            IDriveExplorerService driveExplorerService) : base(
                driveExplorerService)
        {
        }
    }
}
