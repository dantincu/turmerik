using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.YantraJs
{
    public interface IAppBehaviorConfig<TExportsImmtbl, TExportsMtbl> : IDisposable
    {
        IJsContextAdapter<TExportsImmtbl, TExportsMtbl> JsAdapter { get; }

        string JsBhvDirPath { get; }
        string JsBhvFilePath { get; }
        string JsBhvExportsFilePath { get; }
    }

    public class AppBehaviorConfig<TExportsImmtbl, TExportsMtbl> : IAppBehaviorConfig<TExportsImmtbl, TExportsMtbl>
    {
        public const string JS_BHV_FILE_NAME = "behavior.js";
        public const string JS_BHV_EXPORTS_FILE_NAME = "behavior.exports.js";

        public AppBehaviorConfig(
            IJsContextAdapterFactory jsContextAdapterFactory,
            IJsonConversion jsonConversion,
            IAppEnv appEnv,
            JsContextAdapterOpts<TExportsImmtbl, TExportsMtbl> jsAdapterOpts)
        {
            JsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            AppEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            JsBhvDirPath = GetJsBhvDirPath();
            JsBhvFilePath = GetJsBhvFilePath();
            JsBhvExportsFilePath = GetJsBhvExportsFilePath();

            JsAdapter = jsContextAdapterFactory.Create(
                NormalizeJsAdapterOpts(jsAdapterOpts));
        }

        public IJsContextAdapter<TExportsImmtbl, TExportsMtbl> JsAdapter { get; }

        public string JsBhvDirPath { get; }
        public string JsBhvFilePath { get; }
        public string JsBhvExportsFilePath { get; }

        protected IJsonConversion JsonConversion { get; }
        protected IAppEnv AppEnv { get; }

        public void Dispose()
        {
            JsAdapter.Dispose();
        }

        protected virtual string GetJsBhvDirPath() => AppEnv.GetTypePath(
            AppEnvDir.Config,
            GetType());

        protected virtual string GetJsBhvFilePath() => AppEnv.GetTypePath(
            AppEnvDir.Config,
            GetType(),
            JS_BHV_FILE_NAME);

        protected virtual string GetJsBhvExportsFilePath() => AppEnv.GetTypePath(
            AppEnvDir.Config,
            GetType(),
            JS_BHV_EXPORTS_FILE_NAME);

        protected virtual JsContextAdapterOpts<TExportsImmtbl, TExportsMtbl> NormalizeJsAdapterOpts(
            JsContextAdapterOpts<TExportsImmtbl, TExportsMtbl> opts)
        {
            opts.JsCode ??= File.ReadAllText(
                JsBhvFilePath);

            opts.ExportsObjRetrieverJsCode ??= File.ReadAllText(
                JsBhvExportsFilePath);

            return opts;
        }
    }
}
