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
    public class FilesClonerProgramConfigUnitTest : UnitTestBase
    {
        private readonly IAppEnv appEnv;
        private readonly IJsonConversion jsonConversion;
        private readonly IBasicEqualityComparerFactory basicEqualityComparerFactory;

        public FilesClonerProgramConfigUnitTest()
        {
            appEnv = SvcProv.GetRequiredService<IAppEnv>();
            jsonConversion = SvcProv.GetRequiredService<IJsonConversion>();
            basicEqualityComparerFactory = SvcProv.GetRequiredService<IBasicEqualityComparerFactory>();
        }

        [Fact]
        public void MainTest()
        {
            AssertConfigObj(new ProgramConfig
            {
                Profiles = new List<ProgramConfig.Profile>
                {
                    new ProgramConfig.Profile
                    {
                        ProfileName = "notes-blazorapp",
                        FileGroups = new List<ProgramConfig.FilesGroup>
                        {
                            new ProgramConfig.FilesGroup
                            {
                                CloneBaseDirLocator = new FsEntryLocator
                                {
                                    EntryRelPath = "./wwwroot"
                                },
                                Files = new List<FileArgs>
                                {
                                    new FileArgs
                                    {
                                        InputFileLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "./trmrk-notes-config.json"
                                        },
                                        CloneDirLocator = new FsEntryLocator(),
                                        UseChecksum = true
                                    }
                                }
                            },
                            new ProgramConfig.FilesGroup
                            {
                                InputBaseDirLocator = new FsEntryLocator
                                {
                                    EntryBasePath = "../../ParcelWs-V2/apps/trmrk-notes-blazorapp"
                                },
                                CloneBaseDirLocator = new FsEntryLocator
                                {
                                    EntryBasePath = "./wwwroot"
                                },
                                Files = new List<FileArgs>
                                {
                                    new FileArgs
                                    {
                                        InputFileLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "./dist/dev/index.js"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "./js/dev"
                                        },
                                        UseChecksum = true,
                                        CloneTplLines = [ "{0}",
                                            "export const turmerik = window.turmerik;" ]
                                    },
                                    new FileArgs
                                    {
                                        InputFileLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "./dist/prod/index.js"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "./js/dev"
                                        },
                                        UseChecksum = true,
                                        CloneTplLines = [ "{0}",
                                            "export const turmerik = window.turmerik;" ]
                                    }
                                }
                            }
                        },
                        ScriptGroups = new List<ProgramConfig.ScriptsGroup>
                        {
                            new ProgramConfig.ScriptsGroup
                            {
                                WorkDir = "../../ParcelWs-V2/apps/trmrk-notes-blazorapp",
                                OnBeforeScripts = new List<ProgramConfig.Script>
                                {
                                    new ProgramConfig.Script
                                    {
                                        Command = "rimraf .\\.parcel-cache"
                                    },
                                    new ProgramConfig.Script
                                    {
                                        Command = "rimraf .\\.dist"
                                    },
                                    new ProgramConfig.Script
                                    {
                                        Command = "npm run build-dev"
                                    },
                                    new ProgramConfig.Script
                                    {
                                        Command = "npm run build-prod"
                                    }
                                }
                            },
                            new ProgramConfig.ScriptsGroup
                            {
                                WorkDir = "./wwwroot",
                                OnBeforeScripts = new List<ProgramConfig.Script>
                                {
                                    new ProgramConfig.Script
                                    {
                                        WorkDir = "./wwwroot",
                                        Command = "rimraf js"
                                    },
                                    new ProgramConfig.Script
                                    {
                                        WorkDir = "./wwwroot",
                                        Command = "rimraf trmrk-notes-config"
                                    }
                                }
                            }
                        }
                    },
                    new ProgramConfig.Profile
                    {
                        ProfileName = "dotnet-util-bins",
                        FileGroups = new List<ProgramConfig.FilesGroup>
                        {
                            new ProgramConfig.FilesGroup
                            {
                                InputBaseDirLocator = new FsEntryLocator
                                {
                                    EntryRelPath = "./DotNet"
                                },
                                CloneBaseDirLocator = new FsEntryLocator
                                {
                                    EntryRelPath = "<$TURMERIK_DOTNET_UTILITY_APPS_ENV_DIR>"
                                },
                                CloneArchiveDirLocator = new FsEntryLocator
                                {
                                    EntryPath = "<$ONEDRIVE_DIR>\\<$ONEDRIVE_TURMERIK_DOT_NET_UTILITY_APPS_ARCHIVE_RELDIR>"
                                },
                                CloneArchiveFileNameTpl = "Apps[{0:yyyy-MM-dd_HH-mm-ss.fffffffK}].zip",
                                Dirs = new List<DirArgs>
                                {
                                    new DirArgs
                                    {
                                        InputDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Turmerik.LsFsDirsPair.ConsoleApp\\Release\\net8.0"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Bin\\Turmerik.LsFsDirsPair.ConsoleApp\\Release\\net8.0"
                                        }
                                    },
                                    new DirArgs
                                    {
                                        InputDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Turmerik.MkFsDirsPair.ConsoleApp\\Release\\net8.0"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Bin\\Turmerik.MkFsDirsPair.ConsoleApp\\Release\\net8.0"
                                        }
                                    },
                                    new DirArgs
                                    {
                                        InputDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Turmerik.RfDirsPairNames.ConsoleApp\\Release\\net8.0"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Bin\\Turmerik.RfDirsPairNames.ConsoleApp\\Release\\net8.0"
                                        }
                                    },
                                    new DirArgs
                                    {
                                        InputDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Turmerik.UpdFsDirPairsIdxes.ConsoleApp\\Release\\net8.0"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Bin\\Turmerik.UpdFsDirPairsIdxes.ConsoleApp\\Release\\net8.0"
                                        }
                                    },
                                    new DirArgs
                                    {
                                        InputDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Turmerik.Utility.WinFormsApp\\Release\\net8.0-windows"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Bin\\Turmerik.Utility.WinFormsApp\\Release\\net8.0-windows"
                                        }
                                    },
                                    new DirArgs
                                    {
                                        InputDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Turmerik.FilesCloner.ConsoleApp\\Release\\net8.0"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Bin\\Turmerik.FilesCloner.ConsoleApp\\Release\\net8.0"
                                        }
                                    }
                                },
                                DfInputDirFilter = new DriveEntriesSerializableFilter
                                {
                                    ExcludedRelPathRegexes = new List<string>
                                    {
                                        "^\\/app-env-locator.json$"
                                    }
                                },
                                DfBeforeCloneDestnCleanupFilter = new DriveEntriesSerializableFilter
                                {
                                    ExcludedRelPathRegexes = new List<string>
                                    {
                                        "^\\/app-env-locator.json$",
                                        "^\\/_.+\\.exe"
                                    }
                                },
                                DestnToArchiveDirs = new List<DirArgs>
                                {
                                    new DirArgs
                                    {
                                        InputDirLocator = new FsEntryLocator
                                        {
                                            EntryPath = "<$USER_PROFILE>\\AppData\\Roaming\\Turmerik\\Apps"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryPath = "<$TURMERIK_TEMP_DIR>"
                                        },
                                        InputDirFilter = new DriveEntriesSerializableFilter
                                        {
                                            IncludedRelPathRegexes = new List<string>
                                            {
                                                "\\/Config\\/", "\\/Content\\/", "\\/Data\\/"
                                            }
                                        },
                                        BeforeCloneDestnCleanupFilter = new DriveEntriesSerializableFilter
                                        {
                                            IncludedRelPathRegexes = new List<string>
                                            {
                                                // \/Apps\[\d{4}\-\d{2}\-\d{2}_\d{2}-\d{2}\-\d{2}\.\d+[\-\+]\d{4}\]\.zip
                                                // matches
                                                // /Apps[2024-02-12_07-49-00.000+0000].zip
                                                "\\/Apps\\[\\d{4}\\-\\d{2}\\-\\d{2}_\\d{2}-\\d{2}\\-\\d{2}\\.\\d+[\\-\\+]\\d{4}\\]\\.zip"
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    },
                    new ProgramConfig.Profile
                    {
                        ProfileName = "dotnet-bkp-bins",
                        FileGroups = new List<ProgramConfig.FilesGroup>
                        {
                            new ProgramConfig.FilesGroup
                            {
                                InputBaseDirLocator = new FsEntryLocator
                                {
                                    EntryRelPath = "./DotNet"
                                },
                                CloneBaseDirLocator = new FsEntryLocator
                                {
                                    EntryRelPath = "<$TURMERIK_DOTNET_UTILITY_APPS_ENV_DIR>"
                                },
                                CloneArchiveDirLocator = new FsEntryLocator
                                {
                                    EntryPath = "<$ONEDRIVE_DIR>\\<$ONEDRIVE_TURMERIK_DOT_NET_UTILITY_APPS_ARCHIVE_RELDIR>"
                                },
                                CloneArchiveFileNameTpl = "Turmerik.MkFsDirsPair.ConsoleApp[{0:yyyy-MM-dd_HH-mm-ss.fffffffK}].zip",
                                Dirs = new List<DirArgs>
                                {
                                    new DirArgs
                                    {
                                        InputDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Turmerik.FilesCloner.ConsoleApp\\Release\\net8.0"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryRelPath = "Bin\\Turmerik.FilesCloner.CmdApp\\Release\\net8.0"
                                        }
                                    }
                                },
                                DfInputDirFilter = new DriveEntriesSerializableFilter
                                {
                                    ExcludedRelPathRegexes = new List<string>
                                    {
                                        "^\\/app-env-locator.json$",
                                        "^\\/trmrk-filescloner-config.json$"
                                    }
                                },
                                DfBeforeCloneDestnCleanupFilter = new DriveEntriesSerializableFilter
                                {
                                    ExcludedRelPathRegexes = new List<string>
                                    {
                                        "^\\/app-env-locator.json$",
                                        "^\\/trmrk-filescloner-config.json$",
                                        "^\\/_.+\\.exe"
                                    }
                                },
                                DestnToArchiveDirs = new List<DirArgs>
                                {
                                    new DirArgs
                                    {
                                        InputDirLocator = new FsEntryLocator
                                        {
                                            EntryPath = "<$USER_PROFILE>\\AppData\\Roaming\\Turmerik\\Apps"
                                        },
                                        CloneDirLocator = new FsEntryLocator
                                        {
                                            EntryPath = "<$TURMERIK_TEMP_DIR>"
                                        },
                                        InputDirFilter = new DriveEntriesSerializableFilter
                                        {
                                            IncludedRelPathRegexes = new List<string> { }
                                        },
                                        BeforeCloneDestnCleanupFilter = new DriveEntriesSerializableFilter
                                        {
                                            IncludedRelPathRegexes = new List<string>
                                            {
                                                // \/Turmerik.MkFsDirsPair.ConsoleApp\[\d{4}\-\d{2}\-\d{2}_\d{2}-\d{2}\-\d{2}\.\d+[\-\+]\d{4}\]\.zip
                                                // matches
                                                // /Apps[2024-02-12_07-49-00.000+0000].zip
                                                "\\/Turmerik.MkFsDirsPair.ConsoleApp\\[\\d{4}\\-\\d{2}\\-\\d{2}_\\d{2}-\\d{2}\\-\\d{2}\\.\\d+[\\-\\+]\\d{4}\\]\\.zip"
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            }, true);
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

                    AssertSequenceEqual(
                        inputConfig.DestnToArchiveDirs,
                        outputConfig.DestnToArchiveDirs,
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
            AppEnvDir.Temp, GetType(), ProgramArgsRetriever.CFG_FILE_NAME);

        private string DumpConfigToFile(
            string json)
        {
            string configDumpFilePath = GetDumpConfigFilePath();
            string configDumpDirPath = Path.GetDirectoryName(configDumpFilePath);

            Directory.CreateDirectory(configDumpDirPath);
            File.WriteAllText(configDumpFilePath, json);

            return configDumpFilePath;
        }
    }
}
