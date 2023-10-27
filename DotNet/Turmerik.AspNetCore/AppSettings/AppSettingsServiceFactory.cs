using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;
using Turmerik.Text;

namespace Turmerik.AspNetCore.AppSettings
{
    public interface IAppSettingsServiceFactory
    {
        IAppSettingsService<TImmtblData> Service<TImmtblData, TMtblData>(
            Func<TMtblData, TImmtblData> normalizerFunc = null);
    }

    public class AppSettingsServiceFactory : IAppSettingsServiceFactory
    {
        private readonly IJsonConversion jsonConversion;

        public AppSettingsServiceFactory(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
        }

        public IAppSettingsService<TImmtblData> Service<TImmtblData, TMtblData>(
            Func<TMtblData, TImmtblData> normalizerFunc = null) => new AppSettingsService<TImmtblData, TMtblData>(
                jsonConversion, normalizerFunc.FirstNotNull(
                    src => src.CreateFromSrc<TImmtblData>()));
    }
}
