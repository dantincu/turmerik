using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Yantra.Components
{
    public class JsCodeOpts : JsCodeOptsCore
    {
        public JsCodeOpts()
        {
        }

        public JsCodeOpts(
            string jsCode,
            string globalThisObjName = null,
            JsArg[] argsArr = null) : base(
                jsCode,
                globalThisObjName)
        {
            JsCode = jsCode;
            GlobalThisObjName = globalThisObjName;
            ArgsArr = argsArr;
        }

        public string JsCode { get; set; }
        public string GlobalThisObjName { get; set; }
        public JsArg[] ArgsArr { get; set; }
    }

    public class JsCodeOpts<TResult> : JsCodeOpts
    {
        public JsCodeOpts()
        {
        }

        public JsCodeOpts(
            string jsCode,
            string globalThisObjName = null,
            JsArg[] argsArr = null,
            Func<TResult> defaultRetValFactory = null) : base(
                jsCode,
                globalThisObjName,
                argsArr)
        {
            DefaultRetValFactory = defaultRetValFactory;
        }

        public Func<TResult> DefaultRetValFactory { get; set; }
    }
}
