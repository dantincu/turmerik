using Microsoft.AspNetCore.Http;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.Utility;
using Turmerik.LocalFilesExplorer.AspNetCoreApp.Settings;
using Turmerik.Notes.Core;
using Turmerik.NetCore.Utility;
using Turmerik.AspNetCore.UserSessions;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AppConfigController : ControllerBase
    {
        private readonly IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever;
        private readonly IUsersManager usersManager;

        public AppConfigController(
            IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever,
            IUsersManager usersManager)
        {
            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(
                nameof(appSettingsRetriever));

            this.usersManager = usersManager ?? throw new ArgumentNullException(
                nameof(usersManager));
        }

        [Route("/api/[controller]")]
        [HttpGet]
        public Task<ClientAppConfig> Get() => GetCore();

        /* [HttpPost]
        public void GCCollect() => GC.Collect(); */

        private async Task<ClientAppConfig> GetCore() => new ClientAppConfig
        {
            TrmrkPfx = Trmrk.TrmrkPfx,
            IsDevEnv = appSettingsRetriever.Data.IsDevEnv,
            RequiredClientVersion = appSettingsRetriever.Data.RequiredClientVersion,
            NoteDirPairs = appSettingsRetriever.Data.NoteDirPairs,
            InvalidFileNameChars = PathH.InvalidFileNameCharsExclSep,
            PathSep = PathH.AltDirSepChar,
            AltPathSep = PathH.AltDirSepChar,
            IsWinOS = LocalDeviceH.IsWinOS,
            IsLocalFileNotesApp = true,
            ClientUserUuid = (await HttpContext.GetLocalFilesUserIdnfAsync(usersManager)).UserUuid.ToString("N"),
        };

        private async Task<ClientAppConfig> GetForCloudStorageCore() => new ClientAppConfig
        {
            TrmrkPfx = Trmrk.TrmrkPfx,
            IsDevEnv = appSettingsRetriever.Data.IsDevEnv,
            RequiredClientVersion = appSettingsRetriever.Data.RequiredClientVersion,
            NoteDirPairs = appSettingsRetriever.Data.NoteDirPairs,
            InvalidFileNameChars = PathH.InvalidFileNameChars.Except(['/']).RdnlC(),
            PathSep = "/",
            AltPathSep = PathH.AltDirSepChar,
            // IsWinOS = LocalDeviceH.IsWinOS,
            IsLocalFileNotesApp = false,
            ClientUserUuid = (await HttpContext.GetLocalFilesUserIdnfAsync(usersManager)).UserUuid.ToString("N"),
        };
    }
}
