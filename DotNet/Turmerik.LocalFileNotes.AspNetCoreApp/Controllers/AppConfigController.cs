﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Turmerik.AspNetCore.AppSettings;
using Turmerik.Notes.AspNetCore.Settings;
using Turmerik.Notes.Settings;
using Turmerik.Utility;

namespace Turmerik.LocalFileNotes.AspNetCoreApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppConfigController : ApiControllerBase
    {
        private readonly IAppConfigService<AppConfigCoreImmtbl> appSettingsRetriever;

        public AppConfigController(
            IAppConfigService<AppConfigCoreImmtbl> appSettingsRetriever)
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