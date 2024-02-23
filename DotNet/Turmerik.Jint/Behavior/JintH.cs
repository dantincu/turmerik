using Jint;
using Jint.Native;
using Jint.Runtime;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.Jint.Behavior
{
    public static class JintH
    {
        public const string BEHAVIOR_JS_FILE_NAME = "behavior.js";
        public const string BEHAVIOR_JSON_FILE_NAME = "behavior.json";

        static JintH()
        {
            JsConsoleMethodNames = "log".Arr("debug", "error", "info", "warn").RdnlC();
        }

        public static ReadOnlyCollection<string> JsConsoleMethodNames { get; }

        public static Engine CreateEngine(
            this IEnumerable<string> jsScripts,
            Engine engine = null)
        {
            engine ??= new Engine();

            foreach (var script in jsScripts)
            {
                engine = engine.Execute(script);
            }

            return engine;
        }

        public static Action<object> GetDefaultLogCallback(
            IJsonConversionAdapter jsonAdapter,
            TextWriter textWriter) => (object args) =>
        {
            string jsonArgs = jsonAdapter.Serialize(args);
            textWriter.WriteLine(jsonArgs);
        };

        public static Dictionary<string, Action<object>> SetConsoleLog(
            this Engine engine,
            IJsonConversionAdapter jsonAdapter,
            Dictionary<string, Action<object>> consoleActionsMap = null)
        {
            consoleActionsMap ??= new Dictionary<string, Action<object>>();

            consoleActionsMap.GetOrAdd("error", sink => GetDefaultLogCallback(
                jsonAdapter, Console.Error));

            foreach (var method in JsConsoleMethodNames)
            {
                consoleActionsMap.GetOrAdd(method, sink => GetDefaultLogCallback(
                    jsonAdapter, Console.Out));
            }

            engine.SetValue("console", consoleActionsMap);
            return consoleActionsMap;
        }
    }
}
