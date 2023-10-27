using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.AppSettings;
using Turmerik.Notes.AspNetCore.Settings;
using Turmerik.Utility;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppSettingsController : ApiControllerBase
    {
        private readonly IAppSettingsService<AppSettingsCoreImmtbl> appSettingsRetriever;

        public AppSettingsController(
            IAppSettingsService<AppSettingsCoreImmtbl> appSettingsRetriever)
        {
            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(nameof(appSettingsRetriever));
        }

        [HttpGet]
        public ClientAppSettingsCore Get() => new ClientAppSettingsCore
        {
            TrmrkPfx = Trmrk.TrmrkPfx,
            IsDevEnv = appSettingsRetriever.Data.IsDevEnv,
            RequiredClientVersion = appSettingsRetriever.Data.RequiredClientVersion
        };
    }
}
