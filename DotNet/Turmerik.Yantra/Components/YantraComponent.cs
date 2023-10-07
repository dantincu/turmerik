using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using Turmerik.Helpers;
using Turmerik.Text;
using Turmerik.Utility;
using YantraJS.Core;
using YantraJS.Tests;

namespace Turmerik.Yantra.Components
{
    public interface IYantraComponent : IDisposable
    {
        IJsConsole JsConsole { get; }
        string? LibObjName { get; }

        JSValue Execute(JsCodeOpts jsCodeOpts);

        TResult Execute<TResult>(
            JsCodeOpts<TResult> jsCodeOpts);

        Task<JSValue> ExecuteAsync(JsCodeOpts jsCodeOpts);

        Task<TResult> ExecuteAsync<TResult>(
            JsCodeOpts<TResult> jsCodeOpts);
    }

    public interface IYantraComponent<TBehaviour> : IYantraComponent
    {
        TBehaviour Config { get; }
    }

    public class YantraComponent : IYantraComponent
    {
        public YantraComponent(
            IJsonConversion jsonConversion,
            IJsCodeTransformer jsCodeTransformer,
            YantraComponentOpts opts)
        {
            JsonConversion = jsonConversion;
            JsonAdapter = jsonConversion.Adapter;

            JsCodeTransformer = jsCodeTransformer ?? throw new ArgumentNullException(
                nameof(jsCodeTransformer));

            JsConsole = opts.JsConsole;

            Ctx = GetJsContext(opts);

            LibObjName = opts.TrmrkLibJsCode?.With(
                libJsCode => libJsCode.GetLibObjName(
                    JsCodeH.TRMRK_OBJ_NAME));

            CfgObjRetrieverCode = GetJsCode(
                opts.UserCfgObjRetrieverCode,
                opts.UserJsCode.GlobalThisObjName);

            CfgObj = (JSObject)Ctx.Execute(
                CfgObjRetrieverCode);
        }

        public IJsConsole JsConsole { get; }
        public string? LibObjName { get; }

        protected IJsonConversion JsonConversion { get; }
        protected IJsonConversionAdapter JsonAdapter { get; }
        protected IJsCodeTransformer JsCodeTransformer { get; }

        protected string CfgObjRetrieverCode { get; }
        protected JSContext Ctx { get; }
        protected JSObject CfgObj { get; }

        public JSValue Execute(JsCodeOpts jsCodeOpts)
        {
            string jsCode = GetJsCode(jsCodeOpts);
            var resultJsValue = Ctx.Execute(jsCode);

            return resultJsValue;
        }

        public TResult Execute<TResult>(JsCodeOpts<TResult> jsCodeOpts)
        {
            var resultJsValue = Execute(
                (JsCodeOpts)jsCodeOpts);

            var result = ConvertTo(
                resultJsValue,
                jsCodeOpts);

            return result;
        }

        public async Task<JSValue> ExecuteAsync(JsCodeOpts jsCodeOpts)
        {
            string jsCode = GetJsCode(jsCodeOpts);
            var resultJsValue = await Ctx.ExecuteAsync(jsCode);

            return resultJsValue;
        }

        public async Task<TResult> ExecuteAsync<TResult>(
            JsCodeOpts<TResult> jsCodeOpts)
        {
            var resultJsValue = await ExecuteAsync(
                (JsCodeOpts)jsCodeOpts);

            var result = ConvertTo(
                resultJsValue,
                jsCodeOpts);

            return result;
        }

        public void Dispose()
        {
            JsConsole?.Dispose();
            Ctx.Dispose();
        }

        private TResult ConvertTo<TResult>(
            JSValue resultJsValue,
            JsCodeOpts<TResult> jsCodeOpts)
        {
            if (!resultJsValue.ConvertTo(out TResult result))
            {
                result = jsCodeOpts.DefaultRetValFactory.FirstNotNull(
                    () => default).Invoke();
            }

            return result;
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
            YantraComponentOpts opts) => JsCodeTransformer.GetJsCode(
                opts.TrmrkLibJsCode,
                opts.UserJsCode);

        private JSObject GetConsoleObject(
            JSContext ctx,
            IJsConsole console)
        {
            JSObject obj = null;

            if (console != null)
            {
                obj = new JSObject();

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
                        new JSFunction((in Arguments a) =>
                        {
                            kvp.Value(a.ToArray().Select(
                                arg => arg.ToString()).ToArray());

                            return null;
                        });
                }
            }

            return obj;
        }

        private JSContext GetJsContext(
            YantraComponentOpts opts)
        {
            var ctx = opts.CtxFactory?.Invoke() ?? new JSContext(
                new SynchronizationContext());

            var consoleObj = GetConsoleObject(
                ctx, opts.JsConsole);

            if (consoleObj != null)
            {
                ctx[JsCodeH.CONSOLE_VAR_NAME] = consoleObj;
            }

            opts.BeforeUserJsCodeCallback?.Invoke(ctx);
            var jsCode = GetJsCode(opts);

            ctx.Execute(jsCode);
            return ctx;
        }
    }

    public class JintComponent<TCfg> : YantraComponent, IYantraComponent<TCfg>
    {
        public JintComponent(
            IJsonConversion jsonConversion,
            IJsCodeTransformer jsCodeTransformer,
            YantraComponentOpts<TCfg> opts) : base(
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
