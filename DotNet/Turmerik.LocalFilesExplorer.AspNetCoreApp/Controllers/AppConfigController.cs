using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Turmerik.Core.Utility;
using Turmerik.LocalFilesExplorer.AspNetCoreApp.Settings;
using Turmerik.Notes.Core;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppConfigController : ControllerBase
    {
        private readonly IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever;

        public AppConfigController(
            IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever)
        {
            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(nameof(appSettingsRetriever));
        }

        [HttpGet]
        public ClientAppConfigCore Get() => new ClientAppConfigCore
        {
            TrmrkPfx = Trmrk.TrmrkPfx,
            IsDevEnv = appSettingsRetriever.Data.IsDevEnv,
            RequiredClientVersion = appSettingsRetriever.Data.RequiredClientVersion
        };
    }
}
