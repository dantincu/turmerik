using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FileSystem;
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
            var rootInputFolder = CreateDefaultRootInputFolder();
            var filters = CreateDefaultFilters();
            var expectedResults = CreateDefaultExpectedFilteredResults();


            await PerformTestAsync();
        }

        private Task PerformTestAsync(
            DriveItem inputRootFolder,
            DriveEntriesSerializableFilter driveEntriesFilter,
            DriveItem expectedRootFolder) => PerformTestAsyncCore(
                inputRootFolder, driveEntriesFilter, expectedRootFolder,
                (tempDir, filteredResult) =>
                {
                    var expectedRootFolderClone = new DriveItem(
                        expectedRootFolder,
                        int.MaxValue);

                    RemoveFromTempFolder(
                        expectedRootFolderClone,
                        filteredResult);

                    return expectedRootFolderClone;
                });
    }
}
