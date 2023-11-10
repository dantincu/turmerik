using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Helpers;
using Turmerik.Text;

namespace Turmerik.UnitTests
{
    public class FilePathNormalizerUnitTest : UnitTestBase
    {
        private Tuple<string, string>[] relPathTuplesArr;
        private Tuple<string, string>[] absPathTuplesArr;
        private Tuple<string, string>[] netPathTuplesArr;
        private Tuple<string, string>[] allPathTuplesArr;

        public FilePathNormalizerUnitTest()
        {
            CreateTestData();
        }

        [Fact]
        public void NormPathTest()
        {
            foreach (var tuple in allPathTuplesArr)
            {
                PerformNormPathTest(
                    tuple.Item1, tuple.Item2);
            }
        }

        [Fact]
        public void TrimAndSplitByDirSepCharsTest()
        {
            PerformTrimAndSplitByDirSepCharsTest(
                " / asdf \\ qwer / ", "".Arr("asdf", "qwer", ""));
        }

        [Fact]
        public void RemoveStrPrnPntTest()
        {
            PerformRemPrnPntTest(
                "..".Arr("..", "asdf", "qwer", "..", "zxcv"),
                2,
                "asdf".Arr("zxcv"));
        }

        [Fact]
        public void NormRelPathTest()
        {
            foreach (var tuple in relPathTuplesArr)
            {
                PerformNormRelPathTest(
                    tuple.Item1, tuple.Item2);
            }
        }

        private void PerformNormPathTest(
            string inputPath,
            string expectedOutputPath)
        {
            expectedOutputPath = expectedOutputPath.Replace(
                Path.AltDirectorySeparatorChar,
                Path.DirectorySeparatorChar);

            if (Path.IsPathRooted(expectedOutputPath) && LocalDeviceH.IsWinOS)
            {
                expectedOutputPath = expectedOutputPath.With(
                    path => (path.Length >= 2 && path[0] == '\\' && char.IsLetter(path[1])) switch
                    {
                        false => path,
                        true => string.Concat(
                            path[1],
                            ':',
                            path.Substring(2))
                    });
            }

            string actualResult = NormPathH.NormPath(inputPath);
            Assert.Equal(expectedOutputPath, actualResult);
        }

        private void PerformTrimAndSplitByDirSepCharsTest(
            string path, string[] expectedOutput)
        {
            var actualOutput = NormPathH.TrimAndSplitByDirSepChars(path);
            AssertSequenceEqual(expectedOutput, actualOutput);
        }

        private void PerformRemPrnPntTest(
            string[] inputArr,
            int expectedOutput,
            string[] expectedArr)
        {
            var inputList = inputArr.ToList();
            var actualOutput = NormPathH.RemPrnPnt(inputList);

            Assert.Equal(expectedOutput, actualOutput);
            AssertSequenceEqual(expectedArr, inputList.ToList());
        }

        private void PerformNormRelPathTest(
            string inputPath,
            string expectedOutputPath)
        {
            expectedOutputPath = expectedOutputPath.Replace(
                Path.AltDirectorySeparatorChar,
                Path.DirectorySeparatorChar);

            var actualOutputPath = NormPathH.NormPathCore(inputPath);
            Assert.Equal(expectedOutputPath, actualOutputPath);
        }

        private void CreateTestData()
        {
            relPathTuplesArr = new Tuple<string, string>[]
            {
                Tuple.Create("asdf/qwer", "asdf/qwer"),
                Tuple.Create("./asdf/qwer", "asdf/qwer"),
                Tuple.Create("./asdf/qwer/", "asdf/qwer"),
                Tuple.Create("../asdf/qwer/", "../asdf/qwer"),
                Tuple.Create("../asdf/qwer/..", "../asdf"),
                Tuple.Create("../asdf/qwer/../", "../asdf"),
            };

            absPathTuplesArr = new Tuple<string, string>[]
                {
                    Tuple.Create("/C/asdf/qwer", "/C/asdf/qwer"),
                    Tuple.Create("/C/./asdf/qwer", "/C/asdf/qwer"),
                    Tuple.Create("/C/./asdf/qwer/", "/C/asdf/qwer"),
                    Tuple.Create("/C/tyui/../asdf/qwer/", "/C/asdf/qwer"),
                    Tuple.Create("/C/tyui/../asdf/qwer/..", "/C/asdf"),
                    Tuple.Create("/C/tyui/../asdf/qwer/../", "/C/asdf")
                };

            netPathTuplesArr = absPathTuplesArr.Select(
                tuple => Tuple.Create(
                    "/" + tuple.Item1,
                    "/" + tuple.Item2)).ToArray();

            allPathTuplesArr = relPathTuplesArr.Concat(
                absPathTuplesArr).Concat(
                netPathTuplesArr).ToArray();
        }
    }
}
