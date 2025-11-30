using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using O = Turmerik.Core.TextParsing.StructuredFreeText.TrmrkStructuredFreeTextWebRequestO;

namespace Turmerik.Core.TextParsing.StructuredFreeText
{
    public interface ITrmrkStructuredFreeTextWebSerializer
    {
        TrmrkStructuredFreeTextWebRequest DeserializeRequest(O.Opts opts);
        string SerializeResponse(TrmrkStructuredFreeTextWebResponseSerializeOpts opts);
    }

    public class TrmrkStructuredFreeTextWebSerializer : ITrmrkStructuredFreeTextWebSerializer
    {
        private readonly ITrmrkStructuredFreeTextSerializer trmrkStructuredFreeTextSerializer;

        public TrmrkStructuredFreeTextWebSerializer(
            ITrmrkStructuredFreeTextSerializer trmrkStructuredFreeTextSerializer)
        {
            this.trmrkStructuredFreeTextSerializer = trmrkStructuredFreeTextSerializer ?? throw new ArgumentNullException(
                nameof(trmrkStructuredFreeTextSerializer));
        }

        public TrmrkStructuredFreeTextWebRequest DeserializeRequest(
            O.Opts opts)
        {
            var request = new TrmrkStructuredFreeTextWebRequest();

            var parsedObj = trmrkStructuredFreeTextSerializer.Deserialize(new()
            {
                Text = opts.Text,
                MetadataTypeFactory = (args) =>
                {
                    Type? dataType;

                    switch (args.ItemIdx)
                    {
                        case 0:
                            request.GlobalMetadata = args.Item;

                            dataType = opts.GlobalMetadataOpts?.MetadataTypeFactory?.Invoke(
                                request, args);

                            break;
                        case 1:
                            request.RequestMetadata = args.Item;

                            dataType = opts.RequestMetadataOpts?.MetadataTypeFactory?.Invoke(
                                request, args);

                            break;
                        case 2:
                            request.RequestBody = args.Item;

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
                                request, args);

                            break;
                        case 1:
                            dataType = opts.RequestMetadataOpts?.PayloadTypeFactory?.Invoke(
                                request, args);

                            break;
                        case 2:
                            dataType = opts.RequestBodyOpts?.PayloadTypeFactory?.Invoke(
                                request, args);

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

            return request;
        }

        public string SerializeResponse(
            TrmrkStructuredFreeTextWebResponseSerializeOpts opts) => opts.GlobalMetadata.Arr(
            opts.ResponseMetadata,
            opts.ResponseBody).NotNull().Select(
                item => trmrkStructuredFreeTextSerializer.Serialize(
                    item!, opts.JsonSerializer)).Concat([
                opts.ResponseBodyFreeText]).ToArray()!.JoinStr(
                Environment.NewLine);
    }
}
