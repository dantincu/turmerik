using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.Utility;
using Turmerik.NetCore.ConsoleApps.SyncLocalFiles;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Helpers;
using System.Reflection.Emit;
using System.Collections.Immutable;

namespace Turmerik.UnitTests
{
    public partial class FilteredDriveEntriesSynchronizerUnitTest : FilteredDriveEntriesRetrieverUnitTestBase
    {
        public delegate TObj TestObjFactory<TObj>(
            ProgramArgs args,
            ProgramConfig.SrcFolder srcFolder,
            ProgramConfig.DestnLocation destnLocation,
            ProgramConfig.DestnFolder destnFolder,
            string destnDirPath,
            DataTreeNodeMtbl<FilteredDriveEntries> srcEntriesObj,
            DataTreeNodeMtbl<FilteredDriveEntries> destnEntriesObj);

        private const string LIB_NAME_TEMPLATE = "lib{0}-lvl{1}-file{2}";
        private const string APP_NAME_TEMPLATE = "lib{0}-lvl{1}-file{2}";

        private readonly IProgramComponent programComponent;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly IFilteredDriveEntriesSynchronizer synchronizer;
        private readonly IFilteredDriveEntriesRetriever filteredFsEntriesRetriever;
        private readonly IProgramConfigRetriever programConfigRetriever;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;

        public FilteredDriveEntriesSynchronizerUnitTest()
        {
            programComponent = SvcProv.GetRequiredService<IProgramComponent>();
            programArgsNormalizer = SvcProv.GetRequiredService<IProgramArgsNormalizer>();
            textMacrosReplacer = SvcProv.GetRequiredService<ITextMacrosReplacer>();
            synchronizer = SvcProv.GetRequiredService<IFilteredDriveEntriesSynchronizer>();
            filteredFsEntriesRetriever = SvcProv.GetRequiredService<IFilteredDriveEntriesRetriever>();
            programConfigRetriever = SvcProv.GetRequiredService<IProgramConfigRetriever>();
            localDevicePathMacrosRetriever = SvcProv.GetRequiredService<ILocalDevicePathMacrosRetriever>();
        }

        #region Test Methods

        #endregion Test Methods

        #region Private Methods

        private async Task PerformTestAsync(
            FileSyncType fileSyncType,
            bool? propagatePush,
            Dictionary<string, List<string>> locationNamesMap,
            Dictionary<string, List<string>> createLocationNamesMap,
            string rootDirRelPath,
            TestObjFactory<DataTreeNodeMtbl<RefTrgDriveFolderTuple>>? expectedDiffResultFactory = null,
            TestObjFactory<DriveItem>? expectedSrcFolderContentFactory = null,
            TestObjFactory<DriveItem>? expectedDestnFolderContentFactory = null) => await PerformTestAsync(
                fileSyncType, propagatePush, locationNamesMap, rootDirRelPath,
                CreateDefaultRootFolderContents(rootDirRelPath, createLocationNamesMap),
                expectedDiffResultFactory,
                expectedSrcFolderContentFactory,
                expectedDestnFolderContentFactory);

        private async Task PerformTestAsync(
            FileSyncType fileSyncType,
            bool? propagatePush,
            Dictionary<string, List<string>> locationNamesMap,
            string rootDirRelPath,
            DriveItem rootFolderContents,
            TestObjFactory<DataTreeNodeMtbl<RefTrgDriveFolderTuple>>? expectedDiffResultFactory = null,
            TestObjFactory<DriveItem>? expectedSrcFolderContentFactory = null,
            TestObjFactory<DriveItem>? expectedDestnFolderContentFactory = null)
        {
            var args = GetProgramArgs(
                fileSyncType,
                propagatePush,
                locationNamesMap,
                rootDirRelPath,
                out var rootFolderPath);

            rootFolderContents.Idnf = rootFolderPath;

            await PerformTestAsync(args, rootFolderContents,
                expectedDiffResultFactory,
                expectedSrcFolderContentFactory,
                expectedDestnFolderContentFactory);
        }

        private async Task PerformTestAsync(
            ProgramArgs args,
            DriveItem rootFolderContents,
            TestObjFactory<DataTreeNodeMtbl<RefTrgDriveFolderTuple>>? expectedDiffResultFactory = null,
            TestObjFactory<DriveItem>? expectedSrcFolderContentFactory = null,
            TestObjFactory<DriveItem>? expectedDestnFolderContentFactory = null)
        {
            PrepareFolder(rootFolderContents);

            args.DiffResultFactory = (
                ProgramArgs args,
                ProgramConfig.SrcFolder srcFolder,
                ProgramConfig.DestnLocation destnLocation,
                ProgramConfig.DestnFolder destnFolder,
                string destnDirPath,
                DataTreeNodeMtbl<FilteredDriveEntries> srcEntriesObj,
                DataTreeNodeMtbl<FilteredDriveEntries> destnEntriesObj) =>
            {
                var actualDiffResult = synchronizer.DiffFilteredItems(new FilteredDriveEntriesSynchronizerOpts
                {
                    FileSyncType = args.FileSyncType,
                    TreatAllAsDiff = args.TreatAllAsDiff,
                    Interactive = args.Interactive,
                    RowsToPrint = args.RowsToPrint,
                    SkipDiffPrinting = args.SkipDiffPrinting,
                    SrcFilteredEntries = srcEntriesObj,
                    DestnFilteredEntries = destnEntriesObj,
                    SrcName = srcFolder.Name,
                    DestnName = destnLocation.Name,
                    SrcDirPath = srcFolder.DirPath,
                    DestnDirPath = destnDirPath,
                });

                if (expectedDiffResultFactory != null)
                {
                    AssertDiffResult(
                        expectedDiffResultFactory(
                            args,
                            srcFolder,
                            destnLocation,
                            destnFolder,
                            destnDirPath,
                            srcEntriesObj,
                            destnEntriesObj),
                        actualDiffResult);
                }

                return actualDiffResult;
            };

            args.OnAfterSync = async (
                ProgramArgs args,
                ProgramConfig.SrcFolder srcFolder,
                ProgramConfig.DestnLocation destnLocation,
                ProgramConfig.DestnFolder destnFolder,
                string destnDirPath,
                DataTreeNodeMtbl<FilteredDriveEntries> srcEntriesObj,
                DataTreeNodeMtbl<FilteredDriveEntries> destnEntriesObj,
                DataTreeNodeMtbl<RefTrgDriveFolderTuple> diffResult) =>
            {
                var expectedSrcFolderContents = expectedSrcFolderContentFactory?.Invoke(
                    args,
                    srcFolder,
                    destnLocation,
                    destnFolder,
                    destnDirPath,
                    srcEntriesObj,
                    destnEntriesObj);

                var expectedDestnFolderContents = expectedDestnFolderContentFactory?.Invoke(
                    args,
                    srcFolder,
                    destnLocation,
                    destnFolder,
                    destnDirPath,
                    srcEntriesObj,
                    destnEntriesObj);

                var actualSrcFolderContents = (await filteredFsEntriesRetriever.FindMatchingAsync(
                    new FilteredDriveRetrieverMatcherOpts
                    {
                        PrFolderIdnf = srcFolder.DirPath,
                        FsEntriesSerializableFilter = destnFolder.SrcFilesFilter
                    }));

                var actualDestnFolderContents = (await filteredFsEntriesRetriever.FindMatchingAsync(
                    new FilteredDriveRetrieverMatcherOpts
                    {
                        PrFolderIdnf = destnDirPath,
                        FsEntriesSerializableFilter = destnFolder.DestnFilesFilter
                    }));

                if (expectedSrcFolderContents != null)
                {
                    AssertFolderContents(
                        expectedSrcFolderContents,
                        actualSrcFolderContents);
                }

                if (expectedDestnFolderContents != null)
                {
                    AssertFolderContents(
                        expectedDestnFolderContents,
                        actualDestnFolderContents);
                }
            };

            await programComponent.RunAsync(args);
        }

        private void PrepareFolder(
            DriveItem folder,
            string prIdnf = null)
        {
            if (prIdnf == null)
            {
                if (Directory.Exists(folder.Idnf))
                {
                    Directory.Delete(folder.Idnf, true);
                }
            }
            else
            {
                folder.Idnf ??= Path.Combine(
                    prIdnf, folder.Name);
            }

            Directory.CreateDirectory(folder.Idnf);

            if (folder.FolderFiles != null)
            {
                foreach (var file in folder.FolderFiles)
                {
                    file.Idnf ??= Path.Combine(
                        folder.Idnf, file.Name);

                    File.WriteAllText(file.Idnf, file.TextFileContents);
                }
            }

            if (folder.SubFolders != null)
            {
                foreach (var subFolder in folder.SubFolders)
                {
                    PrepareFolder(subFolder, folder.Idnf);
                }
            }
        }

        private void AssertDiffResult(
            DataTreeNodeMtbl<RefTrgDriveFolderTuple> expectedDiffResult,
            DataTreeNodeMtbl<RefTrgDriveFolderTuple> actualDiffResult)
        {
            throw new NotImplementedException();
        }

        private void AssertFolderContents(
            DriveItem expectedContents,
            DataTreeNodeMtbl<FilteredDriveEntries> actualContents)
        {
            Assert.Equal(expectedContents.Name, actualContents.Data.PrFolderName);

            if (expectedContents.FolderFiles != null)
            {
                Assert.Equal(expectedContents.FolderFiles.Count, actualContents.Data.FilteredFolderFiles.Count);

                foreach (var expectedFile in expectedContents.FolderFiles)
                {
                    var actualFile = actualContents.Data.FilteredFolderFiles.FindByName(
                        expectedFile.Name);

                    AssertFileContents(expectedFile, actualFile);
                }
            }
            else
            {
                Assert.False(actualContents.Data.FilteredFolderFiles.Any());
            }
        }

        private void AssertFileContents(
            DriveItem expectedContents,
            DriveItem actualContents)
        {
            Assert.NotNull(actualContents);
            Assert.Equal(expectedContents.Name, actualContents.Name);
            Assert.Equal(expectedContents.TextFileContents, actualContents.TextFileContents);
        }

        private ProgramArgs GetProgramArgs(
            FileSyncType fileSyncType,
            bool? propagatePush,
            Dictionary<string, List<string>> locationNamesMap,
            string rootDirRelPath,
            out string rootFolderPath)
        {
            var args = new ProgramArgs
            {
                Config = programConfigRetriever.LoadProgramConfig("test-config.json"),
                LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile(),
                SrcFolderNamesMap = locationNamesMap,
                DestnLocationNamesList = new List<string>(),
                ProfileName = "unit-test",
                ConfigFilePath = "test-config",
                FileSyncType = fileSyncType,
                TreatAllAsDiff = true,
                PropagatePush = propagatePush
            };

            args.Profile = args.Config.Profiles.Single(
                profile => profile.ProfileName == "unit-test");

            args.Profile.DirPath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                args.Profile.DirPath,
                args.WorkDir);

            rootFolderPath = Path.Combine(
                args.Profile.DirPath,
                rootDirRelPath);

            args.Profile.DirPath = rootFolderPath;
            programArgsNormalizer.NormalizeArgs(args);

            return args;
        }

        private DriveItem CreateFolder(
            string name,
            DriveItem src) => CreateFolder(
                name,
                src.FolderFiles,
                src.SubFolders);

        private DriveItem CreateFolder(
            string name,
            DriveItem src,
            string fileContentsPrefix) => CreateFolder(
                name,
                src.FolderFiles,
                src.SubFolders,
                fileContentsPrefix);

        private DriveItem CreateFolder(
            string name,
            List<DriveItem>? files,
            List<DriveItem>? folders) => new DriveItem
            {
                Name = name,
                IsFolder = true,
                FolderFiles = files,
                SubFolders = folders
            };

        private DriveItem CreateFolder(
            string name,
            List<DriveItem>? files,
            List<DriveItem>? folders,
            string fileContentsPrefix) => CreateFolder(
                name, files?.Select(
                    item => new DriveItem
                    {
                        Name = item.Name,
                        TextFileContents = string.Concat(fileContentsPrefix, item.TextFileContents)
                    }).ToList(),
                folders?.Select(item => CreateFolder(
                    item.Name,
                    files,
                    item.SubFolders,
                    fileContentsPrefix)).ToList());

        private DriveItem CreateFile(
            string name,
            string text) => new DriveItem
            {
                Name = name,
                TextFileContents = text
            };

        private string GetItemName(
            int libIdx,
            int level,
            int idx) => GetItemName(
                GetItemNameTemplate(),
                libIdx,
                level,
                idx);

        private string GetItemName(
            string template,
            int libIdx,
            int level,
            int idx) => string.Format(
            template, libIdx, level, idx);

        private string GetItemNameTemplate(
            bool isLib) => isLib ? LIB_NAME_TEMPLATE : APP_NAME_TEMPLATE;

        private string GetItemNameTemplate() => LIB_NAME_TEMPLATE;

        private DriveItem CreateDefaultRootFolderContents(
            string rootDirRelPath,
            Dictionary<string, List<string>> createLocationNamesMap)
        {
            var rootFolder = CreateFolder(rootDirRelPath, new List<DriveItem>(), new List<DriveItem>());

            foreach (var kvp in createLocationNamesMap)
            {
                var libDirName = GetLibDirName(kvp.Key, out int libIdx);

                var libFolder = CreateFolder(kvp.Key, null, new List<DriveItem>
                {
                    CreateFolder("src", null, new List<DriveItem>
                    {
                        CreateFolder(libDirName, CreateLibContents(libIdx, 0, "")),
                        CreateFolder("synced-libs", null, kvp.Value.Select(
                            syncedLibName =>
                            {
                                GetLibDirName(syncedLibName, out int syncedLibIdx);

                                var libFolder = CreateFolder(
                                    syncedLibName,
                                    CreateLibContents(syncedLibIdx, syncedLibIdx * 3 + libIdx * 7, "synced_in_" + kvp.Key));

                                return libFolder;
                            }).ToList())
                    })
                });

                rootFolder.SubFolders.Add(libFolder);
            }

            return rootFolder;
        }

        private string GetLibDirName(
            string libName,
            out int idx)
        {
            string idxStr = new string(
                libName.Where(char.IsDigit).ToArray());

            idx = int.Parse(idxStr);

            string retStr = new string(
                libName.Where(char.IsLetter).ToArray());

            return retStr;
        }

        #endregion Private Methods
    }
}
