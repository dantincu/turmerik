using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Text;

namespace Turmerik.Yantra.Components
{
    public interface IJsCodeTransformer
    {
        string GetJsCode(
            JsLibCodeOpts jsLibCodeOpts,
            JsCodeOpts jsCodeOpts);

        string GetJsCode(
            JsCodeOpts jsCodeOpts);

        string GetLibJsCode(
            JsLibCodeOpts jsLibCodeOpts);
    }

    public class JsCodeTransformer : IJsCodeTransformer
    {
        public JsCodeTransformer(
            IJsonConversion jsonConversion)
        {
            JsonConversion = jsonConversion;
            JsonAdapter = jsonConversion.Adapter;
        }

        private IJsonConversion JsonConversion { get; }
        private IJsonConversionAdapter JsonAdapter { get; }

        public string GetJsCode(
            JsLibCodeOpts jsLibCodeOpts,
            JsCodeOpts jsCodeOpts)
        {
            string jsCode = GetJsCode(jsCodeOpts);

            jsLibCodeOpts?.With(GetLibJsCode).ActWith(
                libJsCode =>
                {
                    jsCode = string.Join("\n",
                        libJsCode,
                        "\n",
                        jsCode);
                });

            return jsCode;
        }

        public string GetJsCode(
            JsCodeOpts jsCodeOpts)
        {
            string jsCode = GetJsCodeCore(
                jsCodeOpts, out var paramsJson);

            jsCode = string.Format(
                JsCodeH.ImmediateFuncTpl,
                paramsJson,
                jsCode,
                "this");

            return jsCode;
        }

        public string GetLibJsCode(
            JsLibCodeOpts jsLibCodeOpts)
        {
            string jsLibCode = string.Format(
                JsCodeH.LibCodeTpl,
                jsLibCodeOpts.LibObjName,
                jsLibCodeOpts.GlobalThisObjName ?? JsCodeH.GLOBAL_THIS_VAR_NAME,
                jsLibCodeOpts.JsCode,
                jsLibCodeOpts.DefaultLibObjName ?? JsCodeH.TRMRK_OBJ_NAME);

            return jsLibCode;
        }

        private string GetJsCodeCore(
            JsCodeOpts jsCodeOpts,
            out string paramsJson)
        {
            string jsCode = jsCodeOpts.JsCode;

            if (jsCodeOpts.ArgsArr != null)
            {
                jsCode = GetJsCallCode(
                    jsCodeOpts,
                    out paramsJson);
            }
            else
            {
                paramsJson = jsCodeOpts.GlobalThisObjName ?? JsCodeH.GLOBAL_THIS_VAR_NAME;
            }

            return jsCode;
        }

        private string GetJsCallCode(
            JsCodeOpts jsCodeOpts,
            out string paramsJson)
        {
            paramsJson = GetParamsJson(
                jsCodeOpts.ArgsArr,
                jsCodeOpts.GlobalThisObjName);

            string argsJson = GetArgsJson(
                jsCodeOpts.ArgsArr);

            string jsCode = jsCodeOpts.JsCode.Trim();
            int jsCodeLen = jsCode.Length;
            int sliceIdx = jsCodeLen - 3;
            string endingPart = jsCode.Substring(sliceIdx);

            switch (endingPart)
            {
                case "();":
                    sliceIdx++;
                    endingPart = endingPart.Substring(1);
                    break;
                case "));":
                    break;
                default:
                    throw new ArgumentException(
                        "The provided type of js code is not supported along with a provided array of arguments as it doesn't appear to end with a function call.");
            }

            string slicedJsCode = jsCode.Substring(
                0, sliceIdx);

            string retJsCode = string.Concat(
                slicedJsCode,
                argsJson,
                endingPart);

            return retJsCode;
        }

        private string GetParamsJson(
            JsArg[] argsArr,
            string globalThisObjName)
        {
            var paramsJsonList = argsArr.Select(
                arg => arg.Name).ToList();

            paramsJsonList.Insert(0,
                globalThisObjName ?? JsCodeH.GLOBAL_THIS_VAR_NAME);

            string argsJson = string.Join(
                ", ", paramsJsonList);

            return argsJson;
        }

        private string GetArgsJson(
            JsArg[] argsArr)
        {
            var argsJsonList = argsArr.Select(
                GetArgJson).ToList();

            string argsJson = string.Join(
                ", ", argsJsonList);

            return argsJson;
        }

        private string GetArgJson(JsArg arg)
        {
            string json;

            if (arg.SerializeToJson != false)
            {
                json = JsonAdapter.Serialize(
                    arg.Value,
                    arg.UseCamelCase ?? false);
            }
            else
            {
                json = arg.Value?.ToString() ?? JsCodeH.UNDEFINED;
            }

            return json;
        }
    }
}
