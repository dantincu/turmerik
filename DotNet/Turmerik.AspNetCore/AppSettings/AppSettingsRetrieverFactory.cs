using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;
using Turmerik.Text;

namespace Turmerik.AspNetCore.AppSettings
{
    public interface IAppSettingsRetrieverFactory
    {
        IAppSettingsRetriever<TImmtblData> Retriever<TImmtblData, TMtblData>(
            Func<TMtblData, TImmtblData> normalizerFunc = null);
    }

    public class AppSettingsRetrieverFactory : IAppSettingsRetrieverFactory
    {
        private readonly IJsonConversion jsonConversion;

        public AppSettingsRetrieverFactory(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
        }

        public IAppSettingsRetriever<TImmtblData> Retriever<TImmtblData, TMtblData>(
            Func<TMtblData, TImmtblData> normalizerFunc = null) => new AppSettingsRetriever<TImmtblData, TMtblData>(
                jsonConversion, normalizerFunc.FirstNotNull(
                    src => src.CreateFromSrc<TImmtblData>()));
    }
}
