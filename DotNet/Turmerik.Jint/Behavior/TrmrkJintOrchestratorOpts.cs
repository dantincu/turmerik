using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Jint.Behavior
{
    public class TrmrkJintOrchestratorOpts
    {
        public TrmrkJintAdapterOpts? JintAdapterOpts { get; set; }
        public ITrmrkJintAdapter? JintAdapter { get; set; }
        public string[]? InitialJsCodesArr { get; set; }
        public Dictionary<string, Func<object[], object>> DotNetMethods { get; set; }
        public string NextDotNetMethodCallArgsExprRetrieverJsCode { get; set; }
    }
}
