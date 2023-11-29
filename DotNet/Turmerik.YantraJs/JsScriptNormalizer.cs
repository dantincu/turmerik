using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Text;

namespace Turmerik.YantraJs
{
    public interface IJsScriptNormalizer
    {
        string GetGlobalThisImmediateJsFuncCode(
            string jsCode,
            string globalThisVarName = null);

        string GetNormalizedJsCode(
            JsScriptOpts opts);
    }

    public class JsScriptNormalizer : IJsScriptNormalizer
    {
        public const string GLOBAL_THIS_VAR_NAME = "globalThis";

        public static readonly string GlobalThisImmediateJsFuncTemplate = string.Join("\n",
$@"(function({{1}}){{
{{0}}
}}(this);");

        public string GetGlobalThisImmediateJsFuncCode(
            string jsCode,
            string globalThisVarName = null) => string.Format(
                GlobalThisImmediateJsFuncTemplate,
                globalThisVarName ?? GLOBAL_THIS_VAR_NAME,
                jsCode);

        public string GetNormalizedJsCode(
            JsScriptOpts opts)
        {
            opts.GlobalThisVarName ??= GLOBAL_THIS_VAR_NAME;
            opts.ScriptTemplate = (opts.ScriptTemplate ?? GlobalThisImmediateJsFuncTemplate).Nullify(true) ?? "{0}";

            string normJsCode = string.Format(
                opts.ScriptTemplate,
                opts.JsCode,
                opts.GlobalThisVarName);

            return normJsCode;
        }
    }
}
