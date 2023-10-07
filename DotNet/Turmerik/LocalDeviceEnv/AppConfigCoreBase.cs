using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Turmerik.Text;

namespace Turmerik.LocalDevice.Core.Env
{
    public interface IAppConfigCore<TImmtbl, TMtblSrlzbl>
        where TImmtbl : class
    {
        string JsonDirPath { get; }
        string JsonFilePath { get; }
        TImmtbl Data { get; }

        event Action<TImmtbl> DataLoaded;

        TImmtbl LoadData();
    }

    public abstract class AppConfigCoreBase<TImmtbl, TMtblSrlzbl> : IAppConfigCore<TImmtbl, TMtblSrlzbl>
        where TImmtbl : class
    {
        public const string JSON_FILE_NAME = "data.json";

        private Action<TImmtbl> dataLoaded;

        protected AppConfigCoreBase(
            IJsonConversion jsonConversion,
            IAppEnv appEnv)
        {
            this.JsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            AppEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            JsonDirPath = GetJsonDirPath();
            JsonFilePath = GetJsonFilePath();
        }

        public string JsonDirPath { get; }
        public string JsonFilePath { get; }

        public TImmtbl Data => DataCore ?? LoadDataObj();

        protected IJsonConversion JsonConversion { get; }
        protected IAppEnv AppEnv { get; }

        protected TImmtbl DataCore { get; set; }

        public event Action<TImmtbl> DataLoaded
        {
            add => dataLoaded += value;
            remove => dataLoaded -= value;
        }

        public TImmtbl LoadData() => LoadDataObj();

        protected abstract TMtblSrlzbl GetDefaultConfig();
        protected abstract TImmtbl NormalizeConfig(TMtblSrlzbl config);

        protected virtual string GetJsonDirPath() => AppEnv.GetTypePath(
            AppEnvDir.Config,
            GetType());

        protected virtual string GetJsonFilePath() => AppEnv.GetTypePath(
            AppEnvDir.Config,
            GetType(),
            JSON_FILE_NAME);

        protected virtual TImmtbl LoadDataObjCore()
        {
            TMtblSrlzbl dataMtblSrlzbl = LoadJsonCore(
                JsonFilePath,
                GetDefaultConfig);

            var data = NormalizeConfig(dataMtblSrlzbl);
            return data;
        }

        protected void OnDataLoaded(TImmtbl data) => dataLoaded?.Invoke(data);

        protected TImmtbl LoadDataObj()
        {
            var data = LoadDataObjCore();

            DataCore = data;
            OnDataLoaded(data);

            return data;
        }

        protected SrlzblData LoadJsonCore<SrlzblData>(
            string jsonFilePath,
            Func<SrlzblData> defaultValueFactory)
        {
            SrlzblData srlzblData;

            if (File.Exists(jsonFilePath))
            {
                string json = File.ReadAllText(jsonFilePath);

                srlzblData = JsonConversion.Adapter.Deserialize<SrlzblData>(
                    json, false);
            }
            else
            {
                srlzblData = defaultValueFactory();
            }

            return srlzblData;
        }

        protected void SaveJsonCore(
            object obj,
            string jsonFilePath)
        {
            string json = JsonConversion.Adapter.Serialize(
                obj, false);

            Directory.CreateDirectory(JsonDirPath);
            File.WriteAllText(jsonFilePath, json);
        }
    }
}
