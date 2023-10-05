using Jint;
using Jint.Native.Object;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.PureFuncJs.JintCompnts
{
    public class JintComponentOpts
    {
        public Engine Engine { get; set; }
        public JsCodeOpts JsCode { get; set; }
        public JsLibCodeOpts TrmrkLibJsCode { get; set; }
        public string CfgObjRetrieverCode { get; set; }
        public IJintConsole JintConsole { get; set; }
        public bool IncludeDefaultConsoleObj { get; set; }
    }

    public class JintComponentOpts<TCfg> : JintComponentOpts
    {
        public Func<IJintComponent<TCfg>, ObjectInstance, TCfg> CfgFactory { get; set; }
    }
}
