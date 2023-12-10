using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;

namespace Turmerik.LocalFilesExplorer.AspNetCoreApp.Settings
{
    public interface IAppConfigServiceFactory
    {
        IAppConfigService<TImmtblData> Service<TImmtblData, TMtblData>(
            Func<TMtblData, TImmtblData> normalizerFunc = null);
    }

    public class AppConfigServiceFactory : IAppConfigServiceFactory
    {
        private readonly IJsonConversion jsonConversion;

        public AppConfigServiceFactory(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
        }

        public IAppConfigService<TImmtblData> Service<TImmtblData, TMtblData>(
            Func<TMtblData, TImmtblData> normalizerFunc = null) => new AppConfigService<TImmtblData, TMtblData>(
                jsonConversion, normalizerFunc.FirstNotNull(
                    src => src.CreateFromSrc<TImmtblData>()));
    }
}
