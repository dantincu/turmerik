using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.AppSettings;
using Turmerik.Notes.Settings;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Controllers
{
    public class MvcController : Controller
    {
        private readonly IAppConfigService<AppConfigCoreImmtbl> appSettingsRetriever;

        public MvcController(IAppConfigService<AppConfigCoreImmtbl> appSettingsRetriever)
        {
            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(nameof(appSettingsRetriever));
        }

        public IActionResult RedirectToClientHost()
        {
            return Redirect(appSettingsRetriever.Data.ClientRedirectUrl);
        }
    }
}
