﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Core.LocalDeviceEnv
{
    public interface IAppConfigCore<TImmtbl, TMtblSrlzbl> : IDisposable
        where TImmtbl : class
    {
        string JsonDirPath { get; }
        string JsonFilePath { get; }
        TImmtbl Data { get; }

        event Action<TImmtbl> DataLoaded;

        TImmtbl LoadData();
    }

    public static class AppConfigCore
    {
        public const string JSON_FILE_NAME = "data.json";
    }

    public abstract class AppConfigCoreBase<TImmtbl, TMtblSrlzbl> : IAppConfigCore<TImmtbl, TMtblSrlzbl>
        where TImmtbl : class
    {
        public const string JSON_FILE_NAME = AppConfigCore.JSON_FILE_NAME;

        private Action<TImmtbl> dataLoaded;

        protected AppConfigCoreBase(
            IJsonConversion jsonConversion,
            IAppEnv appEnv)
        {
            JsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            AppEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            JsonDirPath = GetJsonDirPath();
            JsonFilePath = GetJsonFilePath();

            Mutex = MutexH.Create(JsonFilePath);
            ThisType = GetType();
        }

        public string JsonDirPath { get; }
        public string JsonFilePath { get; }

        public TImmtbl Data => DataCore ?? LoadDataObj();

        protected IJsonConversion JsonConversion { get; }
        protected IAppEnv AppEnv { get; }

        protected TImmtbl DataCore { get; set; }

        protected Mutex Mutex { get; }

        protected Type ThisType { get; }

        public event Action<TImmtbl> DataLoaded
        {
            add => dataLoaded += value;
            remove => dataLoaded -= value;
        }

        public void Dispose()
        {
            Mutex.Dispose();
            Disposed();
        }

        public TImmtbl LoadData() => LoadDataObj();

        protected abstract TMtblSrlzbl GetDefaultConfig();
        protected abstract TImmtbl NormalizeConfig(TMtblSrlzbl config);

        protected virtual string GetJsonDirPath() => AppEnv.GetTypePath(
            AppEnvDir.Config,
            GetType());

        protected virtual string GetJsonFilePath() => Path.Combine(
            JsonDirPath, JSON_FILE_NAME);

        protected virtual TImmtbl LoadDataObjCore()
        {
            TMtblSrlzbl dataMtblSrlzbl = LoadJsonCore(
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

        protected virtual SrlzblData LoadJsonCore<SrlzblData>(
            Func<SrlzblData> defaultValueFactory)
        {
            SrlzblData srlzblData;
            string json = null;
            Mutex.WaitOne();

            try
            {
                if (File.Exists(JsonFilePath))
                {
                    json = ReadJsonFromFile();
                }
            }
            finally
            {
                Mutex.ReleaseMutex();
            }

            if (json != null)
            {
                srlzblData = JsonConversion.Adapter.Deserialize<SrlzblData>(
                    json, false);
            }
            else
            {
                srlzblData = defaultValueFactory();
            }

            return srlzblData;
        }

        protected SrlzblData LoadJsonCore<SrlzblData>(
            string jsonFilePath,
            Func<SrlzblData> defaultValueFactory)
        {
            SrlzblData srlzblData;

            if (File.Exists(jsonFilePath))
            {
                string json = File.ReadAllText(
                    jsonFilePath);

                srlzblData = JsonConversion.Adapter.Deserialize<SrlzblData>(
                    json, false);
            }
            else
            {
                srlzblData = defaultValueFactory();
            }

            return srlzblData;
        }

        protected virtual string ReadJsonFromFile(
            ) => File.ReadAllText(
                JsonFilePath);

        protected virtual void Disposed()
        {
        }
    }
}
