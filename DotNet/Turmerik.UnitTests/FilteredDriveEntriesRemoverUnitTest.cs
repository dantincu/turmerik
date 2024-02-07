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

        private async Task PerformTestAsync(
            DriveItem inputRootFolder,
            DriveEntriesSerializableFilter driveEntriesFilter,
            DriveItem expectedRootFolder)
        {
            await TempDirConsoleApp.RunAsync(new TempDirAsyncConsoleAppOpts
            {
                Action = async (tempDir) =>
                {
                    string prFolderPath = Path.Combine(
                        tempDir.DirPath, inputRootFolder.Name);

                    FillTempFolder(
                        inputRootFolder,
                        prFolderPath);

                    var clonedInputFolder = new DriveItem(inputRootFolder, int.MaxValue);

                    var filter = await FilteredRetriever.FindMatchingAsync(
                        new FilteredDriveRetrieverMatcherOpts
                        {
                            FsEntriesSerializableFilter = driveEntriesFilter,
                            PrFolderIdnf = prFolderPath,
                            CheckRetNodeValidityDepth = int.MaxValue
                        });

                    await FilteredRemover.RemoveEntriesAsync(filter, true);
                    RemoveFromTempFolder(clonedInputFolder, expectedRootFolder);

                    FilteredDriveEntriesH.AssertTreeNodeIsValid(filter, int.MaxValue);

                    var actualRootFolder = await LoadTempFolderAsync(
                        prFolderPath);

                    AssertFoldersAreEqual(
                        clonedInputFolder,
                        actualRootFolder);
                },
                RemoveExistingTempDirsBeforeAction = true,
                RemoveTempDirAfterAction = true,
                TempDirOpts = new TrmrkUniqueDirOpts
                {
                    DirNameType = GetType()
                }
            });
        }
    }
}
