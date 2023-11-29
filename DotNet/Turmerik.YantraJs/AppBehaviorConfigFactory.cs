using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.YantraJs
{
    public class AppBehaviorConfigFactory
    {
        private readonly IJsContextAdapterFactory jsContextAdapterFactory;
        private readonly IJsonConversion jsonConversion;
        private readonly IAppEnv appEnv;

        public AppBehaviorConfigFactory(
            IJsContextAdapterFactory jsContextAdapterFactory,
            IJsonConversion jsonConversion,
            IAppEnv appEnv)
        {
            this.jsContextAdapterFactory = jsContextAdapterFactory ?? throw new ArgumentNullException(nameof(jsContextAdapterFactory));
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
            this.appEnv = appEnv ?? throw new ArgumentNullException(nameof(appEnv));
        }

        public AppBehaviorConfig<TExportsImmtbl, TExportsMtbl> Create<TExportsImmtbl, TExportsMtbl>(
            JsContextAdapterOpts<TExportsImmtbl, TExportsMtbl> jsAdapterOpts) => new AppBehaviorConfig<TExportsImmtbl, TExportsMtbl>(
                jsContextAdapterFactory,
                jsonConversion,
                appEnv,
                jsAdapterOpts);
    }
}
