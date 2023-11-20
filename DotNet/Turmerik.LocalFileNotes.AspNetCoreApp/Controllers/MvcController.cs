using Microsoft.AspNetCore.Mvc;
using Turmerik.Notes.Settings;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Controllers
{
    public class MvcController : Controller
    {
        private readonly IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever;

        public MvcController(IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever)
        {
            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(nameof(appSettingsRetriever));
        }

        public IActionResult RedirectToClientHost()
        {
            return Redirect(appSettingsRetriever.Data.ClientRedirectUrl);
        }
    }
}
