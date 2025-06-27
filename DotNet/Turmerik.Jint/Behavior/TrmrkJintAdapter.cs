using Jint;
using Jint.Native.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Jint.Behavior
{
    public interface ITrmrkJintAdapter
    {
        ReadOnlyCollection<string> JsScripts { get; }
        Engine Engine { get; }
        JsonSerializer JsonSerializer { get; }

        ITrmrkJintAdapter Execute(
            params string[] jsCodeArr);

        ITrmrkJintAdapter ExecuteMethod(
            string jsMethod,
            object?[] argsArr);

        ITrmrkJintAdapter ExecuteMethod(
            string[] jsMethodPath,
            object?[] argsArr);

        TValue Evaluate<TValue>(
            string jsCode);

        TValue Evaluate<TValue>(
            string[] propertyPath);

        TValue Evaluate<TValue>(
            string[] methodPath,
            object?[] argsArr);

        string GetMethodCallJsCode(
            string jsMethod,
            object?[] argsArr);

        string SerializeMemberPath(
            string[] pathPartsArr);

        TValue Invoke<TValue>(
            string jsMethod,
            object?[] args);
    }

    public class TrmrkJintAdapter : ITrmrkJintAdapter
    {
        public const string METHOD_CALL_FORMAT = "{0}({1})";
        public const string EXPORTED_MEMBERS_RETRIEVER_JS_CODE = "turmerik.getExportedMembers()";

        private readonly IJsonConversion jsonConversion;

        public TrmrkJintAdapter(
            IJsonConversion jsonConversion,
            TrmrkJintAdapterOpts opts)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            JsScripts = opts.JsScripts;

            Engine = opts.Engine ?? JintH.CreateEngine(
                JsScripts);

            if (opts.SetJsConsole == true)
            {
                Engine.SetConsoleLog(
                    jsonConversion.Adapter,
                    opts.JsConsoleCallbacksMap);
            }

            JsonSerializer = new JsonSerializer(Engine);
        }

        public ReadOnlyCollection<string> JsScripts { get; }
        public Engine Engine { get; }
        public JsonSerializer JsonSerializer { get; }

        public ITrmrkJintAdapter Execute(
            params string[] jsCodeArr) => new TrmrkJintAdapter(
                jsonConversion,
                new TrmrkJintAdapterOpts
                {
                    JsScripts = JsScripts.Concat(jsCodeArr).RdnlC(),
                    Engine = JintH.CreateEngine(jsCodeArr, Engine)
                });

        public ITrmrkJintAdapter ExecuteMethod(
            string jsMethod,
            object?[] argsArr) => Execute(GetMethodCallJsCode(jsMethod, argsArr));

        public ITrmrkJintAdapter ExecuteMethod(
            string[] jsMethodPath,
            object?[] argsArr) => ExecuteMethod(SerializeMemberPath(jsMethodPath), argsArr);

        public TValue Evaluate<TValue>(
            string jsCode)
        {
            var result = Engine.Evaluate(jsCode);
            result = JsonSerializer.Serialize(result);

            string json = result.AsString();
            var retVal = jsonConversion.Adapter.Deserialize<TValue>(json);

            return retVal;
        }

        public TValue Evaluate<TValue>(
            string[] propertyPath)
        {
            string propPathStr = SerializeMemberPath(propertyPath);
            var value = this.Evaluate<TValue>(propPathStr);
            return value;
        }

        public TValue Evaluate<TValue>(
            string[] methodPath,
            object?[] argsArr)
        {
            string jsMethod = SerializeMemberPath(methodPath);
            string jsCode = GetMethodCallJsCode(jsMethod, argsArr);
            var value = this.Evaluate<TValue>(jsCode);
            return value;
        }

        public string GetMethodCallJsCode(
            string jsMethod,
            object?[] argsArr)
        {
            string[] jsonArgsArr = argsArr.Select(
                arg => jsonConversion.Adapter.Serialize(
                    arg)).ToArray();

            string argsJson = string.Join(", ", jsonArgsArr);

            string jsCode = string.Format(
                METHOD_CALL_FORMAT, jsMethod, argsJson);

            return jsCode;
        }

        public string SerializeMemberPath(
            string[] pathPartsArr)
        {
            pathPartsArr = pathPartsArr.Select(
                part => jsonConversion.Adapter.Serialize(part)).ToArray();

            string retStr = string.Join("][", pathPartsArr);
            retStr = string.Concat(JintH.GLOBAL_THIS, "[", retStr, "]");

            return retStr;
        }

        public TValue Invoke<TValue>(
            string jsMethod,
            object?[] argsArr) => Evaluate<TValue>(
                GetMethodCallJsCode(jsMethod, argsArr));
    }
}
