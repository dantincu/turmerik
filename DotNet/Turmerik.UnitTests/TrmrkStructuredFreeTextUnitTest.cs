using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextParsing.StructuredFreeText;
using Turmerik.Core.TextSerialization;

namespace Turmerik.UnitTests
{
    public class TrmrkStructuredFreeTextUnitTest : UnitTestBase
    {
        private readonly ITrmrkStructuredFreeTextSerializer trmrkStructuredFreeTextSerializer;

        public TrmrkStructuredFreeTextUnitTest()
        {
            trmrkStructuredFreeTextSerializer = SvcProv.GetRequiredService<ITrmrkStructuredFreeTextSerializer>();
        }

        [Fact]
        public void MainTest()
        {
            foreach (var formatting in Formatting.None.Arr(Formatting.Indented))
            {
                PerformTest(new()
                {
                    FreeText = new()
                    {
                        Items = [
                            new ()
                        {
                            Metadata = new TrmrkStructuredFreeTextDataItemPart<Tuple<int, string>>
                            {
                                Data = new (123, "qwer"),
                            },
                            Payload = new TrmrkStructuredFreeTextDataItemPart<KeyValuePair<int, string>>
                            {
                                Data = new (456, "zxcv")
                            }
                        },
                        new ()
                        {
                            Metadata = new TrmrkStructuredFreeTextDataItemPart<Tuple<string, DateTime>>
                            {
                                Data = new ("asdf", new DateTime(123)),
                            },
                            Payload = new TrmrkStructuredFreeTextDataItemPart<KeyValuePair<string, DateTime>>
                            {
                                Data = new ("fgjh", new DateTime(456)),
                            }
                        }
                        ]
                    },
                    Serializer = (conversion, obj) => conversion.Adapter.Serialize(obj, false, true, formatting),
                    AssertAction = (expected, actual) =>
                    {
                        Assert.Equal(2, actual.Items.Count);

                        var metadata0 = actual.Items[0].Metadata as TrmrkStructuredFreeTextDataItemPart<Tuple<int, string>>;
                        var payload0 = actual.Items[0].Payload as TrmrkStructuredFreeTextDataItemPart<KeyValuePair<int, string>>;
                        var metadata1 = actual.Items[1].Metadata as TrmrkStructuredFreeTextDataItemPart<Tuple<string, DateTime>>;
                        var payload1 = actual.Items[1].Payload as TrmrkStructuredFreeTextDataItemPart<KeyValuePair<string, DateTime>>;

                        Assert.NotNull(metadata0);
                        Assert.NotNull(payload0);
                        Assert.NotNull(metadata1);
                        Assert.NotNull(payload1);

                        Assert.Equal(123,
                            metadata0.Data.Item1);

                        Assert.Equal("qwer",
                            metadata0.Data.Item2);

                        Assert.Equal(456,
                            payload0.Data.Key);

                        Assert.Equal("zxcv",
                            payload0.Data.Value);

                        Assert.Equal("asdf",
                            metadata1.Data.Item1);

                        Assert.Equal(123,
                            metadata1.Data.Item2.Ticks);

                        Assert.Equal("fgjh",
                            payload1.Data.Key);

                        Assert.Equal(456,
                            payload1.Data.Value.Ticks);
                    }
                });
            }
        }

        private void PerformTest(
            TestOpts opts)
        {
            string freeText = trmrkStructuredFreeTextSerializer.Serialize(
                opts.FreeText, opts.Serializer);

            var actualFreeText = trmrkStructuredFreeTextSerializer.Deserialize(new ()
            {
                Text = freeText,
                MetadataTypeFactory = (_, i) => (opts.FreeText.Items[i].Metadata as TrmrkStructuredFreeTextDataItemPartBase)?.GetData().GetType(),
                PayloadTypeFactory = (_, i) => (opts.FreeText.Items[i].Payload as TrmrkStructuredFreeTextDataItemPartBase)!.GetData().GetType()
            });

            opts.AssertAction(
                opts.FreeText,
                actualFreeText);
        }

        private class TestOpts
        {
            public TrmrkStructuredFreeText FreeText { get; set; }
            public Func<IJsonConversion, object, string> Serializer { get; set; }
            public Action<TrmrkStructuredFreeText, TrmrkStructuredFreeText> AssertAction { get; set; }
        }
    }
}
