using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.YantraJs
{
    public interface IJsContextAdapterFactory
    {
        IJsContextAdapter<TExportsImmtbl, TExportsMtbl> Create<TExportsImmtbl, TExportsMtbl>(
            JsContextAdapterOpts<TExportsImmtbl, TExportsMtbl> opts);
    }

    public class JsContextAdapterFactory : IJsContextAdapterFactory
    {
        private readonly IJsScriptNormalizer jsScriptNormalizer;

        public JsContextAdapterFactory(
            IJsScriptNormalizer jsScriptNormalizer)
        {
            this.jsScriptNormalizer = jsScriptNormalizer ?? throw new ArgumentNullException(nameof(jsScriptNormalizer));
        }

        public IJsContextAdapter<TExportsImmtbl, TExportsMtbl> Create<TExportsImmtbl, TExportsMtbl>(
            JsContextAdapterOpts<TExportsImmtbl, TExportsMtbl> opts) => new JsContextAdapter<TExportsImmtbl, TExportsMtbl>(
                jsScriptNormalizer, opts);
    }
}
