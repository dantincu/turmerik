using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.Utility;
using Turmerik.Notes.Core;
using Turmerik.Notes.Settings;

namespace Turmerik.Notes.AspNetCore.Filters
{
    public class RequiredClientVersionFilter : IActionFilter
    {
        private readonly IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever;

        public RequiredClientVersionFilter(
            IAppConfigService<NotesAppConfigImmtbl> appSettingsRetriever)
        {
            this.appSettingsRetriever = appSettingsRetriever ?? throw new ArgumentNullException(nameof(appSettingsRetriever));
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!appSettingsRetriever.Data.IsDevEnv)
            {
                var clientVersionStr = context.HttpContext.Request.Headers[TrmrkHeaderNamesH.CLIENT_VERSION_HEADER_NAME].ToString();

                if (!int.TryParse(clientVersionStr, out var clientVersionNum) || clientVersionNum < appSettingsRetriever.Data.RequiredClientVersion)
                {
                    context.HttpContext.Response.StatusCode = StatusCodesH.STATUS_428_PRECONDITION_REQUIRED;
                    context.HttpContext.Response.Headers[TrmrkHeaderNamesH.REQUIRED_CLIENT_VERSION_HEADER_NAME] = appSettingsRetriever.Data.RequiredClientVersion.ToString();
                    context.HttpContext.Response.Headers[HeaderNamesH.ACCESS_CONTROL_EXPOSE_HEADERS] = TrmrkHeaderNamesH.REQUIRED_CLIENT_VERSION_HEADER_NAME;
                }
            }
        }
    }
}
