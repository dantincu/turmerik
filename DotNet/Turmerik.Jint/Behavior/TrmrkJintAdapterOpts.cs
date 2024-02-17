using Jint;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;

namespace Turmerik.Jint.Behavior
{
    public class TrmrkJintAdapterOpts
    {
        public Engine Engine { get; set; }
        public ReadOnlyCollection<string> JsScripts { get; set; }
    }
}
