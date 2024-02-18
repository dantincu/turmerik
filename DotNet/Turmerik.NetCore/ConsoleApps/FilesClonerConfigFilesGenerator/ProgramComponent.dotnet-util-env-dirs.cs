using System;
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
        private ProgramConfig.Profile GenerateDotNetUtilEnvDirsCfgProfile(
            bool isDevEnv) => GenerateConfigProfile("dotnet-util-env-dirs",
                new ProgramConfig.Profile
                {
                    FileGroups = new List<ProgramConfig.FilesGroup>
                    {
                        new ProgramConfig.FilesGroup
                        {
                            CloneArchiveDirLocator = new FsEntryLocator
                            {
                                EntryPath = "|$ONEDRIVE_DIR|\\|$ONEDRIVE_TURMERIK_DOT_NET_UTILITY_APPS_ARCHIVE_RELDIR|"
                            },
                            Dirs = new List<DirArgs>(),
                            CloneArchiveFileNameTpl = "AppsEnv[{0:yyyy-MM-dd_HH-mm-ss.fffffffK}].zip",
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
                                        IncludedRelPathRegexes = new List<string>
                                        {
                                            "^\\/Config\\/", "^\\/Content\\/", "^\\/Data\\/"
                                        },
                                        ExcludedRelPathRegexes = new List<string>
                                        {
                                            "^\\/Config\\/Turmerik\\.NetCore\\.ConsoleApps\\.FilesCloner\\.ProgramConfigRetriever\\/program\\-config\\/config\\.json",
                                            "^\\/Config\\/Turmerik\\.NetCore\\.ConsoleApps\\.FilesCloner\\.ProgramConfigRetriever\\/program\\-config\\/profiles\\/.+\\.config\\.json"
                                        }
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
                                            // \/AppsEnv\[\d{4}\-\d{2}\-\d{2}_\d{2}-\d{2}\-\d{2}\.\d+[\-\+]\d{4}\]\.zip
                                            // matches
                                            // /AppsEnv[2024-02-12_07-49-00.000+0000].zip
                                            "^\\/AppsEnv\\[\\d{4}\\-\\d{2}\\-\\d{2}_\\d{2}-\\d{2}\\-\\d{2}\\.\\d+(([\\-\\+]\\d{4})|Z)\\]\\.zip$"
                                        }
                                    },
                                }
                            }
                        }
                    }
                });
    }
}
