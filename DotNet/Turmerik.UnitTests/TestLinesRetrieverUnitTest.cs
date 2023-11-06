using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.EqualityComparer;
using Turmerik.LocalDevice.UnitTests;
using Turmerik.TextStream;

namespace Turmerik.UnitTests
{
    public class TestLinesRetrieverUnitTest : UnitTestBase
    {
        private readonly ITextBufferLinesRetriever textBufferLinesRetriever;
        private readonly ITextLinesRetrieverFactory textLinesRetrieverFactory;

        private readonly IBasicEqualityComparerFactory basicEqualityComparerFactory;
        private readonly IEqualityComparer<List<string>> strListEqCompr;
        private readonly IEqualityComparer<RetrievedTextLines> retrievedTextLinesEqCompr;

        public TestLinesRetrieverUnitTest()
        {
            textBufferLinesRetriever = SvcProv.GetRequiredService<ITextBufferLinesRetriever>();
            textLinesRetrieverFactory = SvcProv.GetRequiredService<ITextLinesRetrieverFactory>();

            basicEqualityComparerFactory = SvcProv.GetRequiredService<IBasicEqualityComparerFactory>();

            strListEqCompr = basicEqualityComparerFactory.GetListBasicEqualityComparer<string>();

            retrievedTextLinesEqCompr = basicEqualityComparerFactory.GetEqualityComparer<RetrievedTextLines>(
                (first, second) =>
                {
                    bool areEqual = first.LastChunk == second.LastChunk;
                    areEqual = areEqual && first.LastLineMatches == second.LastLineMatches;
                    areEqual = areEqual && first.ReachedEndOfStream == second.ReachedEndOfStream;
                    areEqual = areEqual && first.LastNwLnIdx == second.LastNwLnIdx;
                    areEqual = areEqual && first.LastReadCharIdx == second.LastReadCharIdx;
                    areEqual = areEqual && strListEqCompr.Equals(first.Lines, second.Lines);

                    return areEqual;
                });
        }

        [Fact]
        public void BasicTest()
        {
            PerformRetrieverTest(
"\t" + @"asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk ", new TextLinesRetrieverOpts
{
    StopPredicate = (retObj, prevBuffNwLnIdx, line, buffChIdx) => line.Any(
        c => !char.IsWhiteSpace(c) && !char.IsLetter(c)),
    MaxLineLength = 100,
    MaxLinesCount = 100,
    RemoveControlChars = true,
    KeepNwLnChars = true,
    KeepTabs = true,
}, new RetrievedTextLines
{
    Lines = new List<string>
    {
        "\tasdf qwer \n",
        " zxcv tyui 1234 \n",
    },
    LastReadCharIdx = 41,
    LastNwLnIdx = 30,
    LastChunk = " bnm, ghjk ",
    ReachedEndOfStream = true,
    LastLineMatches = true
});
        }

        [Fact]
        public void MainTest()
        {
            PerformRetrieverTest(
"\t" + @"asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1235 
 bnm, ghjk ", new TextLinesRetrieverOpts
{
    StopPredicate = (retObj, prevBuffNwLnIdx, line, buffChIdx) => false,
    MaxLineLength = 100,
    MaxLinesCount = 100,
    RemoveControlChars = true,
    // KeepNwLnChars = true,
    KeepTabs = true,
}, new RetrievedTextLines
{
    Lines = new List<string>
    {
        "\tasdf qwer ",
        " zxcv tyui 1234 ",
        " bnm, ghjk ",
        " asdf qwer ",
        " zxcv tyui 1234 ",
        " bnm, ghjk ",
        " asdf qwer ",
        " zxcv tyui 1234 ",
        " bnm, ghjk ",
        " asdf qwer ",
        " zxcv tyui 1235 "
    },
    LastReadCharIdx = 173,
    LastNwLnIdx = 150,
    ReachedEndOfStream = true,
    LastChunk = " bnm, ghjk ",
    // LastLineMatches = true
});
        }

        [Fact]
        public void FirstFullTest()
        {
            PerformRetrieverTest(
"\t" + @"asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1235 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1235 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1235 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1235 
 bnm, ghjk ", new TextLinesRetrieverOpts
{
    StopPredicate = (retObj, prevBuffNwLnIdx, line, buffChIdx) => line.Contains('5'),
    MaxLineLength = 100,
    MaxLinesCount = 15,
    RemoveControlChars = true,
    // KeepNwLnChars = true,
    KeepTabs = true,
}, new RetrievedTextLines
{
    Lines = new List<string>
    {
        "\tasdf qwer ",
        " zxcv tyui 1234 ",
        " bnm, ghjk ",
        " asdf qwer ",
        " zxcv tyui 1234 ",
        " bnm, ghjk ",
        " asdf qwer ",
        " zxcv tyui 1235 ",
    },
    LastReadCharIdx = 199,
    LastNwLnIdx = 106,
    ReachedEndOfStream = false,
    LastChunk = " bnm, ghjk \n asdf qwer \n zxcv tyui 1234 \n bnm, ghjk \n asdf qwer \n zxcv tyui ",
    LastLineMatches = true
});
        }

        [Fact]
        public void SecondFullTest()
        {
            PerformRetrieverTest(
"\t" + @"asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1235 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1235 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1234 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1235 
 bnm, ghjk 
 asdf qwer 
 zxcv tyui 1235 
 bnm, ghjk ", new TextLinesRetrieverOpts
{
    StopPredicate = (retObj, prevBuffNwLnIdx, line, buffChIdx) => false,
    MaxLineLength = 100,
    MaxLinesCount = 10,
    RemoveControlChars = true,
    // KeepNwLnChars = true,
    KeepTabs = true,
}, new RetrievedTextLines
{
    Lines = new List<string>
    {
        "\tasdf qwer ",
        " zxcv tyui 1234 ",
        " bnm, ghjk ",
        " asdf qwer ",
        " zxcv tyui 1234 ",
        " bnm, ghjk ",
        " asdf qwer ",
        " zxcv tyui 1235 ",
        " bnm, ghjk ",
        " asdf qwer ",
        " zxcv tyui 1234 ",
        " bnm, ghjk ",
        " asdf qwer ",
    },
    LastReadCharIdx = 199,
    LastNwLnIdx = 176,
    ReachedEndOfStream = false,
    LastChunk = " zxcv tyui ",
    LastLineMatches = false
});
        }

        private void PerformRetrieverTest(
            string inputText,
            TextLinesRetrieverOpts opts,
            RetrievedTextLines expectedResult)
        {
            using var reader = new StringReader(inputText);
            var retriever = textLinesRetrieverFactory.CreateFromTextReader(reader);

            var actualResult = retriever.RetrieveLinesUntil(opts);
            this.AssertEqual(() => actualResult, expectedResult, retrievedTextLinesEqCompr);
        }

        private TextReader GetTextReader(
            string[] inputLines)
        {
            string inputText = string.Join("\n", inputLines);
            var reader = new StringReader(inputText);

            return reader;
        }
    }
}
