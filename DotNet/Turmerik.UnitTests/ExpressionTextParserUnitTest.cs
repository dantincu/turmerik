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
    public class ExpressionTextParserUnitTest : UnitTestBase
    {
        private IExpressionTextParser expressionTextParser;
        private readonly IBasicEqualityComparerFactory basicEqualityComparerFactory;

        public ExpressionTextParserUnitTest()
        {
            expressionTextParser = SvcProv.GetRequiredService<IExpressionTextParser>();
            basicEqualityComparerFactory = SvcProv.GetRequiredService<IBasicEqualityComparerFactory>();
        }

        [Fact]
        public void Test1()
        {
            PerformTest("asdf{qwer}zxcv",
                ["asdf", Tuple.Create(ExpressionTextParserState.InsideExpression, "qwer"), "zxcv"]);

            PerformTest("asdf\\{qwer}zxcv",
                ["asdf\\", Tuple.Create(ExpressionTextParserState.InsideExpression, "qwer"), "zxcv"]);

            PerformTest("asdf\\{qwer\\}zxcv",
                ["asdf\\", Tuple.Create(ExpressionTextParserState.InsideExpression, "qwer\\"), "zxcv"]);

            PerformTest("asdf{qwer{}zxcv}",
                ["asdf", Tuple.Create(ExpressionTextParserState.InsideExpression, "qwer{"), "zxcv}"]);

            PerformTest("asdf{qwer{}zxcv\\}",
                ["asdf", Tuple.Create(ExpressionTextParserState.InsideExpression, "qwer{"), "zxcv\\}"]);
        }

        [Fact]
        public void Test2()
        {
            PerformTest("asdf{{qwer}}zxcv",
                ["asdf{qwer}zxcv"]);

            PerformTest("asdf\\{{qwer}}zxcv",
                ["asdf\\{qwer}zxcv"]);

            PerformTest("asdf\\{{qwer\\}zxcv",
                ["asdf\\{qwer\\}zxcv"]);

            PerformTest("asdf\\}{{qwer}zxcv ",
                ["asdf\\}{qwer}zxcv "]);

            PerformTest("asdf{{qwer}zxcv",
                ["asdf{qwer}zxcv"]);
        }

        [Fact]
        public void Test3()
        {
            PerformTest("asdf\\@{qwer}@\\zxcv",
                ["asdf", "{qwer}", "zxcv"]);
        }

        [Fact]
        public void Test3_1()
        {
            PerformTest("asdf@\\@{qwer@}@\\@zxcv",
                ["asdf@", "{qwer@}", "@zxcv"]);
        }

        private void PerformTest(
            string inputText,
            object[] expectedOutput)
        {
            var actualOutput = expressionTextParser.Parse(new ExpressionTextParserOpts
            {
                InputStr = inputText,
                ExpressionParser = wka => Tuple.Create(
                    wka.State, wka.TextExtractor(wka))
            });

            AssertSequenceEqual(
                expectedOutput,
                actualOutput,
                basicEqualityComparerFactory,
                (o1, o2) =>
                {
                    bool areEqual;

                    if (o1 is Tuple<ExpressionTextParserState, string> t1)
                    {
                        if (o2 is Tuple<ExpressionTextParserState, string> t2)
                        {
                            areEqual = t1.Item1 == t2.Item1 && t1.Item2 == t2.Item2;
                        }
                        else
                        {
                            areEqual = false;
                        }
                    }
                    else if (o1 is string s1)
                    {
                        if (o2 is string s2)
                        {
                            areEqual = s1 == s2;
                        }
                        else
                        {
                            areEqual = false;
                        }
                    }
                    else
                    {
                        areEqual = false;
                    }

                    return areEqual;
                },
                false);
        }
    }
}
