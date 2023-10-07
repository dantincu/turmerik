using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Turmerik.Yantra.Components
{
    public static class YantraH
    {
        public static string GetLibObjName(
            this JsLibCodeOpts libJsCode,
            string defaultLibObjName = null) => libJsCode.LibObjName ?? libJsCode.DefaultLibObjName ?? defaultLibObjName;
    }
}
