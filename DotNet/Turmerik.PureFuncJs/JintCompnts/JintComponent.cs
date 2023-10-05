using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using Jint;
using Jint.Native;
using Jint.Native.Function;
using Jint.Native.Object;
using Jint.Runtime.Interop;
using Turmerik.Helpers;
using Turmerik.Text;
using Turmerik.Utility;

namespace Turmerik.PureFuncJs.JintCompnts
{
    public interface IJintComponent : IDisposable
    {
        IJintConsole JintConsole { get; }

        Engine Execute(JsCodeOpts jsCodeOpts);

        string Evaluate(JsCodeOpts jsCodeOpts);

        TResult Evaluate<TResult>(
            JsCodeOpts jsCodeOpts);
    }

    public interface IJintComponent<TBehaviour> : IJintComponent
    {
        TBehaviour Config { get; }
    }

    public class JintComponent : IJintComponent
    {
        public JintComponent(
            IJsonConversion jsonConversion,
            IJsCodeTransformer jsCodeTransformer,
            JintComponentOpts opts)
        {
            this.JsonConversion = jsonConversion;
            this.JsonAdapter = jsonConversion.Adapter;

            this.JsCodeTransformer = jsCodeTransformer ?? throw new ArgumentNullException(
                nameof(jsCodeTransformer));

            JintConsole = opts.JintConsole;
            JsCode = GetJsCode(opts);

            CfgObjRetrieverCode = GetJsCode(
                opts.CfgObjRetrieverCode,
                opts.JsCode.GlobalThisObjName);

            Engine = GetEngine(
                opts.Engine,
                JintConsole).Execute(JsCode);

            CfgObj = Engine.Evaluate(
                CfgObjRetrieverCode).AsObject();
        }

        public IJintConsole JintConsole { get; }

        protected IJsonConversion JsonConversion { get; }
        protected IJsonConversionAdapter JsonAdapter { get; }
        protected IJsCodeTransformer JsCodeTransformer { get; }

        protected string JsCode { get; }
        protected string CfgObjRetrieverCode { get; }
        protected Engine Engine { get; }
        protected ObjectInstance CfgObj { get; }

        public Engine Execute(JsCodeOpts jsCodeOpts)
        {
            string jsCode = GetJsCode(jsCodeOpts);
            var newEngine = Engine.Execute(jsCode);

            return newEngine;
        }

        public string Evaluate(JsCodeOpts jsCodeOpts)
        {
            string jsCode = GetJsCode(jsCodeOpts);

            string resultJson = Engine.Evaluate(
                jsCode).ToString();

            return resultJson;
        }

        public TResult Evaluate<TResult>(JsCodeOpts jsCodeOpts)
        {
            string resultJson = Evaluate(
                jsCodeOpts);

            TResult result = JsonAdapter.Deserialize<TResult>(
                resultJson);

            return result;
        }

        public void Dispose()
        {
            JintConsole.Dispose();
            Engine.Dispose();
        }

        private string GetJsCode(
            string jsCode,
            string globalThisObjName = null,
            JsArg[] argsArr = null) => GetJsCode(
                new JsCodeOpts(jsCode,
                    globalThisObjName, argsArr));

        private string GetJsCode(
            JsCodeOpts jsCodeOpts) => JsCodeTransformer.GetJsCode(
                jsCodeOpts);

        private string GetJsCode(
            JintComponentOpts opts) => JsCodeTransformer.GetJsCode(
                opts.TrmrkLibJsCode,
                opts.JsCode);

        private JsObject GetConsoleObject(
            Engine engine,
            IJintConsole console)
        {
            JsObject obj = null;

            if (console != null)
            {
                obj = new JsObject(engine);

                var propsMap = new Dictionary<string, ParamsAction>()
                {
                    { nameof(console.Log), console.Log },
                    { nameof(console.Trace), console.Trace },
                    { nameof(console.Debug), console.Debug },
                    { nameof(console.Info), console.Info },
                    { nameof(console.Warn), console.Warn },
                    { nameof(console.Error), console.Error },
                    { nameof(console.Fatal), console.Fatal },
                };

                foreach (var kvp in propsMap)
                {
                    obj[kvp.Key.DecapitalizeFirstLetter()] =
                        new DelegateWrapper(
                            engine,
                            kvp.Value);
                }
            }

            return obj;
        }

        private Engine GetEngine(
            Engine engine,
            IJintConsole console)
        {
            engine ??= new Engine();
            var consoleObj = GetConsoleObject(engine, console);

            if (consoleObj != null)
            {
                engine = engine.SetValue(
                    JsCodeH.CONSOLE_VAR_NAME,
                    consoleObj);
            }

            return engine;
        }
    }

    public class JintComponent<TCfg> : JintComponent, IJintComponent<TCfg>
    {
        public JintComponent(
            IJsonConversion jsonConversion,
            IJsCodeTransformer jsCodeTransformer,
            JintComponentOpts<TCfg> opts) : base(
                jsonConversion,
                jsCodeTransformer,
                opts)
        {
            var cfgFactory = opts.CfgFactory.FirstNotNull(
                (compnt, cfg) => JsonAdapter.Deserialize<TCfg>(
                    cfg.ToString()));

            Config = cfgFactory(
                this,
                CfgObj);
        }

        public TCfg Config { get; }
    }
}
