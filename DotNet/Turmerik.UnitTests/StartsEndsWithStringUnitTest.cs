using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Text;

namespace Turmerik.UnitTests
{
    public class StartsEndsWithStringUnitTest : UnitTestBase
    {
        [Fact]
        public void MainStartsWithTest()
        {
            PerformStartsWithTest(
                "asdfqwer",
                "asdf",
                true,
                0);

            PerformStartsWithTest(
                "asdfqwer",
                "sdfq",
                true,
                1);

            PerformStartsWithTest(
                "asdfqwer",
                "dfqw",
                true,
                2);

            PerformStartsWithTest(
                "asdfqwer",
                "sdfq",
                false,
                0);

            PerformStartsWithTest(
                "asdfqwer",
                "dfqw",
                false,
                1);

            PerformStartsWithTest(
                "asdfqwer",
                "fqwe",
                false,
                2);
        }

        [Fact]
        public void MainEndsWithTest()
        {
            PerformEndsWithTest(
                "asdfqwer",
                "qwer",
                true,
                8);

            PerformEndsWithTest(
                "asdfqwer",
                "fqwe",
                true,
                7);

            PerformEndsWithTest(
                "asdfqwer",
                "dfqw",
                true,
                6);

            PerformEndsWithTest(
                "asdfqwer",
                "fqwe",
                false,
                8);

            PerformEndsWithTest(
                "asdfqwer",
                "dfqw",
                false,
                7);

            PerformEndsWithTest(
                "asdfqwer",
                "sdfq",
                false,
                6);
        }

        private void PerformStartsWithTest(
            string inputText,
            string startingText,
            bool expectedValue,
            int startIdx)
        {
            bool actualValue = inputText.StartsWithStr(
                startIdx,
                startingText);

            Assert.Equal(expectedValue, actualValue);
        }

        private void PerformEndsWithTest(
            string inputText,
            string endingText,
            bool expectedValue,
            int endIdx)
        {
            bool actualValue = inputText.EndsWithStr(
                endIdx,
                endingText);

            Assert.Equal(expectedValue, actualValue);
        }
    }
}
