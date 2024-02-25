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
        private ProgramConfig.Profile GenerateNgBook2Profile(
            bool isDevEnv) => GenerateConfigProfile("ng-book-2",
                new ProgramConfig.Profile
                {
                    FileGroups = new List<ProgramConfig.FilesGroup>
                    {
                        new ProgramConfig.FilesGroup
                        {
                            CloneArchiveDirLocator = new FsEntryLocator
                            {
                                EntryPath = "|$ONEDRIVE_DIR|\\0002\\786\\795\\792\\799\\01\\2004\\01"
                            },
                            CloneArchiveFileNameTpl = "ng-book-2[{0:yyyy-MM-dd_HH-mm-ss.fffffffK}].zip",
                            Dirs = new List<DirArgs>(),
                            DestnToArchiveDirs = new List<DirArgs>
                            {
                                new DirArgs
                                {
                                    InputDirLocator = new FsEntryLocator
                                    {
                                        EntryRelPath = "|$TURMERIK_REPO_DIR|\\..\\fdltncvd\\7994\\7999"
                                    },
                                    CloneDirLocator = new FsEntryLocator
                                    {
                                        EntryBasePath = "|$TURMERIK_TEMP_DIR|",
                                        EntryRelPath = ""
                                    },
                                    InputDirFilter = new DriveEntriesSerializableFilter
                                    {
                                        ExcludedRelPathRegexes = new List<string>
                                        {
                                            "\\/node_modules\\/"
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
                                        EntryPath = "|$ONEDRIVE_DIR|\\0002\\786\\795\\792\\799\\01\\2004\\01",
                                    },
                                    InputDirFilter = new DriveEntriesSerializableFilter
                                    {
                                        IncludedRelPathRegexes = new List<string> { }
                                    },
                                    BeforeCloneDestnCleanupFilter = new DriveEntriesSerializableFilter
                                    {
                                        IncludedRelPathRegexes = new List<string>
                                        {
                                            // \/ng\-book\-2\[\d{4}\-\d{2}\-\d{2}_\d{2}-\d{2}\-\d{2}\.\d+[\-\+]\d{4}\]\.zip
                                            // matches
                                            // /ng-book-2[2024-02-12_07-49-00.000+0000].zip
                                            "^\\/ng\\-book\\-2\\[\\d{4}\\-\\d{2}\\-\\d{2}_\\d{2}-\\d{2}\\-\\d{2}\\.\\d+(([\\-\\+]\\d{4})|Z)\\]\\.zip$"
                                        }
                                    },
                                }
                            }
                        }
                    }
                });
    }

}
