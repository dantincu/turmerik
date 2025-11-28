using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.Core.TextParsing.StructuredFreeText
{
    public interface ITrmrkStructuredFreeTextSerializer
    {
        TrmrkStructuredFreeText Deserialize(
            TrmrkStructuredFreeTextDeserializeOpts opts);

        string Serialize(
            TrmrkStructuredFreeText freeText,
            Func<IJsonConversion, object, string>? serializer = null);

        string Serialize(
            TrmrkStructuredFreeTextItem freeTextItem,
            Func<IJsonConversion, object, string>? serializer = null);

        string Serialize(
            TrmrkStructuredFreeTextItemPart freeTextItemPart,
            Func<IJsonConversion, object, string>? serializer = null);
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
                Items = new()
            };

            int textLinesCount = rawTextLines.Length;
            var state = ItemParseState.FirstLine;
            var newState = ItemParseState.FirstLine;
            var currentItem = new TrmrkStructuredFreeTextItem();
            int metadataLinesCount = 0;
            int payloadLinesCount = 0;
            int textPartLineIdx = 0;
            int itemIdx = 0;
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
                        else
                        {
                            result.Items.Add(currentItem);
                            currentItem = new TrmrkStructuredFreeTextItem();
                            itemIdx++;
                        }

                        break;
                    case ItemParseState.Metadata:
                        if (++textPartLineIdx == metadataLinesCount)
                        {
                            currentItem.Metadata = GetItemPart(new ()
                            {
                                Item = currentItem,
                                RawText = opts.Text,
                                RawTextLines = rawTextLines,
                                ItemIdx = itemIdx,
                                StartLineIdx = i,
                                PartLinesCount = metadataLinesCount,
                                DeserializationTypeFactory = opts.MetadataTypeFactory
                            });

                            newState = ItemParseState.Payload;
                            textPartLineIdx = 0;
                        }
                        break;
                    case ItemParseState.Payload:
                        if (++textPartLineIdx == payloadLinesCount)
                        {
                            currentItem.Payload = GetItemPart(new()
                            {
                                Item = currentItem,
                                RawText = opts.Text,
                                RawTextLines = rawTextLines,
                                ItemIdx = itemIdx,
                                StartLineIdx = i,
                                PartLinesCount = payloadLinesCount,
                                DeserializationTypeFactory = opts.PayloadTypeFactory
                            });

                            newState = ItemParseState.FirstLine;
                            textPartLineIdx = 0;

                            result.Items.Add(currentItem);
                            currentItem = new TrmrkStructuredFreeTextItem();
                            itemIdx++;
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
            Func<IJsonConversion, object, string>? serializer = null)
        {
            string[] itemsArr = freeText.Items.Select(
                item => Serialize(item, serializer)).ToArray();

            string output = string.Join(Environment.NewLine, itemsArr);
            return output;
        }

        public string Serialize(
            TrmrkStructuredFreeTextItem freeTextItem,
            Func<IJsonConversion, object, string>? serializer = null)
        {
            string? metadataText = freeTextItem.Metadata?.With(
                metadata => Serialize(metadata, serializer));

            string? payloadText = freeTextItem.Payload?.With(
                payload => Serialize(payload, serializer));

            string[] partsArr = metadataText.Arr(
                payloadText).NotNull().ToArray()!;

            int[] itemsLenArr = partsArr.Select(
                part => part.Split('\n').Length).ToArray();

            string itemsLenArrJsonStr = jsonConversion.Adapter.Serialize(
                itemsLenArr, false, true, Formatting.None);

            string output = string.Join(
                Environment.NewLine,
                partsArr.PrependToArr(
                    itemsLenArrJsonStr));

            return output;
        }

        public string Serialize(
            TrmrkStructuredFreeTextItemPart freeTextItemPart,
            Func<IJsonConversion, object, string>? serializer = null)
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

        private TrmrkStructuredFreeTextItemPart? GetItemPart(
            GetItemPartArgs args) => args.DeserializationTypeFactory?.With(
                factory => GetItemPart(
                    args.RawTextLines, args.StartLineIdx,
                    args.PartLinesCount,
                    factory(new()
                    {
                        Item = args.Item,
                        Text = args.RawText,
                        TextLines = args.RawTextLines,
                        StartLineIdx = args.StartLineIdx,
                        PartLinesCount = args.PartLinesCount,
                        ItemIdx = args.ItemIdx,
                    })));

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

        private class GetItemPartArgs
        {
            public TrmrkStructuredFreeTextItem Item { get; set; }
            public string RawText { get; set; }
            public string[] RawTextLines { get; set; }
            public int StartLineIdx { get; set; }
            public int PartLinesCount { get; set; }
            public int ItemIdx { get; set; }
            public Func<TrmrkStructuredFreeTextDeserializeTypeFactoryArgs, Type?>? DeserializationTypeFactory { get; set; }
        }
    }
}
