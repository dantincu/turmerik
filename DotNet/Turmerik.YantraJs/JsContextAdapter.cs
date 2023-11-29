using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using YantraJS.Core;

namespace Turmerik.YantraJs
{
    public interface IJsContextAdapter<TExportsImmtbl, TExportsMtbl> : IDisposable
    {
        JSContext JSContext { get; }
        TExportsImmtbl Exports { get; }

        bool Execute<TValue>(
            string jsCode,
            out TValue value);

        Task<Tuple<bool, TValue>> ExecuteAsync<TValue>(
            string jsCode);
    }

    public class JsContextAdapter<TExportsImmtbl, TExportsMtbl> : IJsContextAdapter<TExportsImmtbl, TExportsMtbl>
    {
        public JsContextAdapter(
            IJsScriptNormalizer jsScriptNormalizer,
            JsContextAdapterOpts<TExportsImmtbl, TExportsMtbl> opts)
        {
            JsScriptNormalizer = jsScriptNormalizer ?? throw new ArgumentNullException(
                nameof(jsScriptNormalizer));

            NormalizeOpts(opts);
            InitialJsCode = JsScriptNormalizer.GetNormalizedJsCode(opts);

            opts.ExportsObjRetrieverJsCode = opts.ExportsObjRetrieverJsCode ?? throw new ArgumentNullException(
                nameof(opts.ExportsObjRetrieverJsCode));

            JSContext = new JSContext(
                opts.SynchronizationContext);

            InitialCodeJsVal = JSContext.Execute(
                InitialJsCode);

            ExportedJsVal = JSContext.Execute(
                opts.ExportsObjRetrieverJsCode);

            ExportedMtbl = opts.Deserializer(ExportedJsVal);
            Exports = opts.ImmutableFactory(ExportedMtbl);
        }

        public JSContext JSContext { get; }
        public TExportsImmtbl Exports { get; }

        private IJsScriptNormalizer JsScriptNormalizer { get; }
        private string InitialJsCode { get; }
        private string ExportsObjRetrieverJsCode { get; }

        private JSValue InitialCodeJsVal { get; }
        private JSValue ExportedJsVal { get; }
        private TExportsMtbl ExportedMtbl { get; }

        public virtual void Dispose()
        {
            JSContext.Dispose();
        }

        public bool Execute<TValue>(
            string jsCode,
            out TValue value)
        {
            var jsValue = JSContext.Execute(jsCode);

            bool valueRetrieved = jsValue.ConvertTo(
                out value);

            return valueRetrieved;
        }

        public async Task<Tuple<bool, TValue>> ExecuteAsync<TValue>(
            string jsCode)
        {
            var task = (JSContext.Execute(jsCode) as JSPromise).Task;
            var jsValue = await task;

            bool valueRetrieved = jsValue.ConvertTo(
                out TValue value);

            return Tuple.Create(
                valueRetrieved,
                value);
        }

        private void NormalizeOpts(
            JsContextAdapterOpts<TExportsImmtbl, TExportsMtbl> opts)
        {
            if (string.IsNullOrWhiteSpace(opts.JsCode))
            {
                throw new ArgumentNullException(
                    nameof(opts.JsCode));
            }

            opts.Deserializer = opts.Deserializer.FirstNotNull(
                GetDefaultDeserializer());

            opts.ImmutableFactory = opts.ImmutableFactory.FirstNotNull(
                mtbl => mtbl.CreateFromSrc<TExportsImmtbl>());
        }

        private Func<JSValue, TExportsMtbl> GetDefaultDeserializer(
            ) => exportedJsVal =>
            {
                TExportsMtbl exportedObj;

                if (exportedJsVal.ConvertTo<TExportsMtbl>(
                    out var exportedMtbl))
                {
                    exportedObj = exportedMtbl;
                }
                else
                {
                    throw new InvalidOperationException(
                        "Exported object could not be deserialized");
                }

                return exportedObj;
            };
    }
}
