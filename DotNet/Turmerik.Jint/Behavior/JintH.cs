using Jint;
using Jint.Native;
using Jint.Runtime;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Jint.Behavior
{
    public static class JintH
    {
        public const string BEHAVIOR_JS_FILE_NAME = "behavior.js";
        public const string BEHAVIOR_JSON_FILE_NAME = "behavior.json";

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
    }
}
