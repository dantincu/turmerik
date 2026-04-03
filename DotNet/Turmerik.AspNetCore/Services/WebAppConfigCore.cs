using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.AspNetCore.Services
{
    public interface IWebAppConfigCore
    {
        int RequiredClientVersion { get; }
    }

    public class WebAppConfigCoreImmtbl : IWebAppConfigCore
    {
        public WebAppConfigCoreImmtbl(IWebAppConfigCore src)
        {
            this.RequiredClientVersion = src.RequiredClientVersion;
        }

        public int RequiredClientVersion { get; init; }
    }

    public class WebAppConfigCoreMtbl : IWebAppConfigCore
    {
        public WebAppConfigCoreMtbl()
        {
        }

        public WebAppConfigCoreMtbl(IWebAppConfigCore src)
        {
            this.RequiredClientVersion = src.RequiredClientVersion;
        }

        public int RequiredClientVersion { get; set; }
    }

    public abstract class WebAppConfigCore<TWebAppConfigCoreImmtbl, TWebAppConfigCoreMtbl> : AppConfigCoreBase<TWebAppConfigCoreImmtbl, TWebAppConfigCoreMtbl>
        where TWebAppConfigCoreImmtbl : class, IWebAppConfigCore
        where TWebAppConfigCoreMtbl : class, IWebAppConfigCore
    {
        public WebAppConfigCore(
            IJsonConversion jsonConversion,
            IAppEnv appEnv) : base(
                jsonConversion,
                appEnv)
        {
        }

        protected override TWebAppConfigCoreMtbl GetDefaultConfig(
            ) => throw new NotSupportedException();

        protected override TWebAppConfigCoreImmtbl NormalizeConfig(
            TWebAppConfigCoreMtbl config) => ActivatorH.CreateFromSrc<TWebAppConfigCoreImmtbl>(config);

        protected override string GetJsonFilePath()
        {
            return "app-config.json";
        }
    }
}
