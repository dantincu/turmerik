using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.NetCore.Md;

namespace Turmerik.UnitTests
{
    public class TextToMdServiceUnitTest : UnitTestBase
    {
        private readonly TextToMdService textToMdService;

        public TextToMdServiceUnitTest()
        {
            textToMdService = SvcProv.GetRequiredService<TextToMdService>();
        }

        [Fact]
        public void TryParseAsMdQuotedLineMainTest()
        {
            PerformTryParseAsMdQuotedLineNonMatchingTest("asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineNonMatchingTest(" \t  asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");

            PerformTryParseAsMdQuotedLineTest(">", null);
            PerformTryParseAsMdQuotedLineTest("> ", null);
            PerformTryParseAsMdQuotedLineTest(" > ", null);

            PerformTryParseAsMdQuotedLineTest("> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(">  ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("> \t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("\t>\t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(">\t ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" >\t ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");

            PerformTryParseAsMdQuotedLineTest(" > ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("\t>  ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" \t> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("\t >\t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" >\t ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" \t>\t ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");

            PerformTryParseAsMdQuotedLineTest(">> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("> > ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("\t>> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("\t>>\t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("> >\t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" > >\t ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");

            PerformTryParseAsMdQuotedLineTest(" >>", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("\t>> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" >> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" >>\t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" >>\t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" >>\t ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");

            PerformTryParseAsMdQuotedLineTest(" > >", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest("\t> > ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" >\t> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" > >\t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" > >\t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformTryParseAsMdQuotedLineTest(" > >\t ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
        }

        [Fact]
        public void ResultTextRmMdQtLvlMainTest()
        {
            PerformResultTextRmMdQtLvlNonMatchingTest("asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlNonMatchingTest(" \t  asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");

            PerformResultTextRmMdQtLvlTest(">", "> ", null);
            PerformResultTextRmMdQtLvlTest("> ", "> ", null);
            PerformResultTextRmMdQtLvlTest(" > ", ">", null);

            PerformResultTextRmMdQtLvlTest(" > ", "> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest("> ", "> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest("> ", ">", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest(" > ", "> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest(" >  ", "> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest(" >\t ", ">", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");

            PerformResultTextRmMdQtLvlTest("\t>", ">\t", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest(">", "> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest("> ", "> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest(" > \t", "> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest("\t> ", "> ", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
            PerformResultTextRmMdQtLvlTest(" > ", ">", "asdfklajs ;kljhasd;flas 12;l2342 as;ldhfasd");
        }

        private void PerformTryParseAsMdQuotedLineNonMatchingTest(
            string line) => PerformTryParseAsMdQuotedLineTest(
                line, false, null, line);

        private void PerformTryParseAsMdQuotedLineTest(
            string mdQtStartStr, string restOfLine) => PerformTryParseAsMdQuotedLineTest(
                mdQtStartStr + restOfLine,
                true,
                mdQtStartStr,
                restOfLine);

        private void PerformTryParseAsMdQuotedLineTest(
            string line,
            bool expectedMatches,
            string expectedMdQtStartStr,
            string expectedRestOfLine)
        {
            bool actualMatches = textToMdService.TryParseAsMdQuotedLine(
                line, out string actualMdQtStartStr,
                out string actualRestOfLine);

            Assert.Equal(expectedMatches, actualMatches);
            Assert.Equal(expectedMdQtStartStr, actualMdQtStartStr);
            Assert.Equal(expectedRestOfLine, actualRestOfLine);
        }

        private void PerformResultTextRmMdQtLvlNonMatchingTest(
            string line) => PerformResultTextRmMdQtLvlTest(
                line, line);

        private void PerformResultTextRmMdQtLvlTest(
            string mdQtStartStr, string qtLevel, string restOfLine) => PerformResultTextRmMdQtLvlTest(
                mdQtStartStr + qtLevel + restOfLine,
                mdQtStartStr + restOfLine);

        private void PerformResultTextRmMdQtLvlTest(
            string inputLine,
            string expectedOutputLine)
        {
            string actualOutputLine = textToMdService.ResultTextRmMdQtLvl(inputLine, false);
            Assert.Equal(expectedOutputLine, actualOutputLine);
        }
    }
}
