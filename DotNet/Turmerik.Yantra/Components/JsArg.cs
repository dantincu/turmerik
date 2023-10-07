using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Yantra.Components
{
    public class JsArg
    {
        public string Name { get; set; }
        public object Value { get; set; }
        public bool? SerializeToJson { get; set; }
        public bool? UseCamelCase { get; set; }
    }
}
