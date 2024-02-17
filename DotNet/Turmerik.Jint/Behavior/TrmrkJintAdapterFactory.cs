using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Jint.Behavior
{
    public interface ITrmrkJintAdapterFactory
    {
        ITrmrkJintAdapter Create(
            TrmrkJintAdapterOpts opts);
    }

    public class TrmrkJintAdapterFactory : ITrmrkJintAdapterFactory
    {
        private readonly IJsonConversion jsonConversion;

        public TrmrkJintAdapterFactory(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));
        }

        public ITrmrkJintAdapter Create(
            TrmrkJintAdapterOpts opts) => new TrmrkJintAdapter(
                jsonConversion, opts);
    }
}
