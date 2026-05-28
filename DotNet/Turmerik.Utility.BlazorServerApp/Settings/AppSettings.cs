using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Utility.BlazorServerApp.Settings
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

        protected override AppSettingsDataMtbl GetDefaultConfigCore() => new()
        {
            FetchWebResource = new AppSettingsData.FetchWebResourceMtbl
            {
                MdLinkTemplate = "[{0}]({1})"
            },
            NameToIdnfConverter = new AppSettingsData.NameToIdnfConverterMtbl(),
            PathConverter = new AppSettingsData.PathConverterMtbl(),
            TextToMd = new AppSettingsData.TextToMdMtbl()
        };

        protected override AppSettingsDataImmtbl NormalizeConfig(
            AppSettingsDataMtbl config) => new(config);

        protected override AppSettingsDataMtbl SerializeConfig(
            AppSettingsDataImmtbl config) => new(config);
    }
}
