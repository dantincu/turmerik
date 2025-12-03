using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.TextSerialization;
using O = Turmerik.Core.TextParsing.StructuredFreeText.TrmrkStructuredFreeTextWebRequestO;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.TextParsing.StructuredFreeText
{
    public interface ITrmrkStructuredFreeTextWebRequestHandler<TGlobalMetadata>
        where TGlobalMetadata : TrmrkWebGlobalMetadataCore
    {
        Task<TrmrkStructuredFreeTextWebRequestHandlerResult> ExecuteAsync(
            TrmrkStructuredFreeTextWebRequestHandlerOpts opts);
    }

    public interface ITrmrkStructuredFreeTextWebRequestHandler : ITrmrkStructuredFreeTextWebRequestHandler<TrmrkWebGlobalMetadataCore>
    {
    }

    public class TrmrkStructuredFreeTextWebRequestHandlerOpts
    {
        public string InputText { get; set; }
        public Dictionary<string, TrmrkStructuredFreeTextWebRequestActionHandlerBase> ActionHandlersMap { get; set; }
        public O.ItemOpts? GlobalMetadataOpts { get; set; }
        public Func<IJsonConversion, object, string>? Serializer { get; set; }
    }

    public class TrmrkStructuredFreeTextWebRequestHandlerResult
    {
        public string OutputText { get; set; }
        public TrmrkStructuredFreeTextWebResponse Response { get; set; }
    }

    public class TrmrkStructuredFreeTextWebRequestHandler<TGlobalMetadata> : ITrmrkStructuredFreeTextWebRequestHandler<TGlobalMetadata>
        where TGlobalMetadata : TrmrkWebGlobalMetadataCore
    {
        protected readonly ITrmrkStructuredFreeTextWebSerializer TrmrkStructuredFreeTextWebSerializer;

        public TrmrkStructuredFreeTextWebRequestHandler(
            ITrmrkStructuredFreeTextWebSerializer trmrkStructuredFreeTextWebSerializer)
        {
            TrmrkStructuredFreeTextWebSerializer = trmrkStructuredFreeTextWebSerializer ?? throw new ArgumentNullException(
                nameof(trmrkStructuredFreeTextWebSerializer));
        }

        public async Task<TrmrkStructuredFreeTextWebRequestHandlerResult> ExecuteAsync(
            TrmrkStructuredFreeTextWebRequestHandlerOpts opts)
        {
            TrmrkStructuredFreeTextItem globalMetadataItem = null!;
            TrmrkStructuredFreeTextWebRequestActionHandlerBase actionHandler = null!;

            var webRequest = TrmrkStructuredFreeTextWebSerializer.DeserializeRequest(new ()
            {
                GlobalMetadataOpts = new ()
                {
                    MetadataTypeFactory = opts.GlobalMetadataOpts?.MetadataTypeFactory,
                    PayloadTypeFactory = (request, args) =>
                    {
                        globalMetadataItem = args.Item;

                        var globalMetadataType = opts.GlobalMetadataOpts?.PayloadTypeFactory?.Invoke(
                            request, args) ?? typeof(TGlobalMetadata);

                        return globalMetadataType;
                    }
                },
                RequestMetadataOpts = new ()
                {
                    MetadataTypeFactory = (request, args) =>
                    {
                        var globalMetadata = globalMetadataItem.Payload!.CastOrDefault<TrmrkStructuredFreeTextDataItemPartBase>(
                            ).GetData().CastOrDefault<TGlobalMetadata>();

                        var requestDataTypeKey = globalMetadata.DataTypeKey;
                        actionHandler = opts.ActionHandlersMap[requestDataTypeKey];

                        var retDataType = actionHandler.GetRequestBodyMetadataType(request, args);
                        return retDataType;
                    },
                    PayloadTypeFactory = actionHandler.GetRequestBodyPayloadType
                },
                RequestBodyOpts = new ()
                {
                    MetadataTypeFactory = actionHandler.GetRequestBodyMetadataType,
                    PayloadTypeFactory = actionHandler.GetRequestBodyPayloadType
                }
            });

            var response = await actionHandler.ExecuteAsync(webRequest);

            var responseText = TrmrkStructuredFreeTextWebSerializer.SerializeResponse(new()
            {
                GlobalMetadata = globalMetadataItem,
                JsonSerializer = opts.Serializer,
                TextLines = response.TextLines,
                ResponseMetadata = response.ResponseMetadata,
                ResponseBody = response.ResponseBody,
                ResponseBodyFreeText = response.ResponseBodyFreeText,
            });

            var result = new TrmrkStructuredFreeTextWebRequestHandlerResult
            {
                OutputText = responseText,
                Response = response,
            };

            return result;
        }
    }

    public class TrmrkStructuredFreeTextWebRequestHandler : TrmrkStructuredFreeTextWebRequestHandler<TrmrkWebGlobalMetadataCore>, ITrmrkStructuredFreeTextWebRequestHandler
    {
        public TrmrkStructuredFreeTextWebRequestHandler(
            ITrmrkStructuredFreeTextWebSerializer trmrkStructuredFreeTextWebSerializer) : base(trmrkStructuredFreeTextWebSerializer)
        {
        }
    }
}
