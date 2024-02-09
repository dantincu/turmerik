using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;

namespace Turmerik.UnitTests
{
    public class TextMacrosReplacerUnitTest : UnitTestBase
    {
        private readonly ITextMacrosReplacer textMacrosReplacer;

        public TextMacrosReplacerUnitTest()
        {
            textMacrosReplacer = SvcProv.GetRequiredService<ITextMacrosReplacer>();
        }

        [Fact]
        public void MainTest()
        {
            PerformTest(
                "asdf<$MACRO1>qwer<$MACRO1_1>zxcv<$MACRO2>tyui",
                new Dictionary<string, string>
                {
                    { "<$MACRO1>", "Macro1_<$MACRO1_1>_Macro1" },
                    { "<$MACRO1_1>", "Macro1_1" },
                    { "<$MACRO2>", "Macro2" }
                },
                "asdfMacro1_Macro1_1_Macro1qwerMacro1_1zxcvMacro2tyui");
        }

        private void PerformTest(
            string inputText,
            Dictionary<string, string> macrosMap,
            string expectedResult)
        {
            var actualResult = textMacrosReplacer.ReplacePathMacros(new TextMacrosReplacerOpts
            {
                InputText = inputText,
                MacrosMap = macrosMap
            });

            Assert.Equal(expectedResult, actualResult);
        }
    }
}
