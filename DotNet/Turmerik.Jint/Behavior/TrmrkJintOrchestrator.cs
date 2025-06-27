using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;

namespace Turmerik.Jint.Behavior
{
    public interface ITrmrkJintOrchestrator
    {
        Task<ITrmrkJintAdapter> ExecuteWhileAsync(
            TrmrkJintOrchestratorOpts opts);
    }

    public class TrmrkJintOrchestrator : ITrmrkJintOrchestrator
    {
        public const string NEXT_DOTNET_METHOD_CALL_EXPR_RETRIEVER_JS_CODE = "turmerik.getNextDotNetMethodCall()";

        private readonly IGenericTaskAdapter genericTaskAdapter;
        private readonly ITrmrkJintAdapterFactory trmrkJintAdapterFactory;

        public TrmrkJintOrchestrator(
            IGenericTaskAdapter genericTaskAdapter,
            ITrmrkJintAdapterFactory trmrkJintAdapterFactory)
        {
            this.genericTaskAdapter = genericTaskAdapter ?? throw new ArgumentNullException(
                nameof(genericTaskAdapter));

            this.trmrkJintAdapterFactory = trmrkJintAdapterFactory ?? throw new ArgumentNullException(
                nameof(trmrkJintAdapterFactory));
        }

        public async Task<ITrmrkJintAdapter> ExecuteWhileAsync(
            TrmrkJintOrchestratorOpts opts)
        {
            var jintAdapter = opts.JintAdapter ?? trmrkJintAdapterFactory.Create(
                opts.JintAdapterOpts ?? new TrmrkJintAdapterOpts());

            if (opts.InitialJsCodesArr != null)
            {
                jintAdapter = jintAdapter.Execute(
                    opts.InitialJsCodesArr);
            }

            var nextDotNetMethodCallArgs = jintAdapter.Evaluate<DotNetMethodCallArgs?>(
                opts.NextDotNetMethodCallArgsExprRetrieverJsCode ?? NEXT_DOTNET_METHOD_CALL_EXPR_RETRIEVER_JS_CODE);

            while (nextDotNetMethodCallArgs != null)
            {
                var method = opts.DotNetMethods[
                    nextDotNetMethodCallArgs.DotNetMethodName];

                var retObj = method.Invoke(
                    nextDotNetMethodCallArgs.DotNetMethodCallArgsArr);

                retObj = (await genericTaskAdapter.ToValueOrTaskAsync(
                    retObj)).Value;
                
                jintAdapter = jintAdapter.ExecuteMethod(
                    nextDotNetMethodCallArgs.JsCallbackMethodName,
                    [retObj]);
            }

            return jintAdapter;
        }
    }
}
