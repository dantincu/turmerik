using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.AspNetCore.AppSettings;
using Turmerik.AspNetCore.Utility;
using Turmerik.Notes.AspNetCore.Settings;

namespace Turmerik.Notes.AspNetCore.Filters
{
    public class RequiredClientVersionFilter : IActionFilter
    {
        public const string CLIENT_VERSION_HEADER_NAME = "trmrk-client-version";

        private readonly IAppSettingsService<AppSettingsCoreImmtbl> appSettingsRetriever;

        public RequiredClientVersionFilter(
            IAppSettingsService<AppSettingsCoreImmtbl> appSettingsRetriever)
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
                var clientVersionStr = context.HttpContext.Request.Headers[CLIENT_VERSION_HEADER_NAME].ToString();

                if (int.TryParse(clientVersionStr, out var clientVersionNum) || clientVersionNum < appSettingsRetriever.Data.RequiredClientVersion)
                {
                    context.HttpContext.Response.StatusCode = StatusCodesH.STATUS_428_PRECONDITION_REQUIRED;
                }
            }
        }
    }
}
