using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YantraJS.Core;

namespace Turmerik.Yantra.Components
{
    public class YantraComponentOpts
    {
        public Func<JSContext> CtxFactory { get; set; }
        public Action<JSContext> BeforeUserJsCodeCallback { get; set; }
        public JsCodeOpts UserJsCode { get; set; }
        public JsLibCodeOpts TrmrkLibJsCode { get; set; }
        public string UserCfgObjRetrieverCode { get; set; }
        public IJsConsole JsConsole { get; set; }
        public bool IncludeDefaultConsoleObj { get; set; }
    }

    public class YantraComponentOpts<TCfg> : YantraComponentOpts
    {
        public Func<IYantraComponent<TCfg>, JSObject, TCfg> CfgFactory { get; set; }
    }
}
