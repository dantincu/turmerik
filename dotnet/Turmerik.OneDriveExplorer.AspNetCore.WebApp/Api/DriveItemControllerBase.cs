using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Api
{
    public abstract class DriveItemControllerBase : ControllerBase
    {
        protected DriveItemControllerBase(
            IDriveExplorerService driveExplorerService)
        {
            DriveExplorerService = driveExplorerService ?? throw new ArgumentNullException(nameof(driveExplorerService));
        }

        protected IDriveExplorerService DriveExplorerService { get; }
    }
}
