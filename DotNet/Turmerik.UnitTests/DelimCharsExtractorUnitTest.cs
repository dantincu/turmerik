using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.TextStream;
using Xunit.Sdk;

namespace Turmerik.UnitTests
{
    public class DelimCharsExtractorUnitTest : UnitTestBase
    {
        private readonly IDelimCharsExtractor delimCharsExtractor;

        public DelimCharsExtractorUnitTest()
        {
            delimCharsExtractor = SvcProv.GetRequiredService<IDelimCharsExtractor>();
        }

        [Fact]
        public void Test1()
        {
            PerformTest("asdf:qwer:zxcv", [
                "asdf", "qwer", "zxcv"]);
        }

        [Fact]
        public void Test2()
        {
            PerformTest(":asdf:qwer:zxcv", [
                "", "asdf", "qwer", "zxcv"]);
        }

        [Fact]
        public void Test3()
        {
            PerformTest(":asdf:qwer:zxcv:", [
                "", "asdf", "qwer", "zxcv", ""]);
        }

        [Fact]
        public void Test4()
        {
            PerformTest("asdf:qwer:zxcv:", [
                "asdf", "qwer", "zxcv", ""]);
        }

        [Fact]
        public void Test5()
        {
            PerformTest("asdf::qwer::zxcv", [
                "asdf:qwer:zxcv"]);
        }

        [Fact]
        public void Test6()
        {
            PerformTest("::asdf::qwer::zxcv", [
                ":asdf:qwer:zxcv"]);
        }

        [Fact]
        public void Test7()
        {
            PerformTest("::asdf::qwer::zxcv::", [
                ":asdf:qwer:zxcv:"]);
        }

        [Fact]
        public void Test8()
        {
            PerformTest("asdf::qwer::zxcv::", [
                "asdf:qwer:zxcv:"]);
        }

        [Fact]
        public void Test9()
        {
            PerformTest("asdf:::qwer:::?::zxcv", [
                "asdf:", "qwer:", ":zxcv"]);
        }

        [Fact]
        public void Test10()
        {
            PerformTest("asdf:::qwer:??::zxcv", [
                "asdf:", "qwer", "?:zxcv"]);
        }

        [Fact]
        public void Test11()
        {
            PerformTest("asdf:::qwer:::??::zxcv", [
                "asdf:", "qwer:", "?:zxcv"]);
        }

        private void PerformTest(
            string inStr,
            string[] expectedOutputArr,
            char delimChar = ':',
            char emptyChar = '?')
        {
            var actualOutputArr = delimCharsExtractor.SplitStr(
                inStr, delimChar, emptyChar);

            AssertSequenceEqual(
                expectedOutputArr,
                actualOutputArr);
        }
    }
}
