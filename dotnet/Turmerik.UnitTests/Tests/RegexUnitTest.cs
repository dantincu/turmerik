using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Xunit;
using Turmerik.Core.Helpers;

namespace Turmerik.UnitTests.Tests
{
    public class RegexUnitTest : UnitTestBase
    {
        public static readonly Regex UriSchemeStartRegex = UriH.UriSchemeStartRegex;

        [Fact]
        public void UriSchemeStartStrTest()
        {
            string testUri = "https://localhost:8080";
            var match = UriSchemeStartRegex.Match(testUri);

            Assert.True(match.Success);
        }
    }
}
