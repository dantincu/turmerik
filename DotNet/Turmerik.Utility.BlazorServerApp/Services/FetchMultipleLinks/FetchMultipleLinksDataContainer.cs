using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Utility.BlazorServerApp.Services.FetchMultipleLinks
{
    public interface IFetchMultipleLinksDataContainer : IAppDataCore<FetchMultipleLinksDataImmtbl, FetchMultipleLinksDataMtbl>
    {
    }

    public class FetchMultipleLinksDataContainer : AppDataCoreBase<FetchMultipleLinksDataImmtbl, FetchMultipleLinksDataMtbl>, IFetchMultipleLinksDataContainer
    {
        public FetchMultipleLinksDataContainer(
            IJsonConversion jsonConversion,
            IAppEnv appEnv) : base(jsonConversion, appEnv)
        {
        }

        protected override FetchMultipleLinksDataMtbl GetDefaultConfigCore() => new();

        protected override FetchMultipleLinksDataImmtbl NormalizeConfig(
            FetchMultipleLinksDataMtbl config) => new(config);

        protected override FetchMultipleLinksDataMtbl SerializeConfig(
            FetchMultipleLinksDataImmtbl config) => new(config);
    }
}
