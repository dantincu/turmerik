using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using YantraJS.Core;

namespace Turmerik.YantraJs
{
    public class JsContextAdapterOpts<TExportsImmtbl, TExportsMtbl> : JsScriptOpts
    {
        public SynchronizationContext SynchronizationContext { get; set; }
        public Func<JSValue, TExportsMtbl> Deserializer { get; set; }
        public Func<TExportsMtbl, TExportsImmtbl> ImmutableFactory { get; set; }

        public string ExportsObjRetrieverJsCode { get; set; }
    }
}
