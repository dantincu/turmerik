using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Yantra.Components
{
    public class JsCodeOptsCore
    {
        public JsCodeOptsCore()
        {
        }

        public JsCodeOptsCore(
            string jsCode,
            string globalThisObjName = null)
        {
            JsCode = jsCode;
            GlobalThisObjName = globalThisObjName;
        }

        public string JsCode { get; set; }
        public string GlobalThisObjName { get; set; }
    }
}
