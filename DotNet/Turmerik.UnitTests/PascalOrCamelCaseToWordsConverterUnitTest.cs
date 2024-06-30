using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.EqualityComparer;
using Turmerik.Core.TextParsing;

namespace Turmerik.UnitTests
{
    public class PascalOrCamelCaseToWordsConverterUnitTest : UnitTestBase
    {
        private readonly IPascalOrCamelCaseToWordsConverter converter;
        private readonly IBasicEqualityComparerFactory basicEqualityComparerFactory;

        public PascalOrCamelCaseToWordsConverterUnitTest()
        {
            converter = SvcProv.GetRequiredService<IPascalOrCamelCaseToWordsConverter>();
            basicEqualityComparerFactory = SvcProv.GetRequiredService<IBasicEqualityComparerFactory>();
        }

        [Fact]
        public void MainTest()
        {
            PerformTest(new PascalOrCamelCaseToWordsConverterOpts
            {
                InputStr = "myIdnf.AfterDot"
            }, [ "my", "Idnf", "After", "Dot" ]);

            PerformTest(new PascalOrCamelCaseToWordsConverterOpts
            {
                InputStr = "myIdnf1234.5678AfterDot"
            }, ["my", "Idnf", "12345678", "After", "Dot"]);
            PerformTest(new PascalOrCamelCaseToWordsConverterOpts
            {
                InputStr = "@#$myIdnf.AfterDot)(*"
            }, ["@#$", "my", "Idnf", "After", "Dot", ")(*"]);

            PerformTest(new PascalOrCamelCaseToWordsConverterOpts
            {
                InputStr = "myIdnf1234.!@#$AfterDot"
            }, ["my", "Idnf", "1234!@#$", "After", "Dot"]);
        }

        private void PerformTest(
            PascalOrCamelCaseToWordsConverterOpts opts,
            string[] expectedOutput)
        {
            var actualOutput = converter.SplitIntoWords(opts);
            this.AssertSequenceEqual(expectedOutput, actualOutput);
        }
    }
}
