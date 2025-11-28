using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using O = Turmerik.Core.TextParsing.StructuredFreeText.TrmrkStructuredFreeTextWebRequestO;

namespace Turmerik.Core.TextParsing.StructuredFreeText
{
    public interface ITrmrkStructuredFreeTextWebRequestSerializer
    {
        TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody> DeserializeWithOptsAnyGlobalCore<TItemOpts, TRequestMetadata, TRequestBody>(
            O.OptsAnyGlobal<TItemOpts, TRequestMetadata, TRequestBody> opts)
            where TItemOpts : O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>;

        TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody> DeserializeWithOptsAnyGlobalAnyMetadataCore<TItemOpts, TRequestBody>(
            O.OptsAnyGlobalAnyMetadata<TItemOpts, TRequestBody> opts)
            where TItemOpts : O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>;

        TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object> DeserializeWithOptsAnyGlobalAnyBodyCore<TItemOpts, TRequestMetadata>(
            O.OptsAnyGlobalAnyBody<TItemOpts, TRequestMetadata> opts)
            where TItemOpts : O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>;

        TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, object, object> DeserializeWithOptsAnyGlobalAnyMetadataAnyBodyCore<TItemOpts>(
            O.OptsAnyGlobalAnyMetadataAnyBody<TItemOpts> opts)
            where TItemOpts : O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, object>;

        TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody> DeserializeWithOptsAnyGlobal<TRequestMetadata, TRequestBody>(
            O.OptsAnyGlobal<TRequestMetadata, TRequestBody> opts);

        TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody> DeserializeWithOptsAnyGlobalAnyMetadata<TRequestBody>(
            O.OptsAnyGlobalAnyMetadata<TRequestBody> opts);

        TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object> DeserializeWithOptsAnyGlobalAnyBody<TRequestMetadata>(
            O.OptsAnyGlobalAnyBody<TRequestMetadata> opts);

        TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, object, object> DeserializeWithOptsAnyGlobalAnyMetadataAnyBody(
            O.OptsAnyGlobalAnyMetadataAnyBody opts);

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, object, TRequestBody> DeserializeWithOptsAnyMetadataCore<TItemOpts, TGlobalMetadata, TRequestBody>(
            O.OptsAnyMetadata<TItemOpts, TGlobalMetadata, TRequestBody> opts)
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, object, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, object> DeserializeWithOptsAnyBodyCore<TItemOpts, TGlobalMetadata, TRequestMetadata>(
            O.OptsAnyBody<TItemOpts, TGlobalMetadata, TRequestMetadata> opts)
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, object>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, object, object> DeserializeWithOptsAnyMetadataAnyBodyCore<TItemOpts, TGlobalMetadata>(
            O.OptsAnyMetadataAnyBody<TItemOpts, TGlobalMetadata> opts)
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, object, object>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody> DeserializeWithOpts<TGlobalMetadata, TRequestMetadata, TRequestBody>(
            O.Opts<TGlobalMetadata, TRequestMetadata, TRequestBody> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, object, TRequestBody> DeserializeWithOptsAnyMetadata<TGlobalMetadata, TRequestBody>(
            O.OptsAnyMetadata<TGlobalMetadata, TRequestBody> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, object> DeserializeWithOptsAnyBody<TGlobalMetadata, TRequestMetadata>(
            O.OptsAnyBody<TGlobalMetadata, TRequestMetadata> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, object, object> DeserializeWithOptsAnyMetadataAnyBody<TGlobalMetadata>(
            O.OptsAnyMetadataAnyBody<TGlobalMetadata> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody> DeserializeWithOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>(
            O.OptsCore<O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>, TGlobalMetadata, TRequestMetadata, TRequestBody> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody> Deserialize<TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody>(
            O.OptsCore<TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody> opts)
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;

        TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody> DeserializeCore<TOpts, TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody>(
            TOpts opts)
            where TOpts : O.OptsCore<TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody>
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore;
    }

    public class TrmrkStructuredFreeTextWebRequestSerializer : ITrmrkStructuredFreeTextWebRequestSerializer
    {
        private readonly ITrmrkStructuredFreeTextSerializer trmrkStructuredFreeTextSerializer;

        public TrmrkStructuredFreeTextWebRequestSerializer(
            ITrmrkStructuredFreeTextSerializer trmrkStructuredFreeTextSerializer)
        {
            this.trmrkStructuredFreeTextSerializer = trmrkStructuredFreeTextSerializer ?? throw new ArgumentNullException(
                nameof(trmrkStructuredFreeTextSerializer));
        }

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody> Deserialize<TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody>(
            O.OptsCore<TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody> opts)
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
                => DeserializeCore<O.OptsCore<TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody>, TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody>(opts);

        public TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody> DeserializeWithOptsAnyGlobalCore<TItemOpts, TRequestMetadata, TRequestBody>(
            O.OptsAnyGlobal<TItemOpts, TRequestMetadata, TRequestBody> opts)
            where TItemOpts : O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>
                => DeserializeCore<O.OptsAnyGlobal<TItemOpts, TRequestMetadata, TRequestBody>, TItemOpts, TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>(opts);

        public TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody> DeserializeWithOptsAnyGlobalAnyMetadataCore<TItemOpts, TRequestBody>(
            O.OptsAnyGlobalAnyMetadata<TItemOpts, TRequestBody> opts)
            where TItemOpts : O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>
                => DeserializeCore<O.OptsAnyGlobalAnyMetadata<TItemOpts, TRequestBody>, TItemOpts, TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>(opts);

        public TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object> DeserializeWithOptsAnyGlobalAnyBodyCore<TItemOpts, TRequestMetadata>(
            O.OptsAnyGlobalAnyBody<TItemOpts, TRequestMetadata> opts)
            where TItemOpts : O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>
                => DeserializeCore<O.OptsAnyGlobalAnyBody<TItemOpts, TRequestMetadata>, TItemOpts, TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>(opts);

        public TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, object, object> DeserializeWithOptsAnyGlobalAnyMetadataAnyBodyCore<TItemOpts>(
            O.OptsAnyGlobalAnyMetadataAnyBody<TItemOpts> opts)
            where TItemOpts : O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, object>
                => DeserializeCore<O.OptsAnyGlobalAnyMetadataAnyBody<TItemOpts>, TItemOpts, TrmrkWebRequestGlobalMetadataCore, object, object>(opts);

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody> DeserializeWithOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>(
            O.OptsCore<O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>, TGlobalMetadata, TRequestMetadata, TRequestBody> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
                => DeserializeCore<O.OptsCore<O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>, TGlobalMetadata, TRequestMetadata, TRequestBody>, O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>, TGlobalMetadata, TRequestMetadata, TRequestBody>(opts);

        public TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody> DeserializeWithOptsAnyGlobal<TRequestMetadata, TRequestBody>(
            O.OptsAnyGlobal<TRequestMetadata, TRequestBody> opts)
                => DeserializeCore<O.OptsAnyGlobal<TRequestMetadata, TRequestBody>, O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>, TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>(opts);

        public TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody> DeserializeWithOptsAnyGlobalAnyMetadata<TRequestBody>(
            O.OptsAnyGlobalAnyMetadata<TRequestBody> opts)
                => DeserializeCore<O.OptsAnyGlobalAnyMetadata<TRequestBody>, O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>, TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>(opts);

        public TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object> DeserializeWithOptsAnyGlobalAnyBody<TRequestMetadata>(
            O.OptsAnyGlobalAnyBody<TRequestMetadata> opts)
                => DeserializeCore<O.OptsAnyGlobalAnyBody<TRequestMetadata>, O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>, TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>(opts);

        public TrmrkStructuredFreeTextWebRequest<TrmrkWebRequestGlobalMetadataCore, object, object> DeserializeWithOptsAnyGlobalAnyMetadataAnyBody(
            O.OptsAnyGlobalAnyMetadataAnyBody opts)
                => DeserializeCore<O.OptsAnyGlobalAnyMetadataAnyBody, O.ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, object>, TrmrkWebRequestGlobalMetadataCore, object, object>(opts);

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, object, TRequestBody> DeserializeWithOptsAnyMetadataCore<TItemOpts, TGlobalMetadata, TRequestBody>(
            O.OptsAnyMetadata<TItemOpts, TGlobalMetadata, TRequestBody> opts)
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, object, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
                => DeserializeCore<O.OptsAnyMetadata<TItemOpts, TGlobalMetadata, TRequestBody>, TItemOpts, TGlobalMetadata, object, TRequestBody>(opts);

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, object> DeserializeWithOptsAnyBodyCore<TItemOpts, TGlobalMetadata, TRequestMetadata>(
            O.OptsAnyBody<TItemOpts, TGlobalMetadata, TRequestMetadata> opts)
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, object>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
                => DeserializeCore<O.OptsAnyBody<TItemOpts, TGlobalMetadata, TRequestMetadata>, TItemOpts, TGlobalMetadata, TRequestMetadata, object>(opts);

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, object, object> DeserializeWithOptsAnyMetadataAnyBodyCore<TItemOpts, TGlobalMetadata>(
            O.OptsAnyMetadataAnyBody<TItemOpts, TGlobalMetadata> opts)
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, object, object>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
                => DeserializeCore<O.OptsAnyMetadataAnyBody<TItemOpts, TGlobalMetadata>, TItemOpts, TGlobalMetadata, object, object>(opts);

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody> DeserializeWithOpts<TGlobalMetadata, TRequestMetadata, TRequestBody>(
            O.Opts<TGlobalMetadata, TRequestMetadata, TRequestBody> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
                => DeserializeCore<O.Opts<TGlobalMetadata, TRequestMetadata, TRequestBody>, O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>, TGlobalMetadata, TRequestMetadata, TRequestBody>(opts);

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, object, TRequestBody> DeserializeWithOptsAnyMetadata<TGlobalMetadata, TRequestBody>(
            O.OptsAnyMetadata<TGlobalMetadata, TRequestBody> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
                => DeserializeCore<O.OptsAnyMetadata<TGlobalMetadata, TRequestBody>, O.ItemOptsCore<TGlobalMetadata, object, TRequestBody>, TGlobalMetadata, object, TRequestBody>(opts);

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, object> DeserializeWithOptsAnyBody<TGlobalMetadata, TRequestMetadata>(
            O.OptsAnyBody<TGlobalMetadata, TRequestMetadata> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
                => DeserializeCore<O.OptsAnyBody<TGlobalMetadata, TRequestMetadata>, O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, object>, TGlobalMetadata, TRequestMetadata, object>(opts);

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, object, object> DeserializeWithOptsAnyMetadataAnyBody<TGlobalMetadata>(
            O.OptsAnyMetadataAnyBody<TGlobalMetadata> opts)
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
                => DeserializeCore<O.OptsAnyMetadataAnyBody<TGlobalMetadata>, O.ItemOptsCore<TGlobalMetadata, object, object>, TGlobalMetadata, object, object>(opts);

        public TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody> DeserializeCore<TOpts, TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody>(
            TOpts opts)
            where TOpts : O.OptsCore<TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody>
            where TItemOpts : O.ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
            var request = new TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody>();

            var parsedObj = trmrkStructuredFreeTextSerializer.Deserialize(new()
            {
                Text = opts.Text,
                MetadataTypeFactory = (args) =>
                {
                    Type? dataType;

                    switch (args.ItemIdx)
                    {
                        case 0:
                            request.GlobalMetadataItem = args.Item;

                            dataType = opts.GlobalMetadataOpts?.MetadataTypeFactory?.Invoke(
                                request, args);

                            break;
                        case 1:
                            request.RequestMetadataItem = args.Item;

                            dataType = opts.RequestMetadataOpts?.MetadataTypeFactory?.Invoke(
                                request, args);

                            break;
                        case 2:
                            request.RequestBodyItem = args.Item;

                            dataType = opts.RequestBodyOpts?.MetadataTypeFactory?.Invoke(
                                request, args);

                            break;
                        case 3:
                            dataType = null;
                            break;
                        default:
                            throw new TrmrkException($"Too many items in structured free text (no more than 4 supported)");
                    }

                    return dataType;
                },
                PayloadTypeFactory = (args) =>
                {
                    Type? dataType;

                    switch (args.ItemIdx)
                    {
                        case 0:
                            dataType = opts.GlobalMetadataOpts?.PayloadTypeFactory?.Invoke(
                                request, args) ?? typeof(TGlobalMetadata);

                            break;
                        case 1:
                            dataType = opts.RequestMetadataOpts?.PayloadTypeFactory?.Invoke(
                                request, args) ?? typeof(TRequestMetadata);

                            break;
                        case 2:
                            dataType = opts.RequestBodyOpts?.PayloadTypeFactory?.Invoke(
                                request, args) ?? typeof(TRequestBody);

                            break;
                        case 3:
                            dataType = null;
                            break;
                        default:
                            throw new TrmrkException($"Too many items in structured free text (no more than 4 supported)");
                    }

                    return dataType;
                }
            });

            request.GlobalMetadata = parsedObj.Items[0].Payload as TrmrkStructuredFreeTextDataItemPart<TGlobalMetadata>;
            request.RequestMetadata = parsedObj.Items[1].Payload as TrmrkStructuredFreeTextDataItemPart<TRequestMetadata>;
            request.RequestBody = parsedObj.Items[2].Payload as TrmrkStructuredFreeTextDataItemPart<TRequestBody>;

            return request;
        }
    }
}
