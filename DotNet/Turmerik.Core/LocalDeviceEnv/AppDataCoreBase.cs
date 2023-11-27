using System;
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

        public TImmtbl Update(
            RefAction<TMtblSrlzbl> updateAction)
        {
            var srlzblData = SerializeConfig(DataCore);
            updateAction(ref srlzblData);

            var data = NormalizeConfig(srlzblData);

            SaveJsonCore(
                srlzblData,
                JsonFilePath);

            DataCore = data;
            OnDataSaved(data);

            return data;
        }

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

        protected override string GetJsonFilePath() => AppEnv.GetTypePath(
            AppEnvDir.Data,
            GetType(),
            JSON_FILE_NAME);

        protected override TMtblSrlzbl GetDefaultConfig() => LoadJsonCore(
            DefaultJsonFilePath,
            GetDefaultConfigCore);

        protected virtual string GetDefaultJsonFilePath() => base.GetJsonFilePath();

        protected void OnDataSaved(TImmtbl data) => dataSaved?.Invoke(data);

        protected override string ReadJsonFromFile()
        {
            string json = base.ReadJsonFromFile();
            StartFileWatcherIfReq();

            return json;
        }

        private bool StartFileWatcherIfReq()
        {
            bool start = jsonFileWatcher == null;

            if (start)
            {
                jsonFileWatcher = new FileSystemWatcher(JsonFilePath)
                {
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

    public class AppDataCore<TImmtbl, TMtblSrlzbl> : AppDataCoreBase<TImmtbl, TMtblSrlzbl>
        where TImmtbl : class
    {
        public AppDataCore(
            IJsonConversion jsonConversion,
            IAppEnv appEnv,
            AppDataCoreOpts<TImmtbl, TMtblSrlzbl> opts = null,
            string jsonDirRelPath = null) : base(
                jsonConversion,
                appEnv,
                jsonDirRelPath)
        {
            opts ??= new AppDataCoreOpts<TImmtbl, TMtblSrlzbl>();

            DefaultDataFactory = opts.DefaultDataFactory.FirstNotNull(
                () => throw new NotSupportedException(
                    $"Default data is not supported for {JsonFilePath}"));

            DataNormalizer = opts.DataNormalizer.FirstNotNull(
                mtbl => mtbl.CreateFromSrc<TImmtbl>());

            DataSerializer = opts.DataSerializer.FirstNotNull(
                immtbl => immtbl.CreateFromSrc<TMtblSrlzbl>());
        }

        private Func<TMtblSrlzbl> DefaultDataFactory { get; }
        private Func<TMtblSrlzbl, TImmtbl> DataNormalizer { get; }
        private Func<TImmtbl, TMtblSrlzbl> DataSerializer { get; }

        protected override TMtblSrlzbl GetDefaultConfigCore(
            ) => DefaultDataFactory();

        protected override TImmtbl NormalizeConfig(
            TMtblSrlzbl config) => DataNormalizer(config);

        protected override TMtblSrlzbl SerializeConfig(
            TImmtbl config) => DataSerializer(config);
    }
}
