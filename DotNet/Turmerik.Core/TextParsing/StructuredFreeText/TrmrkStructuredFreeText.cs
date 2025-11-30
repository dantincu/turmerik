using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.Core.TextParsing.StructuredFreeText
{
    public class TrmrkStructuredFreeText
    {
        public string RawText { get; set; }
        public string[] RawTextLines { get; set; }
        public List<TrmrkStructuredFreeTextItem> Items { get; set; }
    }

    public class TrmrkStructuredFreeTextItem
    {
        public TrmrkStructuredFreeTextItemPart? Metadata { get; set; }
        public TrmrkStructuredFreeTextItemPart? Payload { get; set; }
    }

    public class TrmrkStructuredFreeTextItemPart
    {
        public string Text { get; set; }
        public string[] TextLines { get; set; }
    }

    public abstract class TrmrkStructuredFreeTextDataItemPartBase : TrmrkStructuredFreeTextItemPart
    {
        public abstract object GetData();
        public abstract void SetData(object obj);
    }

    public class TrmrkStructuredFreeTextDataItemPart<TData> : TrmrkStructuredFreeTextDataItemPartBase
    {
        public TData Data { get; set; }

        public override object GetData() => Data;

        public override void SetData(object obj) => Data = obj != null ? (TData)obj : default;
    }

    public class TrmrkStructuredFreeTextDeserializeOptsCore<TFactory>
    {
        public TFactory? MetadataTypeFactory { get; set; }
        public TFactory? PayloadTypeFactory { get; set; }
    }

    public class TrmrkStructuredFreeTextDeserializeTypeFactoryArgs
    {
        public TrmrkStructuredFreeTextItem Item { get; set; }
        public int ItemIdx { get; set; }
        public string Text { get; set; }
        public string[] TextLines { get; set; }
        public int StartLineIdx { get; set; }
        public int PartLinesCount { get; set; }
    }

    public class TrmrkStructuredFreeTextDeserializeOpts : TrmrkStructuredFreeTextDeserializeOptsCore<Func<TrmrkStructuredFreeTextDeserializeTypeFactoryArgs, Type?>>
    {
        public string Text { get; set; }
    }

    public class TrmrkWebGlobalMetadataCore
    {
        public int ClientVersion { get; set; }
        public string DataTypeKey { get; set; }
    }

    public class TrmrkWebRequestGlobalMetadataCore : TrmrkWebGlobalMetadataCore
    {
    }

    public class TrmrkWebResponseGlobalMetadataCore : TrmrkWebGlobalMetadataCore
    {
    }

    public static class TrmrkStructuredFreeTextWebRequestO
    {
        public class ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody> : TrmrkStructuredFreeTextDeserializeOptsCore<
            Func<TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody>,
                TrmrkStructuredFreeTextDeserializeTypeFactoryArgs, Type?>>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
        }

        public class ItemOptsAnyMetadata<TGlobalMetadata, TRequestBody> : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>
        {
        }

        public class ItemOptsAnyBody<TGlobalMetadata, TRequestMetadata> : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>
        {
        }

        public class ItemOptsAnyMetadataAnyBody<TGlobalMetadata> : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, object>
        {
        }

        public class ItemOptsAnyGlobal<TRequestMetadata, TRequestBody> : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>
        {
        }

        public class ItemOptsAnyGlobalAnyMetadata<TRequestBody> : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>
        {
        }

        public class ItemOptsAnyGlobalAnyBody<TRequestMetadata> : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>
        {
        }

        public class ItemOptsAnyGlobalAnyMetadataAnyBody : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, object>
        {
        }

        public class OptsCore<TItemOpts, TGlobalMetadata, TRequestMetadata, TRequestBody>
            where TItemOpts : ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
            public string Text { get; set; }
            public TItemOpts? GlobalMetadataOpts { get; set; }
            public TItemOpts? RequestMetadataOpts { get; set; }
            public TItemOpts? RequestBodyOpts { get; set; }
        }

        public class OptsAnyMetadata<TItemOpts, TGlobalMetadata, TRequestBody> : OptsCore<TItemOpts, TGlobalMetadata, object, TRequestBody>
            where TItemOpts : ItemOptsCore<TGlobalMetadata, object, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
        }

        public class OptsAnyBody<TItemOpts, TGlobalMetadata, TRequestMetadata> : OptsCore<TItemOpts, TGlobalMetadata, TRequestMetadata, object>
            where TItemOpts : ItemOptsCore<TGlobalMetadata, TRequestMetadata, object>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
        }

        public class OptsAnyMetadataAnyBody<TItemOpts, TGlobalMetadata> : OptsCore<TItemOpts, TGlobalMetadata, object, object>
            where TItemOpts : ItemOptsCore<TGlobalMetadata, object, object>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
        }

        public class Opts<TGlobalMetadata, TRequestMetadata, TRequestBody> : OptsCore<
            ItemOptsCore<TGlobalMetadata, TRequestMetadata, TRequestBody>, TGlobalMetadata, TRequestMetadata, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
        }

        public class OptsAnyMetadata<TGlobalMetadata, TRequestBody> : OptsCore<
            ItemOptsCore<TGlobalMetadata, object, TRequestBody>, TGlobalMetadata, object, TRequestBody>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
        }

        public class OptsAnyBody<TGlobalMetadata, TRequestMetadata> : OptsCore<
            ItemOptsCore<TGlobalMetadata, TRequestMetadata, object>, TGlobalMetadata, TRequestMetadata, object>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
        }

        public class OptsAnyMetadataAnyBody<TGlobalMetadata> : OptsCore<
            ItemOptsCore<TGlobalMetadata, object, object>, TGlobalMetadata, object, object>
            where TGlobalMetadata : TrmrkWebRequestGlobalMetadataCore
        {
        }

        public class OptsAnyGlobal<TItemOpts, TRequestMetadata, TRequestBody> : OptsCore<TItemOpts, TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>
            where TItemOpts : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>
        {
        }

        public class OptsAnyGlobalAnyMetadata<TItemOpts, TRequestBody> : OptsCore<TItemOpts, TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>
            where TItemOpts : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>
        {
        }

        public class OptsAnyGlobalAnyBody<TItemOpts, TRequestMetadata> : OptsCore<TItemOpts, TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>
            where TItemOpts : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>
        {
        }

        public class OptsAnyGlobalAnyMetadataAnyBody<TItemOpts> : OptsCore<TItemOpts, TrmrkWebRequestGlobalMetadataCore, object, object>
            where TItemOpts : ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, object>
        {
        }

        public class OptsAnyGlobal<TRequestMetadata, TRequestBody> : OptsCore<
            ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>, TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, TRequestBody>
        {
        }

        public class OptsAnyGlobalAnyMetadata<TRequestBody> : OptsCore<
            ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>, TrmrkWebRequestGlobalMetadataCore, object, TRequestBody>
        {
        }

        public class OptsAnyGlobalAnyBody<TRequestMetadata> : OptsCore<
            ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>, TrmrkWebRequestGlobalMetadataCore, TRequestMetadata, object>
        {
        }

        public class OptsAnyGlobalAnyMetadataAnyBody : OptsAnyGlobal<
            ItemOptsCore<TrmrkWebRequestGlobalMetadataCore, object, object>, object, object>
        {
        }
    }

    public class TrmrkStructuredFreeTextWebRequest<TGlobalMetadata, TRequestMetadata, TRequestBody>
    {
        public string[] TextLines { get; set; }
        public TrmrkStructuredFreeTextDataItemPart<TGlobalMetadata>? GlobalMetadata { get; set; }
        public TrmrkStructuredFreeTextDataItemPart<TRequestMetadata>? RequestMetadata { get; set; }
        public TrmrkStructuredFreeTextDataItemPart<TRequestBody>? RequestBody { get; set; }
        public TrmrkStructuredFreeTextItem? GlobalMetadataItem { get; set; }
        public TrmrkStructuredFreeTextItem? RequestMetadataItem { get; set; }
        public TrmrkStructuredFreeTextItem? RequestBodyItem { get; set; }
        public string? RequestBodyFreeText { get; set; }
    }

    public class TrmrkStructuredFreeTextWebResponseSerializeOpts
    {
        public TrmrkWebResponseGlobalMetadataCore? GlobalMetadata { get; set; }
        public object? ResponseMetadata { get; set; }
        public object? ResponseBody { get; set; }
        public string? ResponseBodyFreeText { get; set; }
        public Func<IJsonConversion, object, string>? JsonSerializer { get; set; }
    }
}
