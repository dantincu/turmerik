using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps.TempDir;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.EqualityComparer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.UnitTests
{
    public abstract class FilteredDriveEntriesRetrieverUnitTestBase : UnitTestBase
    {
        protected readonly ITempDirConsoleApp TempDirConsoleApp;
        protected readonly IDriveItemsRetriever DriveItemsRetriever;
        protected readonly IFilteredDriveEntriesRetriever FilteredRetriever;

        protected FilteredDriveEntriesRetrieverUnitTestBase()
        {
            TempDirConsoleApp = SvcProv.GetRequiredService<ITempDirConsoleApp>();
            DriveItemsRetriever = SvcProv.GetRequiredService<IDriveItemsRetriever>();
            FilteredRetriever = SvcProv.GetRequiredService<IFilteredDriveEntriesRetriever>();
        }

        protected async Task PerformTestAsyncCore(
            DriveItem inputRootFolder,
            DriveEntriesSerializableFilter driveEntriesFilter,
            DriveItem expectedRootFolder,
            Func<TrmrkUniqueDir, DataTreeNodeMtbl<FilteredDriveEntries>, DriveItem> actualRootFolderRetriever)
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

                    var result = await FilteredRetriever.FindMatchingAsync(
                        new FilteredDriveRetrieverMatcherOpts
                        {
                            FsEntriesSerializableFilter = driveEntriesFilter,
                            PrFolderIdnf = prFolderPath
                        });

                    var actualRootFolder = actualRootFolderRetriever(tempDir, result);

                    AssertFoldersAreEqual(
                        expectedRootFolder,
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

        protected void FillTempFolder(
            DriveItem inputFolder,
            string prFolderPath)
        {
            Directory.CreateDirectory(prFolderPath);

            if (inputFolder.FolderFiles != null)
            {
                foreach (var file in inputFolder.FolderFiles)
                {
                    File.WriteAllText(Path.Combine(
                        prFolderPath, file.Name), string.Empty);
                }
            }

            if (inputFolder.SubFolders  != null)
            {
                foreach (var folder in inputFolder.SubFolders)
                {
                    FillTempFolder(folder, Path.Combine(
                        prFolderPath, folder.Name));
                }
            }
        }

        protected void RemoveFromTempFolder(
            DriveItem inputFolder,
            DataTreeNodeMtbl<FilteredDriveEntries> filterResult)
        {
            var filter = filterResult.Data;

            int removedCount = inputFolder.FolderFiles.RemoveWhere(
                inputFile => filter.FilteredFolderFiles.Any(
                    file => file.Name == inputFile.Name));

            Assert.Equal(removedCount, filter.FilteredFolderFiles.Count);

            removedCount = inputFolder.SubFolders.RemoveWhere(
                inputFile => filter.FilteredSubFolders.Any(
                    file => file.Name == inputFile.Name));

            Assert.Equal(removedCount, filter.FilteredSubFolders.Count);

            foreach (var childNode in filterResult.ChildNodes)
            {
                var subFolder = inputFolder.SubFolders.Single(
                    folder => folder.Name == childNode.Data.PrFolderName);

                RemoveFromTempFolder(
                    subFolder, childNode);
            }
        }

        protected bool AssertFoldersAreEqual(
            DriveItem expectedFolder,
            DriveItem actualFolder)
        {
            Assert.Equal(
                expectedFolder.Name,
                actualFolder.Name);

            var eqComprFactory = SvcProv.GetRequiredService<IBasicEqualityComparerFactory>();

            AssertObjectSequenceEqual(
                expectedFolder.FolderFiles,
                actualFolder.FolderFiles,
                eqComprFactory,
                (expected, actual) => expected.Name == actual.Name);

            AssertObjectSequenceEqual(
                expectedFolder.SubFolders,
                actualFolder.SubFolders,
                eqComprFactory,
                (expected, actual) => AssertFoldersAreEqual(expected, actualFolder));

            return true;
        }

        protected async Task<DriveItem> GetDriveFolderAsync(string folderPath)
        {
            var folder = await DriveItemsRetriever.GetFolderAsync(
                folderPath, false);

            for (int i = 0; i < folder.SubFolders.Count; i++)
            {
                folder.SubFolders[i] = await GetDriveFolderAsync(
                    folder.SubFolders[i].Idnf);
            }

            return folder;
        }

        protected DriveItem CreateDefaultRootInputFolder()
        {
            var rootInputFolder = CrDvItm("D0",
                CrDvItm("F1_1").Lst(
                CrDvItm("F1_2")),
                CrDvItm("D1_1",
                    CrDvItm("F2_1").Lst(
                    CrDvItm("F2_2")),
                    CrDvItm("D2_1",
                        CrDvItm("F3_1").Lst(
                        CrDvItm("F3_2")),
                        CrDvItm("D3_1",
                            CrDvItm("F4_1").Lst(
                            CrDvItm("F4_2")),
                            CrDvItm("D4_1",
                                CrDvItm("F5_1").Lst(
                                CrDvItm("F5_2"))).Lst(
                            CrDvItm("D4_2",
                                CrDvItm("F5_1").Lst(
                                CrDvItm("F5_2"))))).Lst(
                        CrDvItm("D3_2",
                            CrDvItm("F4_1").Lst(
                            CrDvItm("F4_2"))))).Lst(
                    CrDvItm("D2_2",
                        CrDvItm("F3_1").Lst(
                        CrDvItm("F3_2"))))).Lst(
                CrDvItm("D1_2",
                    CrDvItm("F2_1").Lst(
                    CrDvItm("F2_2")),
                    CrDvItm("D2_1", null, null, true).Lst(
                    CrDvItm("D2_2", null, null, true)))));

            return rootInputFolder;
        }

        protected Tuple<DriveEntriesSerializableFilter, DriveEntriesSerializableFilter, DriveEntriesSerializableFilter, DriveEntriesSerializableFilter> CreateDefaultFilters(
            ) => Tuple.Create(
                CrFvFltr(
                    ["^\\/D0\\/.*\\/F[1-5]_[1-2]", "^\\/D0\\/.*\\/D[1-5]_[1-2]\\/"],
                    ["^\\/D0\\/.*\\/F[4-5]_1", "^\\/D0\\/.*\\/D[4-5]_2\\/"]),
                CrFvFltr(
                    ["^\\/D0\\/.*F[1-5]_[1-2]", "D_[1-5]_[1-2]"],
                    ["^\\/D0\\/.*F[4-5]_1", "D[4-5]_2"]),
                CrFvFltr(
                    ["[1-5]_[1-2]"],
                    ["F[4-5]_1", "D[4-5]_2"]),
                CrFvFltr(
                    ["\\/[1-5]_[1-2]", "[1-2]_[1-2]\\/"],
                    ["F1_2"]));

        protected Tuple<DriveItem, DriveItem, DriveItem, DriveItem> CreateDefaultExpectedFilteredResults()
        {
            var item1 = CrDvItm("D0",
                CrDvItm("F1_2").Lst(),
                CrDvItm("D1_1",
                    CrDvItm("F2_2").Lst(),
                    CrDvItm("D2_1",
                        CrDvItm("F3_2").Lst(),
                        CrDvItm("D3_1",
                            CrDvItm("F4_2").Lst(),
                            CrDvItm("D4_1",
                                CrDvItm("F5_2").Lst()).Lst(
                            CrDvItm("D4_2",
                                CrDvItm("F5_2").Lst()))).Lst(
                        CrDvItm("D3_2",
                            CrDvItm("F4_2").Lst()))).Lst(
                    CrDvItm("D2_2",
                        CrDvItm("F3_2").Lst()))).Lst());

            var item4 = CrDvItm("D0",
                CrDvItm("F1_1").Lst(),
                CrDvItm("D1_1",
                    CrDvItm("F2_1").Lst(
                    CrDvItm("F2_2")),
                    CrDvItm("D2_1", null, null, true).Lst(
                    CrDvItm("D2_2", null, null, true))).Lst(
                CrDvItm("D1_2",
                    CrDvItm("F2_1").Lst(
                    CrDvItm("F2_2")),
                    CrDvItm("D2_1", null, null, true).Lst(
                    CrDvItm("D2_2", null, null, true)))));

            return Tuple.Create(item1, item1, item1, item4);
        }

        protected DriveEntriesSerializableFilter CrFvFltr(
            string[] includedRelPathRegexes,
            string[] excludedRelPathRegexes) => new DriveEntriesSerializableFilter
            {
                IncludedRelPathRegexes = includedRelPathRegexes?.ToList(),
                ExcludedRelPathRegexes = excludedRelPathRegexes?.ToList()
            };

        protected DriveItem CrDvItm(
            string name,
            List<DriveItem> folderFiles = null,
            List<DriveItem> subFolders = null,
            bool? isFolder = null)
        {
            isFolder ??= folderFiles != null || subFolders != null;

            if (isFolder == true)
            {
                folderFiles ??= new List<DriveItem>();
                subFolders ??= new List<DriveItem>();
            }

            var driveItem = new DriveItem
            {
                Name = name,
                IsFolder = isFolder,
                FolderFiles = folderFiles,
                SubFolders = subFolders,
            };

            return driveItem;
        }
    }
}
