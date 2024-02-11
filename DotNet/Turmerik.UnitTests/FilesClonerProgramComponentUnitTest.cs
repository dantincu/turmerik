using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.EqualityComparer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;
using Turmerik.NetCore.ConsoleApps.FilesCloner;
using static Turmerik.Core.LocalDeviceEnv.LocalDevicePathsMap;

namespace Turmerik.UnitTests
{
    public class FilesClonerProgramComponentUnitTest : UnitTestBase
    {
        private readonly IProgramComponent programComponent;
        private readonly IAppEnv appEnv;
        private readonly IJsonConversion jsonConversion;
        private readonly IBasicEqualityComparerFactory basicEqualityComparerFactory;

        public FilesClonerProgramComponentUnitTest()
        {
            programComponent = SvcProv.GetRequiredService<IProgramComponent>();
            appEnv = SvcProv.GetRequiredService<IAppEnv>();
            jsonConversion = SvcProv.GetRequiredService<IJsonConversion>();
            basicEqualityComparerFactory = SvcProv.GetRequiredService<IBasicEqualityComparerFactory>();
        }

        private void AssertConfigObj(
            ProgramConfig inputConfig,
            bool dumpToFile = false)
        {
            string json = jsonConversion.Adapter.Serialize(inputConfig);
            var outputConfig = jsonConversion.Adapter.Deserialize<ProgramConfig>(json);

            if (dumpToFile)
            {
                DumpConfigToFile(json);
            }

            AssertConfigObj(
                inputConfig,
                outputConfig,
                false);
        }

        #region AssertConfigObj

        private void AssertConfigObj(
            ProgramConfig inputConfigObj,
            ProgramConfig outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    this.AssertSequenceEqual(
                        inputConfig.Profiles,
                        outputConfig.Profiles,
                        basicEqualityComparerFactory,
                        (inCfg, outCfg) =>
                        {
                            AssertConfigObj(inCfg, outCfg);
                            return true;
                        }, false);
                }, allowNull);

        private void AssertConfigObj(
            ProgramConfig.Profile inputConfigObj,
            ProgramConfig.Profile outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    Assert.Equal(
                        inputConfig.ProfileName,
                        outputConfig.ProfileName);

                    this.AssertSequenceEqual(
                        inputConfig.ScriptGroups,
                        outputConfig.ScriptGroups,
                        basicEqualityComparerFactory,
                        (inCfg, outCfg) =>
                        {
                            AssertConfigObj(inCfg, outCfg);
                            return true;
                        }, false);

                    this.AssertSequenceEqual(
                        inputConfig.FileGroups,
                        outputConfig.FileGroups,
                        basicEqualityComparerFactory,
                        (inCfg, outCfg) =>
                        {
                            AssertConfigObj(inCfg, outCfg);
                            return true;
                        }, false);
                }, allowNull);

        private void AssertConfigObj(
            ProgramConfig.ScriptsGroup inputConfigObj,
            ProgramConfig.ScriptsGroup outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    Assert.Equal(
                        inputConfig.WorkDir,
                        outputConfig.WorkDir);

                    this.AssertSequenceEqual(
                        inputConfig.OnBeforeScripts,
                        outputConfig.OnBeforeScripts,
                        basicEqualityComparerFactory,
                        (inCfg, outCfg) =>
                        {
                            AssertConfigObj(inCfg, outCfg);
                            return true;
                        }, false);

                    this.AssertSequenceEqual(
                        inputConfig.OnAfterScripts,
                        outputConfig.OnAfterScripts,
                        basicEqualityComparerFactory,
                        (inCfg, outCfg) =>
                        {
                            AssertConfigObj(inCfg, outCfg);
                            return true;
                        }, false);
                }, allowNull);

        private void AssertConfigObj(
            ProgramConfig.Script inputConfigObj,
            ProgramConfig.Script outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    Assert.Equal(
                        inputConfig.WorkDir,
                        outputConfig.WorkDir);

                    Assert.Equal(
                        inputConfig.Command,
                        outputConfig.Command);

                    AssertSequenceEqual(
                        inputConfig.Arguments,
                        outputConfig.Arguments);
                }, allowNull);

        private void AssertConfigObj(
            ProgramConfig.FilesGroup inputConfigObj,
            ProgramConfig.FilesGroup outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    Assert.Equal(
                        inputConfig.WorkDir,
                        outputConfig.WorkDir);

                    Assert.Equal(
                        inputConfig.CloneArchiveFileNameTpl,
                        outputConfig.CloneArchiveFileNameTpl);

                    AssertConfigObj(
                        inputConfig.InputBaseDirLocator,
                        outputConfig.InputBaseDirLocator);

                    AssertConfigObj(
                        inputConfig.CloneBaseDirLocator,
                        outputConfig.CloneBaseDirLocator);

                    AssertConfigObj(
                        inputConfig.CloneArchiveDirLocator,
                        outputConfig.CloneArchiveDirLocator);

                    AssertConfigObj(
                        inputConfig.DfBeforeCloneArchiveDirCleanupFilter,
                        outputConfig.DfBeforeCloneArchiveDirCleanupFilter);

                    AssertConfigObj(
                        inputConfig.DfInputDirFilter,
                        outputConfig.DfInputDirFilter);

                    AssertConfigObj(
                        inputConfig.DfBeforeCloneDestnCleanupFilter,
                        outputConfig.DfBeforeCloneDestnCleanupFilter);

                    AssertSequenceEqual(
                        inputConfig.Files,
                        outputConfig.Files,
                        basicEqualityComparerFactory,
                        (inCfg, outCfg) =>
                        {
                            AssertConfigObj(inCfg, outCfg);
                            return true;
                        }, false);

                    AssertSequenceEqual(
                        inputConfig.Dirs,
                        outputConfig.Dirs,
                        basicEqualityComparerFactory,
                        (inCfg, outCfg) =>
                        {
                            AssertConfigObj(inCfg, outCfg);
                            return true;
                        }, false);
                }, allowNull);

        private void AssertConfigObj(
            FsEntryLocator inputConfigObj,
            FsEntryLocator outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    Assert.Equal(
                        inputConfig.EntryBasePath,
                        outputConfig.EntryBasePath);

                    Assert.Equal(
                        inputConfig.EntryPath,
                        outputConfig.EntryPath);

                    Assert.Equal(
                        inputConfig.EntryRelPath,
                        outputConfig.EntryRelPath);
                }, allowNull);

        private void AssertConfigObj(
            DriveEntriesSerializableFilter inputConfigObj,
            DriveEntriesSerializableFilter outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    AssertSequenceEqual(
                        inputConfig.IncludedRelPathRegexes,
                        outputConfig.IncludedRelPathRegexes);

                    AssertSequenceEqual(
                        inputConfig.ExcludedRelPathRegexes,
                        outputConfig.ExcludedRelPathRegexes);
                }, allowNull);

        private void AssertConfigObj(
            FileArgs inputConfigObj,
            FileArgs outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    AssertConfigObj(
                        inputConfig.InputFileLocator,
                        outputConfig.InputFileLocator);

                    AssertConfigObj(
                        inputConfig.CloneDirLocator,
                        outputConfig.CloneDirLocator);

                    Assert.Equal(
                        inputConfig.CloneFileNameTpl,
                        outputConfig.CloneFileNameTpl);

                    Assert.Equal(
                        inputConfig.UseChecksum,
                        outputConfig.UseChecksum);

                    AssertSequenceEqual(
                        inputConfig.CloneTplLines,
                        outputConfig.CloneTplLines);
                }, allowNull);

        private void AssertConfigObj(
            DirArgs inputConfigObj,
            DirArgs outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    AssertConfigObj(
                        inputConfig.InputDirLocator,
                        outputConfig.InputDirLocator);

                    AssertConfigObj(
                        inputConfig.CloneDirLocator,
                        outputConfig.CloneDirLocator);

                    AssertConfigObj(
                        inputConfig.InputDirFilter,
                        outputConfig.InputDirFilter);

                    AssertConfigObj(
                        inputConfig.BeforeCloneDestnCleanupFilter,
                        outputConfig.BeforeCloneDestnCleanupFilter);
                }, allowNull);

        private void AssertConfigObj(
            FileCloneArgs inputConfigObj,
            FileCloneArgs outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    Assert.Equal(
                        inputConfig.WorkDir,
                        outputConfig.WorkDir);

                    Assert.Equal(
                        inputConfig.InputText,
                        outputConfig.InputText);

                    Assert.Equal(
                        inputConfig.CloneInputFile,
                        outputConfig.CloneInputFile);

                    AssertConfigObj(
                        inputConfig.File,
                        outputConfig.File);
                }, allowNull);

        private void AssertConfigObj(
            LocalDevicePathMacrosMapMtbl inputConfigObj,
            LocalDevicePathMacrosMapMtbl outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    AssertConfigObj(
                        inputConfig.UserProfileDir,
                        outputConfig.UserProfileDir);

                    AssertConfigObj(
                        inputConfig.TurmerikRepoDir,
                        outputConfig.TurmerikRepoDir);

                    AssertConfigObj(
                        inputConfig.TurmerikDotnetUtilityAppsEnvDir,
                        outputConfig.TurmerikDotnetUtilityAppsEnvDir);

                    AssertConfigObj(
                        inputConfig.OnedriveDir,
                        outputConfig.OnedriveDir);

                    AssertConfigObj(
                        inputConfig.OnedriveTurmerikDotNetUtilityAppsArchiveReldir,
                        outputConfig.OnedriveTurmerikDotNetUtilityAppsArchiveReldir);

                    AssertSequenceEqual(
                        inputConfig.PathsMap,
                        outputConfig.PathsMap);
                }, allowNull);

        private void AssertConfigObj(
            FolderMtbl inputConfigObj,
            FolderMtbl outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    Assert.Equal(
                        inputConfig.VarName,
                        outputConfig.VarName);

                    Assert.Equal(
                        inputConfig.DirPath,
                        outputConfig.DirPath);
                },
                allowNull);

        private void AssertConfigObj(
            ProgramArgs inputConfigObj,
            ProgramArgs outputConfigObj,
            bool allowNull = true) => AssertConfigObjCore(
                inputConfigObj,
                outputConfigObj,
                (inputConfig, outputConfig) =>
                {
                    Assert.Equal(
                        inputConfig.WorkDir,
                        outputConfig.WorkDir);

                    AssertConfigObj(
                        inputConfig.LocalDevicePathsMap,
                        outputConfig.LocalDevicePathsMap);

                    AssertConfigObj(
                        inputConfig.Config,
                        outputConfig.Config);

                    AssertConfigObj(
                        inputConfig.Profile,
                        outputConfig.Profile);

                    AssertConfigObj(
                        inputConfig.SingleFileArgs,
                        outputConfig.SingleFileArgs);
                }, allowNull);

        #endregion AssertConfigObj

        private void AssertConfigObjCore<TConfigObj>(
            TConfigObj inputConfig,
            TConfigObj outputConfig,
            Action<TConfigObj, TConfigObj> assertAction,
            bool allowNull)
        {
            if (allowNull)
            {
                Assert.Equal(
                    inputConfig == null,
                    outputConfig == null);

                if (inputConfig != null)
                {
                    assertAction(
                        inputConfig,
                        outputConfig);
                }
            }
            else
            {
                assertAction(
                    inputConfig,
                    outputConfig);
            }
        }

        private string GetDumpConfigFilePath() => appEnv.GetTypePath(
            AppEnvDir.Temp, GetType(), ProgramComponent.CFG_FILE_NAME);

        private string DumpConfigToFile(
            string json)
        {
            string configDumpFilePath = GetDumpConfigFilePath();
            File.WriteAllText(configDumpFilePath, json);

            return configDumpFilePath;
        }
    }
}
