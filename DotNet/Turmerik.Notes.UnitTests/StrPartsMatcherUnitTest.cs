using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Text;

namespace Turmerik.Notes.UnitTests
{
    public class StrPartsMatcherUnitTest : UnitTestBase
    {
        private readonly IStrPartsMatcher strPartsMatcher;

        public StrPartsMatcherUnitTest()
        {
            strPartsMatcher = SvcProv.GetRequiredService<IStrPartsMatcher>();
        }

        [Fact]
        public void MainTest()
        {
            PerformTest(["asdfsadf"]);
            PerformTest(["asdfsadf", "qwwqerw"], " ");
            PerformTest(["asdfsadf", "qwwqerw"]);
            PerformTest(["asdfsadf", "qwwqerw", "zxcvzxcv"]);
            PerformTest(["asdfsadf", "qwwqerw", "zxcvzxcv"], " ");

            PerformTest("asdfqwerzxcv", ["asdf", "zxcv"], true);
            PerformTest("asdfqwerzxcvp", ["asdf", "zxcv"], false);
            PerformTest("pasdfqwerzxcv", ["asdf", "zxcv"], false);
            PerformTest("pasdfqwerzxcv", ["", "asdf", "zxcv"], true);
            PerformTest("asdfqwerzxcvp", ["asdf", "zxcv", ""], true);
            PerformTest("pasdfqwerzxcvp", ["", "asdf", "zxcv", ""], true);
        }

        private void PerformTest(
            string[] strParts,
            string joinStr = null) => PerformTest(
                joinStr + strParts.JoinStr(joinStr) + joinStr,
                strParts,
                string.IsNullOrEmpty(joinStr));

        private void PerformTest(
            string inputStr,
            string[] strParts,
            bool expectedResult)
        {
            bool actualResult = strPartsMatcher.Matches(
                new StrPartsMatcherOptions
                {
                    InputStr = inputStr,
                    StrParts = strParts,
                });

            Assert.Equal(expectedResult, actualResult);
        }
    }
}
