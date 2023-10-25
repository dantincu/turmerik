using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.AppSettings;
using Turmerik.Notes.AspNetCore.Settings;
using Turmerik.Utility;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppSettingsController : ControllerBase
    {
        private readonly IAppSettingsRetriever<AppSettingsCoreImmtbl> appSettingsRetriever;

        public AppSettingsController(
            IAppSettingsRetriever<AppSettingsCoreImmtbl> appSettingsRetriever)
        {
            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(nameof(appSettingsRetriever));
        }

        [HttpGet]
        public ClientAppSettingsCore Get() => new ClientAppSettingsCore
        {
            TrmrkPfx = Trmrk.TrmrkPfx
        };
    }
}
