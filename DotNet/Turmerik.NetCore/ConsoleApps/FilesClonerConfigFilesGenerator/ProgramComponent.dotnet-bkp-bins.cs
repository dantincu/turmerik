﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.NetCore.ConsoleApps.FilesCloner;

namespace Turmerik.NetCore.ConsoleApps.FilesClonerConfigFilesGenerator
{
    public partial class ProgramComponent
    {
        private ProgramConfig.Profile GenerateDotNetBkpBinsCfgProfile(
            bool isDevEnv) => GenerateConfigProfile("dotnet-bkp-bins",
                new ProgramConfig.Profile
                {
                    FileGroups = new List<ProgramConfig.FilesGroup>
                    {
                        new ProgramConfig.FilesGroup
                        {
                            WorkDir = "|$TURMERIK_REPO_DIR|",
                            InputBaseDirLocator = new FsEntryLocator
                            {
                                EntryRelPath = "./DotNet"
                            },
                            CloneBaseDirLocator = new FsEntryLocator
                            {
                                EntryRelPath = "|$USER_PROFILE_DIR|\\AppData\\Roaming\\Turmerik\\Apps"
                            },
                            CloneArchiveDirLocator = new FsEntryLocator
                            {
                                EntryPath = "|$ONEDRIVE_DIR|\\|$ONEDRIVE_TURMERIK_DOT_NET_UTILITY_APPS_ARCHIVE_RELDIR|"
                            },
                            CloneArchiveFileNameTpl = "Turmerik.FilesCloner.ConsoleApp[{0:yyyy-MM-dd_HH-mm-ss.fffffffK}].zip",
                            Dirs = new List<DirArgs>
                            {
                                new DirArgs
                                {
                                    InputDirLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = "Turmerik.FilesCloner.ConsoleApp\\bin\\Release\\net8.0"
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
                                    "^\\/app-env-locator\\.json$",
                                    "^\\/trmrk-localdevice-paths\\.json$",
                                    "^\\/trmrk-filescloner-config\\.json$"
                                }
                            },
                            DfBeforeCloneDestnCleanupFilter = new DriveEntriesSerializableFilter
                            {
                                ExcludedRelPathRegexes = new List<string>
                                {
                                    "^\\/app-env-locator\\.json$",
                                    "^\\/trmrk-localdevice-paths\\.json$",
                                    "^\\/trmrk-filescloner-config\\.json$",
                                    "^\\/_.+\\.exe"
                                }
                            },
                            DestnToArchiveDirs = new List<DirArgs>
                            {
                                new DirArgs
                                {
                                    InputDirLocator = new FsEntryLocator
                                    {
                                        EntryPath = "|$TURMERIK_DOTNET_UTILITY_APPS_ENV_DIR|"
                                    },
                                    CloneDirLocator = new FsEntryLocator
                                    {
                                        EntryPath = "|$TURMERIK_TEMP_DIR|"
                                    },
                                    InputDirFilter = new DriveEntriesSerializableFilter
                                    {
                                        IncludedRelPathRegexes = new List<string> { }
                                    },
                                },
                                new DirArgs
                                {
                                    InputDirLocator = new FsEntryLocator
                                    {
                                        EntryPath = "|$TURMERIK_TEMP_DIR|"
                                    },
                                    CloneDirLocator = new FsEntryLocator
                                    {
                                        EntryPath = "|$ONEDRIVE_DIR|\\|$ONEDRIVE_TURMERIK_DOT_NET_UTILITY_APPS_ARCHIVE_RELDIR|",
                                    },
                                    InputDirFilter = new DriveEntriesSerializableFilter
                                    {
                                        IncludedRelPathRegexes = new List<string> { }
                                    },
                                    BeforeCloneDestnCleanupFilter = new DriveEntriesSerializableFilter
                                    {
                                        IncludedRelPathRegexes = new List<string>
                                        {
                                            // \/Turmerik.FilesCloner.ConsoleApp\[\d{4}\-\d{2}\-\d{2}_\d{2}-\d{2}\-\d{2}\.\d+[\-\+]\d{4}\]\.zip
                                            // matches
                                            // /Turmerik.FilesCloner.ConsoleApp[2024-02-12_07-49-00.000+0000].zip
                                            "^\\/Turmerik\\.FilesCloner\\.ConsoleApp\\[\\d{4}\\-\\d{2}\\-\\d{2}_\\d{2}-\\d{2}\\-\\d{2}\\.\\d+(([\\-\\+]\\d{4})|Z)\\]\\.zip$"
                                        }
                                    },
                                }
                            }
                        }
                    }
            });
    }
}