using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.PureFuncJs.JintCompnts
{
    public class JsArg
    {
        public object Value { get; set; }
        public bool? SerializeToJson { get; set; }
        public bool? UseCamelCase { get; set; }
    }
}
