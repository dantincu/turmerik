using Newtonsoft.Json;
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
        public TrmrkStructuredFreeTextItemPart Payload { get; set; }
        public TrmrkStructuredFreeTextItemPart? Metadata { get; set; }
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

    public interface ITrmrkStructuredFreeTextSerializer
    {
        TrmrkStructuredFreeText Deserialize(
            TrmrkStructuredFreeTextDeserializeOpts opts);

        string Serialize(
            TrmrkStructuredFreeText freeText,
            Func<IJsonConversion, object, string> serializer = null);

        string Serialize(
            TrmrkStructuredFreeTextItem freeTextItem,
            Func<IJsonConversion, object, string> serializer = null);

        string Serialize(
            TrmrkStructuredFreeTextItemPart freeTextItemPart,
            Func<IJsonConversion, object, string> serializer = null);
    }

    public class TrmrkStructuredFreeTextDeserializeOpts
    {
        public string Text { get; set; }
        public Func<TrmrkStructuredFreeTextItem, int, Type?>? MetadataTypeFactory { get; set; }
        public Func<TrmrkStructuredFreeTextItem, int, Type> PayloadTypeFactory { get; set; }
    }

    public class TrmrkStructuredFreeTextSerializer : ITrmrkStructuredFreeTextSerializer
    {
        private static readonly Type DataItemPartGenericTypeDef = typeof(
            TrmrkStructuredFreeTextDataItemPart<object>).GetGenericTypeDefinition();

        private IJsonConversion jsonConversion;

        public TrmrkStructuredFreeTextSerializer(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));
        }

        public TrmrkStructuredFreeText Deserialize(
            TrmrkStructuredFreeTextDeserializeOpts opts)
        {
            var rawTextLines = opts.Text.Split('\n');

            var result = new TrmrkStructuredFreeText
            {
                RawText = opts.Text,
                RawTextLines = rawTextLines,
                Items = new ()
            };

            int textLinesCount = rawTextLines.Length;
            var state = ItemParseState.FirstLine;
            var newState = ItemParseState.FirstLine;
            var currentItem = new TrmrkStructuredFreeTextItem();
            int metadataLinesCount = 0;
            int payloadLinesCount = 0;
            int textPartLineIdx = 0;
            int textPartIdx = 0;
            int[] linesCountArr = [];
            int payloadLineIdx = 0;

            for (int i = 0; i < textLinesCount; i++)
            {
                string line = rawTextLines[i];

                switch (state)
                {
                    case ItemParseState.FirstLine:
                        linesCountArr = jsonConversion.Adapter.Deserialize<int[]>(line);
                        payloadLineIdx = linesCountArr.Length - 1;
                        metadataLinesCount = payloadLineIdx > 0 ? linesCountArr[0] : 0;
                        payloadLinesCount = linesCountArr[payloadLineIdx];

                        if (metadataLinesCount > 0)
                        {
                            newState = ItemParseState.Metadata;
                        }
                        else if (payloadLinesCount > 0)
                        {
                            newState = ItemParseState.Payload;
                        }
                        
                        break;
                    case ItemParseState.Metadata:
                        if (++textPartLineIdx == metadataLinesCount)
                        {
                            currentItem.Metadata = opts.MetadataTypeFactory?.Invoke(
                                currentItem, textPartIdx)?.With(metadataType => GetItemPart(
                                rawTextLines, i, metadataLinesCount, metadataType));

                            newState = ItemParseState.Payload;
                            textPartLineIdx = 0;
                        }
                        break;
                    case ItemParseState.Payload:
                        if (++textPartLineIdx == payloadLinesCount)
                        {
                            currentItem.Payload = GetItemPart(
                                rawTextLines, i, payloadLinesCount, opts.PayloadTypeFactory(
                                    currentItem, textPartIdx));

                            newState = ItemParseState.FirstLine;
                            textPartLineIdx = 0;

                            result.Items.Add(currentItem);
                            currentItem = new TrmrkStructuredFreeTextItem();
                            textPartIdx++;
                        }
                        break;
                    default:
                        throw new TrmrkException($"ItemParseState value not supported: {state}");
                }

                state = newState;
            }

            return result;
        }

        public string Serialize(
            TrmrkStructuredFreeText freeText,
            Func<IJsonConversion, object, string> serializer = null)
        {
            string[] itemsArr = freeText.Items.Select(
                item => Serialize(item, serializer)).ToArray();

            string output = string.Join(Environment.NewLine, itemsArr);
            return output;
        }

        public string Serialize(
            TrmrkStructuredFreeTextItem freeTextItem,
            Func<IJsonConversion, object, string> serializer = null)
        {
            string? metadataText = freeTextItem.Metadata?.With(metadata => Serialize(metadata, serializer));
            string payloadText = Serialize(freeTextItem.Payload, serializer);

            var itemsLenArr = new int?[]
            {
                metadataText?.Split('\n').Length,
                payloadText.Split('\n').Length,
            }.NotNull().ToArray();

            string itemsLenArrJsonStr = jsonConversion.Adapter.Serialize(
                itemsLenArr, false, true, Formatting.None);

            string output = string.Join(Environment.NewLine,
                itemsLenArrJsonStr,
                metadataText,
                payloadText);

            return output;
        }

        public string Serialize(
            TrmrkStructuredFreeTextItemPart freeTextItemPart,
            Func<IJsonConversion, object, string> serializer = null)
        {
            serializer ??= (conversion, obj) => conversion.Adapter.Serialize(
                obj, false, true, Formatting.None);

            string output;

            if (freeTextItemPart is TrmrkStructuredFreeTextDataItemPartBase freeTextDataItemPart)
            {
                var data = freeTextDataItemPart.GetData();
                output = serializer(jsonConversion, data);
            }
            else
            {
                output = freeTextItemPart.Text ?? freeTextItemPart.TextLines?.With(
                    textLines => string.Join(Environment.NewLine, textLines)) ?? string.Empty;
            }

            return output;
        }

        private TrmrkStructuredFreeTextItemPart GetItemPart(
            string[] rawTextLines,
            int i,
            int partLinesCount,
            Type? deserializationType)
        {
            TrmrkStructuredFreeTextItemPart itemPart;
            var textLines = rawTextLines.Skip(i - partLinesCount + 1).Take(partLinesCount).ToArray();
            string text = string.Join(Environment.NewLine, textLines);

            if (deserializationType != null)
            {
                var data = jsonConversion.Adapter.Deserialize(
                    text, false, true, deserializationType);

                itemPart = CreateDataItemPart(
                    deserializationType, data);
            }
            else
            {
                itemPart = new();
            }

            itemPart.Text = text;
            itemPart.TextLines = textLines;

            return itemPart;
        }

        private TrmrkStructuredFreeTextDataItemPartBase CreateDataItemPart(
            Type dataType, object data)
        {
            var itemPartType = DataItemPartGenericTypeDef.MakeGenericType(dataType);

            var itemPart = (TrmrkStructuredFreeTextDataItemPartBase)Activator.CreateInstance(
                itemPartType);

            itemPart.SetData(data);
            return itemPart;
        }

        private enum ItemParseState
        {
            FirstLine = 0,
            Metadata,
            Payload
        }
    }
}
