using Microsoft.AspNetCore.Mvc;
using System.Net;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Api
{
    public abstract class DriveItemControllerBase : TrmrkControllerBase
    {
        protected DriveItemControllerBase(
            IDriveExplorerService driveExplorerService)
        {
            DriveExplorerService = driveExplorerService ?? throw new ArgumentNullException(nameof(driveExplorerService));
        }

        protected IDriveExplorerService DriveExplorerService { get; }
    }
}
