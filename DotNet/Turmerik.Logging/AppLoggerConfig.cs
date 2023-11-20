using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.TextSerialization;

namespace Turmerik.Logging
{
    public interface IAppLoggerConfig : IAppConfigCore<AppLoggerConfigData.Immtbl, AppLoggerConfigData.Mtbl>
    {
    }

    public class AppLoggerConfig : AppConfigCoreBase<AppLoggerConfigData.Immtbl, AppLoggerConfigData.Mtbl>, IAppLoggerConfig
    {
        public AppLoggerConfig(
            IJsonConversion jsonConversion,
            IAppEnv appEnv) : base(
                jsonConversion,
                appEnv)
        {
        }

        protected override AppLoggerConfigData.Mtbl GetDefaultConfig() => new AppLoggerConfigData.Mtbl
        {
            MinLogLevel = LogLevel.Information
        };

        protected override AppLoggerConfigData.Immtbl NormalizeConfig(
            AppLoggerConfigData.Mtbl config) => new AppLoggerConfigData.Immtbl(config);
    }
}
