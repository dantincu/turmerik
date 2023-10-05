using Jint.Native;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Text;

namespace Turmerik.PureFuncJs.JintCompnts
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
            this.JsonConversion = jsonConversion;
            this.JsonAdapter = jsonConversion.Adapter;
        }

        private IJsonConversion JsonConversion { get; }
        private IJsonConversionAdapter JsonAdapter { get; }

        public string GetJsCode(
            JsLibCodeOpts jsLibCodeOpts,
            JsCodeOpts jsCodeOpts)
        {
            string libJsCode = GetLibJsCode(jsLibCodeOpts);
            string jsCode = GetJsCode(jsCodeOpts);

            string retJsCode = string.Join("\n",
                libJsCode,
                "\n",
                jsCode);

            return retJsCode;
        }

        public string GetJsCode(
            JsCodeOpts jsCodeOpts)
        {
            string jsCode = jsCodeOpts.JsCode;

            if (jsCodeOpts.ArgsArr != null)
            {
                jsCode = GetJsCallCode(jsCodeOpts);
            }

            jsCode = string.Format(
                JsCodeH.ImmediateFuncTpl,
                jsCodeOpts.GlobalThisObjName ?? JsCodeH.GLOBAL_THIS_VAR_NAME,
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

        private string GetJsCallCode(
            JsCodeOpts jsCodeOpts)
        {
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
