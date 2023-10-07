using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.Text;

namespace Turmerik.MkFsBackup.ConsoleApp
{
    public class AppConfig : AppConfigCoreBase<AppSettings, AppSettingsMtbl>
    {
        public AppConfig(IJsonConversion jsonConversion, IAppEnv appEnv) : base(jsonConversion, appEnv)
        {
        }

        protected override AppSettingsMtbl GetDefaultConfig(
            ) => throw new NotSupportedException($"Default config is not supported for {GetType().Assembly.FullName}");

        protected override AppSettings NormalizeConfig(AppSettingsMtbl config)
        {
            throw new NotImplementedException();
        }
    }
}
