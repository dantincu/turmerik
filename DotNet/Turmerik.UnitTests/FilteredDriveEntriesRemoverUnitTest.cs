using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.UnitTests
{
    public class FilteredDriveEntriesRemoverUnitTest : FilteredDriveEntriesRetrieverUnitTestBase
    {
        private readonly IFilteredDriveEntriesRemover remover;

        public FilteredDriveEntriesRemoverUnitTest()
        {
            remover = SvcProv.GetRequiredService<IFilteredDriveEntriesRemover>();
        }

        [Fact]
        public async Task MainTest()
        {
            var filters = CreateDefaultFilters();
            var expectedResults = CreateDefaultExpectedFilteredResults();

            var filtersArr = filters.Item1.Arr(
                filters.Item1,
                filters.Item1,
                filters.Item2);

            var expectedResultsArr = expectedResults.Item1.Arr(
                expectedResults.Item1,
                expectedResults.Item1,
                expectedResults.Item2);

            for (int i = 0; i < filtersArr.Length; i++)
            {
                await PerformTestAsync(
                    CreateDefaultRootInputFolder(),
                    filtersArr[i],
                    expectedResultsArr[i]);
            }
        }

        private Task PerformTestAsync(
            DriveItem inputRootFolder,
            DriveEntriesSerializableFilter driveEntriesFilter,
            DriveItem expectedRootFolder) => PerformTestAsyncCore(
                inputRootFolder, driveEntriesFilter, expectedRootFolder,
                (tempDir, filteredResult) =>
                {
                    var expectedRootFolderClone = new DriveItem(
                        inputRootFolder,
                        int.MaxValue);

                    RemoveFromTempFolder(
                        expectedRootFolderClone,
                        filteredResult);

                    return expectedRootFolderClone;
                });
    }
}
