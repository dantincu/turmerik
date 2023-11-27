using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Helpers;

namespace Turmerik.Notes.Settings
{
    public interface IAppConfigService<TImmtblData>
    {
        TImmtblData Data { get; }
    }

    public class AppConfigService<TImmtblData, TMtblData> : IAppConfigService<TImmtblData>
    {
        private readonly IJsonConversion jsonConversion;
        private readonly Func<TMtblData, TImmtblData> normalizerFunc;

        public AppConfigService(
            IJsonConversion jsonConversion,
            Func<TMtblData, TImmtblData> normalizerFunc)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.normalizerFunc = normalizerFunc ?? throw new ArgumentNullException(
                nameof(normalizerFunc));

            Data = Load();
        }

        public TImmtblData Data { get; }

        protected virtual string AppSettingsFileName => "trmrk-notes-config.json";

        protected virtual TImmtblData Load()
        {
            var mtblData = LoadMtbl();
            var data = normalizerFunc(mtblData);

            return data;
        }

        protected virtual TMtblData LoadMtbl()
        {
            string json = File.ReadAllText(AppSettingsFileName);
            var mtblData = jsonConversion.Adapter.Deserialize<TMtblData>(json);

            return mtblData;
        }
    }
}
