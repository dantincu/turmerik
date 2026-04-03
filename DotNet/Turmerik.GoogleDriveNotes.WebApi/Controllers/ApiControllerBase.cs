using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.Controllers;
using Turmerik.AspNetCore.Services;
using Turmerik.Core.Utility;
using Turmerik.GoogleDriveNotes.WebApi.Services;
using TrmrkActions = Turmerik.Core.Actions;

namespace Turmerik.GoogleDriveNotes.WebApi.Controllers
{
    public abstract class ApiControllerBase : ApiControllerCoreBase
    {
        protected readonly WebAppConfig appConfig;

        protected ApiControllerBase(
            WebAppConfig appConfig)
        {
            this.appConfig = appConfig ?? throw new ArgumentNullException(
                nameof(appConfig));
        }

        protected override WebAppConfigCoreImmtbl AppConfig => appConfig.Data;
    }
}
