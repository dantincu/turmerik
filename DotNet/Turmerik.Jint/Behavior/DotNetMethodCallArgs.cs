using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Jint.Behavior
{
    public class DotNetMethodCallArgs
    {
        public string DotNetMethodName { get; set; }
        public object[] DotNetMethodCallArgsArr { get; set; }
        public string JsCallbackCode { get; set; }
    }
}
