using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.TextParsing.StructuredFreeText
{
    public abstract class TrmrkStructuredFreeTextWebRequestActionHandlerBase
    {
        public abstract Task<TrmrkStructuredFreeTextWebResponse> ExecuteAsync(
            TrmrkStructuredFreeTextWebRequest request);

        public abstract Type? GetRequestMetadataMetadataType(
            TrmrkStructuredFreeTextWebRequest request,
            TrmrkStructuredFreeTextDeserializeTypeFactoryArgs factoryArgs);

        public abstract Type? GetRequestMetadataPayloadType(
            TrmrkStructuredFreeTextWebRequest request,
            TrmrkStructuredFreeTextDeserializeTypeFactoryArgs factoryArgs);

        public abstract Type? GetRequestBodyMetadataType(
            TrmrkStructuredFreeTextWebRequest request,
            TrmrkStructuredFreeTextDeserializeTypeFactoryArgs factoryArgs);

        public abstract Type? GetRequestBodyPayloadType(
            TrmrkStructuredFreeTextWebRequest request,
            TrmrkStructuredFreeTextDeserializeTypeFactoryArgs factoryArgs);
    }

    public abstract class TrmrkStructuredFreeTextWebRequestActionHandlerBase<TGlobalMetadata, TRequestMetadata, TRequestBody> : TrmrkStructuredFreeTextWebRequestActionHandlerBase
    {
        public override async Task<TrmrkStructuredFreeTextWebResponse> ExecuteAsync(
            TrmrkStructuredFreeTextWebRequest request)
        {
            TGlobalMetadata? globalMetadata = UtilsH.CastOrDefault<TGlobalMetadata?>(
                request.GlobalMetadata?.Payload!);

            TRequestMetadata? requestMetadata = UtilsH.CastOrDefault<TRequestMetadata?>(
                request.RequestMetadata?.Payload!);

            TRequestBody? requestBody = UtilsH.CastOrDefault<TRequestBody?>(
                request.RequestBody?.Payload!);

            var response = await ExecuteAsync(
                request,
                globalMetadata,
                requestMetadata,
                requestBody);

            return response;
        }

        public override Type? GetRequestBodyMetadataType(
            TrmrkStructuredFreeTextWebRequest request, TrmrkStructuredFreeTextDeserializeTypeFactoryArgs factoryArgs) => null;

        public override Type? GetRequestBodyPayloadType(
            TrmrkStructuredFreeTextWebRequest request, TrmrkStructuredFreeTextDeserializeTypeFactoryArgs factoryArgs) => typeof(TRequestMetadata);

        public override Type? GetRequestMetadataMetadataType(
            TrmrkStructuredFreeTextWebRequest request, TrmrkStructuredFreeTextDeserializeTypeFactoryArgs factoryArgs) => null;

        public override Type? GetRequestMetadataPayloadType(
            TrmrkStructuredFreeTextWebRequest request, TrmrkStructuredFreeTextDeserializeTypeFactoryArgs factoryArgs) => typeof(TRequestBody);

        protected abstract Task<TrmrkStructuredFreeTextWebResponse> ExecuteAsync(
            TrmrkStructuredFreeTextWebRequest request,
            TGlobalMetadata? globalMetadata,
            TRequestMetadata? requestMetadata,
            TRequestBody? requestBody);
    }
}
