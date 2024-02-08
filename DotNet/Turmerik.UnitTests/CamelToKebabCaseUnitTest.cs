using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Text;

namespace Turmerik.UnitTests
{
    public class CamelToKebabCaseUnitTest
    {
        [Fact]
        public void MainTest()
        {
            PerformTest(new Dictionary<string, string>
            {
                { "asdfAsdf", "ASDF_ASDF" },
                { "0asdfAsdf", "0_ASDF_ASDF" },
                { "AsdfABsdf", "ASDF_A_BSDF" },
                { "AsdfA0sdf", "ASDF_A0_SDF" },
                { "As_dfA0sdf", "AS_DF_A0_SDF" }
            });
        }

        private void PerformTest(
            Dictionary<string, string> testData)
        {
            foreach (var kvp in testData)
            {
                string inputStr = kvp.Key;
                string expectedOutput = kvp.Value;

                string actualOutput = StringH.CamelToKebabCase(
                    inputStr, true);

                Assert.Equal(
                    expectedOutput,
                    actualOutput);
            }
        }
    }
}
