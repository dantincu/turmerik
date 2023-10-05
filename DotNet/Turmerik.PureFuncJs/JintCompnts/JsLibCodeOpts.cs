using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.PureFuncJs.JintCompnts
{
    public class JsLibCodeOpts : JsCodeOptsCore
    {
        public JsLibCodeOpts()
        {
        }

        public JsLibCodeOpts(
            string defaultLibObjName,
            string jsCode,
            string libObjName = null,
            string globalThisObjName = null) : base(jsCode, globalThisObjName)
        {
            DefaultLibObjName = defaultLibObjName;
            LibObjName = libObjName;
        }

        public string DefaultLibObjName { get; set; }
        public string LibObjName { get; set; }
    }
}
