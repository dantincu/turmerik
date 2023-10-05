using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.PureFuncJs.JintCompnts
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
}
