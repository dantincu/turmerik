using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Utility.WinFormsApp.Settings
{
    public interface IAppSettings : IAppDataCore<AppSettingsDataImmtbl, AppSettingsDataMtbl>
    {
    }

    public class AppSettings : AppDataCoreBase<AppSettingsDataImmtbl, AppSettingsDataMtbl>, IAppSettings
    {
        public AppSettings(
            IJsonConversion jsonConversion,
            IAppEnv appEnv) : base(jsonConversion, appEnv)
        {
        }

        protected override AppSettingsDataMtbl GetDefaultConfigCore(
            ) => new AppSettingsDataMtbl
            {
                FetchWebResource = new AppSettingsData.FetchWebResourceMtbl()
            };

        protected override AppSettingsDataImmtbl NormalizeConfig(
            AppSettingsDataMtbl config) => new AppSettingsDataImmtbl(config);

        protected override AppSettingsDataMtbl SerializeConfig(
            AppSettingsDataImmtbl config) => new AppSettingsDataMtbl(config);
    }
}
