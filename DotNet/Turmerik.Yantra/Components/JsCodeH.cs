using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Text;

namespace Turmerik.Yantra.Components
{
    public static class JsCodeH
    {
        public const string UNDEFINED = "undefined";

        public const string CONSOLE_VAR_NAME = "console";
        public const string GLOBAL_THIS_VAR_NAME = "globalThis";
        public const string TRMRK_OBJ_NAME = "trmrk";

        public static readonly string ImmediateFuncTpl;
        public static readonly string LibCodeTpl;

        static JsCodeH()
        {
            ImmediateFuncTpl = Tuple.Create("{0}", "{1}", "{2}").WithTuple(
                (@params, code, args) => string.Join("\n",
                $"(function({@params}) {{",
                $"    {code}",
                $"}} ({args}));"));

            LibCodeTpl = Tuple.Create("{0}", "{1}", "{2}", "{3}").WithTuple(
                (libObjName, globalThisObjName, code, defaultLibObjName) => string.Join("\n",
                $"this.{libObjName} = (function({globalThisObjName}) {{",
                $"    {code}",
                $"    return {defaultLibObjName};",
                $"}} (this));"));
        }
    }
}
