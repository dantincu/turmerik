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
        public TrmrkStructuredFreeText Result { get; set; }
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
        public class ItemOpts : TrmrkStructuredFreeTextDeserializeOptsCore<
            Func<TrmrkStructuredFreeTextWebRequest, TrmrkStructuredFreeTextDeserializeTypeFactoryArgs, Type?>>
        {
        }

        public class Opts
        {
            public string Text { get; set; }
            public ItemOpts? GlobalMetadataOpts { get; set; }
            public ItemOpts? RequestMetadataOpts { get; set; }
            public ItemOpts? RequestBodyOpts { get; set; }
        }
    }

    public class TrmrkStructuredFreeTextWebRequest
    {
        public string[] TextLines { get; set; }
        public TrmrkStructuredFreeTextItem? GlobalMetadata { get; set; }
        public TrmrkStructuredFreeTextItem? RequestMetadata { get; set; }
        public TrmrkStructuredFreeTextItem? RequestBody { get; set; }
        public string? RequestBodyFreeText { get; set; }
    }

    public class TrmrkStructuredFreeTextWebResponse
    {
        public string[] TextLines { get; set; }
        public TrmrkStructuredFreeTextItem? GlobalMetadata { get; set; }
        public TrmrkStructuredFreeTextItem? ResponseMetadata { get; set; }
        public TrmrkStructuredFreeTextItem? ResponseBody { get; set; }
        public string? ResponseBodyFreeText { get; set; }
    }

    public class TrmrkStructuredFreeTextWebResponseSerializeOpts : TrmrkStructuredFreeTextWebResponse
    {
        public Func<IJsonConversion, object, string>? JsonSerializer { get; set; }
    }
}
