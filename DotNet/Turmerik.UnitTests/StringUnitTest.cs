using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Turmerik.Text;

namespace Turmerik.UnitTests
{
    public class StringUnitTest : UnitTestBase
    {
        [Fact]
        public void ReplaceAllCharsTest()
        {
            var replDictnr = new Dictionary<char, char>
            {
                { '+', '-' },
                { '/', '_' },
            };

            string baseInputStr = "pwbx0o+F+EO7NzvDH/WmhsCpk+JU64tGuRkHV0vTKJzxRE6EP9zKQqeMiw+WmUCl7M1XjysXxEKG/oNyFxL0MQ==";
            string baseOutputStr = "pwbx0o-F-EO7NzvDH_WmhsCpk-JU64tGuRkHV0vTKJzxRE6EP9zKQqeMiw-WmUCl7M1XjysXxEKG_oNyFxL0MQ==";

            AssertReplaceAllChars(baseInputStr, replDictnr, baseOutputStr);
            AssertReplaceAllChars(baseInputStr + "+", replDictnr, baseOutputStr + "-");
            AssertReplaceAllChars("/" + baseInputStr + "+", replDictnr, "_" + baseOutputStr + "-");
            AssertReplaceAllChars("/" + baseInputStr, replDictnr, "_" + baseOutputStr);

            replDictnr = new Dictionary<char, char>
            {
                { '+', '/' },
                { '/', '=' },
                { '=', '+' },
            };

            string outputStr1 = "pwbx0o/F/EO7NzvDH=WmhsCpk/JU64tGuRkHV0vTKJzxRE6EP9zKQqeMiw/WmUCl7M1XjysXxEKG=oNyFxL0MQ++";
            string outputStr2 = "pwbx0o=F=EO7NzvDH+WmhsCpk=JU64tGuRkHV0vTKJzxRE6EP9zKQqeMiw=WmUCl7M1XjysXxEKG+oNyFxL0MQ//";

            AssertReplaceAllChars(baseInputStr, replDictnr, outputStr1);
            AssertReplaceAllChars(outputStr1, replDictnr, outputStr2);
            AssertReplaceAllChars(outputStr2, replDictnr, baseInputStr);
        }

        [Fact]
        public void SliceStrTest()
        {
            AssertSliceStr("qwerasdf", 0, 0, "");
            AssertSliceStr("qwerasdf", 0, 1, "q");
            AssertSliceStr("qwerasdf", 0, -1, "qwerasdf");
            AssertSliceStr("qwerasdf", 0, -2, "qwerasd");

            AssertSliceStr("qwerasdf", 1, 0, "");
            AssertSliceStr("qwerasdf", 1, 1, "w");
            AssertSliceStr("qwerasdf", 1, -1, "werasdf");
            AssertSliceStr("qwerasdf", 1, -2, "werasd");

            AssertSliceStr("qwerasdf", -1, 0, "");
            AssertSliceStr("qwerasdf", -1, -1, "d");
            AssertSliceStr("qwerasdf", -1, -2, "sd");
            AssertSliceStr("qwerasdf", -2, 1, "d");
            AssertSliceStr("qwerasdf", -2, 2, "df");
        }

        private void AssertReplaceAllChars(string input, Dictionary<char, string> replDictnr, string expectedOutput)
        {
            string actualOutput = input.ReplaceAllChars(replDictnr);
            Assert.Equal(expectedOutput, actualOutput);
        }

        private void AssertReplaceAllChars(string input, Dictionary<char, char> replDictnr, string expectedOutput)
        {
            string actualOutput = input.ReplaceAllChars(replDictnr);
            Assert.Equal(expectedOutput, actualOutput);
        }

        private void AssertSliceStr(
            string inputString,
            int startIdx,
            int count,
            string expectedOutput)
        {
            string actualOutput = inputString.SliceStr(startIdx, count);
            Assert.Equal(expectedOutput, actualOutput);
        }
    }
}
