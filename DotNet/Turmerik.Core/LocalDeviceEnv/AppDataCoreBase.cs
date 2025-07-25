﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.FileSystem;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.Core.LocalDeviceEnv
{
    public interface IAppDataCore<TImmtbl, TMtblSrlzbl> : IAppConfigCore<TImmtbl, TMtblSrlzbl>
        where TImmtbl : class
    {
        string DefaultJsonFilePath { get; }
        string JsonDirRelPath { get; }

        event Action<TImmtbl> DataSaved;

        TImmtbl Update(RefAction<TMtblSrlzbl> updateAction);
        TImmtbl Update(Func<TMtblSrlzbl, TMtblSrlzbl> updateAction);
        TImmtbl Update(Action<TMtblSrlzbl> updateAction);

        TImmtbl ResetToDefault();
        void Delete();
    }

    public abstract class AppDataCoreBase<TImmtbl, TMtblSrlzbl> : AppConfigCoreBase<TImmtbl, TMtblSrlzbl>, IAppDataCore<TImmtbl, TMtblSrlzbl>
        where TImmtbl : class
    {
        private FileSystemWatcher jsonFileWatcher;

        private Action<TImmtbl> dataSaved;

        protected AppDataCoreBase(
            IJsonConversion jsonConversion,
            IAppEnv appEnv,
            string jsonDirRelPath = null) : base(
                jsonConversion,
                appEnv)
        {
            DefaultJsonFilePath = GetDefaultJsonFilePath();
            JsonDirRelPath = jsonDirRelPath ?? string.Empty;
        }

        public string DefaultJsonFilePath { get; }
        public string JsonDirRelPath { get; }

        public event Action<TImmtbl> DataSaved
        {
            add => dataSaved += value;
            remove => dataSaved -= value;
        }

        public virtual TImmtbl Update(
            RefAction<TMtblSrlzbl> updateAction)
        {
            var srlzblData = SerializeConfig(Data);
            updateAction(ref srlzblData);

            var data = NormalizeConfig(srlzblData);

            SaveJsonCore(
                srlzblData,
                JsonFilePath);

            DataCore = data;
            OnDataSaved(data);

            return data;
        }

        public TImmtbl Update(Func<TMtblSrlzbl, TMtblSrlzbl> updateAction) => Update(
            (ref TMtblSrlzbl srlzbl) =>
            {
                srlzbl = updateAction(srlzbl);
            });

        public TImmtbl Update(Action<TMtblSrlzbl> updateAction) => Update(
            (ref TMtblSrlzbl srlzbl) =>
            {
                updateAction(srlzbl);
            });

        public TImmtbl ResetToDefault() => Update((ref TMtblSrlzbl data) =>
        {
            data = GetDefaultConfig();
        });

        public void Delete()
        {
            Mutex.WaitOne();

            try
            {
                StopFileWatcherIfReq();
                Directory.Delete(JsonDirPath, true);
            }
            finally
            {
                Mutex.ReleaseMutex();
            }
        }

        protected abstract TMtblSrlzbl GetDefaultConfigCore();
        protected abstract TMtblSrlzbl SerializeConfig(TImmtbl config);

        protected override string GetJsonDirPath() => AppEnv.GetTypePath(
            AppEnvDir.Data,
            GetType());

        protected override TMtblSrlzbl GetDefaultConfig() => LoadJsonCore(
            DefaultJsonFilePath,
            GetDefaultConfigCore);

        protected virtual string GetDefaultJsonFilePath() => AppEnv.GetTypePath(
            AppEnvDir.Config,
            GetType(),
            JSON_FILE_NAME);

        protected void OnDataSaved(TImmtbl data) => dataSaved?.Invoke(data);

        protected override string ReadJsonFromFile()
        {
            string json = base.ReadJsonFromFile();
            StartFileWatcherIfReq();

            return json;
        }

        protected void SaveJsonCore(
            object obj,
            string jsonFilePath)
        {
            string json = JsonConversion.Adapter.Serialize(
                obj, false);

            Mutex.WaitOne();

            try
            {
                Directory.CreateDirectory(JsonDirPath);
                File.WriteAllText(jsonFilePath, json);
            }
            finally
            {
                Mutex.ReleaseMutex();
            }
        }

        private bool StartFileWatcherIfReq()
        {
            bool start = jsonFileWatcher == null;

            if (start)
            {
                jsonFileWatcher = new FileSystemWatcher(JsonDirPath)
                {
                    Filter = JSON_FILE_NAME,
                    NotifyFilter = NotifyFilters.LastWrite,
                    EnableRaisingEvents = true,
                };

                jsonFileWatcher.Changed += JsonFileWatcher_Changed;
            }

            return start;
        }

        private bool StopFileWatcherIfReq()
        {
            var jsonFileWatcher = this.jsonFileWatcher;
            bool stop = jsonFileWatcher != null;

            if (stop)
            {
                jsonFileWatcher.Changed -= JsonFileWatcher_Changed;
                this.jsonFileWatcher = null;
                jsonFileWatcher.Dispose();
            }

            return stop;
        }

        #region Event Handlers

        private void JsonFileWatcher_Changed(
            object sender,
            FileSystemEventArgs e)
        {
            LoadDataObj();
        }

        #endregion Event Handlers
    }
}
