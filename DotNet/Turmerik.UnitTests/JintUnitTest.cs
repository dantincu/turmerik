using Jint;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.UnitTests
{
    public class JintUnitTest : UnitTestBase
    {
        [Fact]
        public void DefaultTest()
        {
            string js = "this.add = (x, y) => x + y;";
            var engine = new Engine().Execute(js);

            string result = engine.Evaluate($"add(1, 2)").ToString();
            Assert.Equal("3", result);
        }
    }
}
