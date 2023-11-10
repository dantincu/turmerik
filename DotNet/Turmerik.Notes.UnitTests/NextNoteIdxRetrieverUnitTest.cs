using Microsoft.Extensions.DependencyInjection;

namespace Turmerik.Notes.UnitTests
{
    public class NextNoteIdxRetrieverUnitTest : UnitTestBase
    {
        private readonly INextNoteIdxRetriever nextNoteIdxRetriever;

        public NextNoteIdxRetrieverUnitTest()
        {
            nextNoteIdxRetriever = SvcProv.GetRequiredService<INextNoteIdxRetriever>();
        }

        [Fact]
        public void MainTest()
        {
            PerformTest(new int[] { 2, 3, 5, 6 }, 7);

            PerformTest(new int[] { 2, 3, 5, 6 }, 1, cfg =>
            {
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 1, 2, 5, 6 }, 3, cfg =>
            {
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 1, 2, 3, 4 }, 5, cfg =>
            {
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 998, 997, 995, 994 }, 999, cfg =>
            {
                cfg.IncIdx = false;
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 999, 998, 996, 995 }, 997, cfg =>
            {
                cfg.IncIdx = false;
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 999, 998, 997, 996 }, 995, cfg =>
            {
                cfg.IncIdx = false;
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 102, 103, 105, 106 }, 101, cfg =>
            {
                cfg.MinIdx = 101;
                cfg.MaxIdx = 199;
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 101, 102, 105, 106 }, 103, cfg =>
            {
                cfg.MinIdx = 101;
                cfg.MaxIdx = 199;
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 101, 102, 103, 104 }, 105, cfg =>
            {
                cfg.MinIdx = 101;
                cfg.MaxIdx = 199;
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 198, 197, 195, 194 }, 199, cfg =>
            {
                cfg.MinIdx = 101;
                cfg.MaxIdx = 199;
                cfg.IncIdx = false;
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 199, 198, 196, 195 }, 197, cfg =>
            {
                cfg.MinIdx = 101;
                cfg.MaxIdx = 199;
                cfg.IncIdx = false;
                cfg.FillGapsByDefault = true;
            });

            PerformTest(new int[] { 199, 198, 197, 196 }, 195, cfg =>
            {
                cfg.MinIdx = 101;
                cfg.MaxIdx = 199;
                cfg.IncIdx = false;
                cfg.FillGapsByDefault = true;
            });
        }

        private void PerformTest(
            int[] sortedIdxesArr,
            int expectedValue,
            Action<NoteDirsPairConfigMtbl.DirNameIdxesT> cfgBuilder = null)
        {
            var cfg = new NoteDirsPairConfigMtbl.DirNameIdxesT();
            cfgBuilder?.Invoke(cfg);

            int actualValue = nextNoteIdxRetriever.GetNextIdx(
                cfg, sortedIdxesArr);

            Assert.Equal(expectedValue, actualValue);
        }
    }
}