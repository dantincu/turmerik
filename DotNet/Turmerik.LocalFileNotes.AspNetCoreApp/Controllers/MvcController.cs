using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.AppSettings;
using Turmerik.Notes.AspNetCore.Settings;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Controllers
{
    public class MvcController : Controller
    {
        private readonly IAppSettingsRetriever<AppSettingsCoreImmtbl> appSettingsRetriever;

        public MvcController(IAppSettingsRetriever<AppSettingsCoreImmtbl> appSettingsRetriever)
        {
            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(nameof(appSettingsRetriever));
        }

        public IActionResult RedirectToClientHost()
        {
            return Redirect(appSettingsRetriever.Data.ClientRedirectUrl);
        }
    }
}
