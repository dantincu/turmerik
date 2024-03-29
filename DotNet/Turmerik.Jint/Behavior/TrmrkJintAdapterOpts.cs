﻿using Jint;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using Turmerik.Core.Utility;

namespace Turmerik.Jint.Behavior
{
    public class TrmrkJintAdapterOpts
    {
        public Engine Engine { get; set; }
        public ReadOnlyCollection<string> JsScripts { get; set; }
        public Dictionary<string, Action<object>> JsConsoleCallbacksMap { get; set; }
        public bool? SetJsConsole { get; set; }
    }
}
