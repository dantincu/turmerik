using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.LocalDeviceEnv;
using Turmerik.TextSerialization;

namespace Turmerik.LocalFileNotes.WinFormsApp.Settings
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
                ReopenNoteBookBehaviorType = ReopenNoteBookBehaviorType.Unspecified
            };

        protected override AppSettingsDataImmtbl NormalizeConfig(
            AppSettingsDataMtbl config) => new AppSettingsDataImmtbl(config);

        protected override AppSettingsDataMtbl SerializeConfig(
            AppSettingsDataImmtbl config) => new AppSettingsDataMtbl(config);
    }
}
