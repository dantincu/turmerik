using Turmerik.AspNetCore.Services;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.GoogleDriveNotes.WebApi.Services
{
    public interface IWebAppConfigData : IWebAppConfigCore
    {
    }

    public class WebAppConfigDataImmtbl : WebAppConfigCoreImmtbl, IWebAppConfigData
    {
        public WebAppConfigDataImmtbl(IWebAppConfigData src) : base(src)
        {
        }
    }

    public class WebAppConfigDataMtbl : WebAppConfigCoreMtbl, IWebAppConfigData
    {
        public WebAppConfigDataMtbl()
        {
        }

        public WebAppConfigDataMtbl(IWebAppConfigData src) : base(src)
        {
        }
    }

    public class WebAppConfig : WebAppConfigCore<WebAppConfigDataImmtbl, WebAppConfigDataMtbl>
    {
        public WebAppConfig(
            IJsonConversion jsonConversion,
            IAppEnv appEnv) : base(
                jsonConversion,
                appEnv)
        {
        }
    }
}
