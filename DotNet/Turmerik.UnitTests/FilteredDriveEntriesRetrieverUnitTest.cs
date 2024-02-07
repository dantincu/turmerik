using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.UnitTests
{
    public class FilteredDriveEntriesRetrieverUnitTest : FilteredDriveEntriesRetrieverUnitTestBase
    {
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
                (tempDir, filteredResult) => ToTempFolder(new DriveItem
                {
                    Name = inputRootFolder.Name,
                }, filteredResult));
    }
}
