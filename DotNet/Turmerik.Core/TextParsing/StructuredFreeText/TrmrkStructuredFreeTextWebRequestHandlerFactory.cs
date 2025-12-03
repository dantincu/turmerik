using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.TextParsing.StructuredFreeText
{
    public interface ITrmrkStructuredFreeTextWebRequestHandlerFactory
    {
        ITrmrkStructuredFreeTextWebRequestHandler<TGlobalMetadata> Create<TGlobalMetadata>(
            ) where TGlobalMetadata : TrmrkWebGlobalMetadataCore;
    }

    public class TrmrkStructuredFreeTextWebRequestHandlerFactory : ITrmrkStructuredFreeTextWebRequestHandlerFactory
    {
        private readonly ITrmrkStructuredFreeTextWebSerializer trmrkStructuredFreeTextWebSerializer;

        public TrmrkStructuredFreeTextWebRequestHandlerFactory(
            ITrmrkStructuredFreeTextWebSerializer trmrkStructuredFreeTextWebSerializer)
        {
            this.trmrkStructuredFreeTextWebSerializer = trmrkStructuredFreeTextWebSerializer ?? throw new ArgumentNullException(
                nameof(trmrkStructuredFreeTextWebSerializer));
        }

        public ITrmrkStructuredFreeTextWebRequestHandler<TGlobalMetadata> Create<TGlobalMetadata>(
            ) where TGlobalMetadata : TrmrkWebGlobalMetadataCore => new TrmrkStructuredFreeTextWebRequestHandler<TGlobalMetadata>(
                trmrkStructuredFreeTextWebSerializer);
    }
}
