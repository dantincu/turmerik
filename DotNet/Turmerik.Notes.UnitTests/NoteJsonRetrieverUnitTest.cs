using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.Notes.Core;

namespace Turmerik.Notes.UnitTests
{
    public class NoteJsonRetrieverUnitTest : UnitTestBase
    {
        private static readonly string dirSep = Path.DirectorySeparatorChar.ToString();

        private static readonly IJsonConversion jsonConversion;
        private static readonly INoteJsonRetriever noteJsonRetriever;
        private static readonly IDriveItemsRetriever driveItemsRetriever;
        private static readonly NotesAppConfigMtbl appConfig;
        private static readonly NoteDirsPairConfigMtbl config;

        static NoteJsonRetrieverUnitTest()
        {
            jsonConversion = SvcProv.GetRequiredService<IJsonConversion>();
            noteJsonRetriever = SvcProv.GetRequiredService<INoteJsonRetriever>();
            driveItemsRetriever = SvcProv.GetRequiredService<IDriveItemsRetriever>();

            string configFilePath = Path.Combine(
                Environment.CurrentDirectory,
                TrmrkNotesH.NOTES_CFG_FILE_NAME);

            appConfig = jsonConversion.Adapter.Deserialize<NotesAppConfigMtbl>(
                File.ReadAllText(configFilePath));

            config = appConfig.NoteDirPairs;
            config.FileContents.RequireTrmrkGuidInNoteJsonFile = false;
        }

        [Fact]
        public async Task BasicNoteItemJsonTest1Async()
        {
            string json = jsonConversion.Adapter.Serialize(
                new NoteItemCore
                {
                    TrmrkGuid = Trmrk.TrmrkGuid,
                    Title = "asdf"
                });

            await PerformNoteItemJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = config.FileNames.NoteItemJsonFileName,
                        TextFileContents = json
                    }.Arr());
                },
                new NoteItemJsonTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = config.FileNames.NoteItemJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, config.FileNames.NoteItemJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task BasicNoteItemJsonTest2Async()
        {
            string json = jsonConversion.Adapter.Serialize(
                new NoteItemCore
                {
                    Title = "asdf"
                });

            await PerformNoteItemJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = config.FileNames.NoteItemJsonFileName,
                        TextFileContents = json
                    }.Arr());
                },
                new NoteItemJsonTuple
                {
                    TrmrkGuidIsValid = false,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                    },
                    File = new DriveItem
                    {
                        Name = config.FileNames.NoteItemJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, config.FileNames.NoteItemJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task MainNoteItemJsonTest1Async()
        {
            string json = jsonConversion.Adapter.Serialize(
                new NoteItemCore
                {
                    TrmrkGuid = Trmrk.TrmrkGuid,
                    Title = "asdf"
                });

            await PerformNoteItemJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteItemJsonFileName,
                        TextFileContents = json
                    }.Arr());
                },
                new NoteItemJsonTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = "qwer" + config.FileNames.NoteItemJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, "qwer" + config.FileNames.NoteItemJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task MainNoteItemJsonTest2Async()
        {
            string json = jsonConversion.Adapter.Serialize(
                new NoteItemCore
                {
                    Title = "asdf"
                });

            await PerformNoteItemJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteItemJsonFileName,
                        TextFileContents = json
                    }.Arr());
                },
                new NoteItemJsonTuple
                {
                    TrmrkGuidIsValid = false,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                    },
                    File = new DriveItem
                    {
                        Name = "qwer" + config.FileNames.NoteItemJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, "qwer" + config.FileNames.NoteItemJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task FinalNoteItemJsonTest1Async()
        {
            var json = jsonConversion.Adapter.Serialize(
                new NoteItemCore
                {
                    TrmrkGuid = Trmrk.TrmrkGuid,
                    Title = "asdf"
                });

            await PerformNoteItemJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteItemJsonFileName,
                        TextFileContents = json
                    }.Arr(new TextFile
                    {
                        Name = config.FileNames.NoteItemJsonFileName,
                        TextFileContents = jsonConversion.Adapter.Serialize(
                            new NoteItemCore
                            {
                                Title = "zxcv"
                            })
                    }));
                },
                new NoteItemJsonTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = "qwer" + config.FileNames.NoteItemJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, "qwer" + config.FileNames.NoteItemJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task FinalNoteItemJsonTest2Async()
        {
            var json = jsonConversion.Adapter.Serialize(
                new NoteItemCore
                {
                    Title = "zxcv"
                });

            await PerformNoteItemJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteItemJsonFileName,
                        TextFileContents = jsonConversion.Adapter.Serialize(
                            new NoteItemCore
                            {
                                Title = "asdf"
                            })
                    }.Arr(new TextFile
                    {
                        Name = config.FileNames.NoteItemJsonFileName,
                        TextFileContents = json
                    }));
                },
                new NoteItemJsonTuple
                {
                    TrmrkGuidIsValid = false,
                    Item = new NoteItemCore
                    {
                        Title = "zxcv",
                    },
                    File = new DriveItem
                    {
                        Name = config.FileNames.NoteItemJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, config.FileNames.NoteItemJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task BasicNoteBookJsonTest1Async()
        {
            string json = jsonConversion.Adapter.Serialize(
                new NoteBookCore
                {
                    TrmrkGuid = Trmrk.TrmrkGuid,
                    Title = "asdf"
                });

            await PerformNoteBookJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = config.FileNames.NoteBookJsonFileName,
                        TextFileContents = json
                    }.Arr());
                },
                new NoteBookJsonTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteBookCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = config.FileNames.NoteBookJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, config.FileNames.NoteBookJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task BasicNoteBookJsonTest2Async()
        {
            string json = jsonConversion.Adapter.Serialize(
                new NoteBookCore
                {
                    Title = "asdf"
                });

            await PerformNoteBookJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = config.FileNames.NoteBookJsonFileName,
                        TextFileContents = json
                    }.Arr());
                },
                new NoteBookJsonTuple
                {
                    TrmrkGuidIsValid = false,
                    Item = new NoteBookCore
                    {
                        Title = "asdf",
                    },
                    File = new DriveItem
                    {
                        Name = config.FileNames.NoteBookJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, config.FileNames.NoteBookJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task MainNoteBookJsonTest1Async()
        {
            string json = jsonConversion.Adapter.Serialize(
                new NoteBookCore
                {
                    TrmrkGuid = Trmrk.TrmrkGuid,
                    Title = "asdf"
                });

            await PerformNoteBookJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteBookJsonFileName,
                        TextFileContents = json
                    }.Arr());
                },
                new NoteBookJsonTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteBookCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = "qwer" + config.FileNames.NoteBookJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, "qwer" + config.FileNames.NoteBookJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task MainNoteBookJsonTest2Async()
        {
            string json = jsonConversion.Adapter.Serialize(
                new NoteBookCore
                {
                    Title = "asdf"
                });

            await PerformNoteBookJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteBookJsonFileName,
                        TextFileContents = json
                    }.Arr());
                },
                new NoteBookJsonTuple
                {
                    TrmrkGuidIsValid = false,
                    Item = new NoteBookCore
                    {
                        Title = "asdf",
                    },
                    File = new DriveItem
                    {
                        Name = "qwer" + config.FileNames.NoteBookJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, "qwer" + config.FileNames.NoteBookJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task FinalNoteBookJsonTest1Async()
        {
            var json = jsonConversion.Adapter.Serialize(
                new NoteBookCore
                {
                    TrmrkGuid = Trmrk.TrmrkGuid,
                    Title = "asdf"
                });

            await PerformNoteBookJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteBookJsonFileName,
                        TextFileContents = json
                    }.Arr(new TextFile
                    {
                        Name = config.FileNames.NoteBookJsonFileName,
                        TextFileContents = jsonConversion.Adapter.Serialize(
                            new NoteItemCore
                            {
                                Title = "zxcv"
                            })
                    }));
                },
                new NoteBookJsonTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteBookCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = "qwer" + config.FileNames.NoteBookJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, "qwer" + config.FileNames.NoteBookJsonFileName),
                    RawContent = json
                });
        }

        [Fact]
        public async Task FinalNoteBookJsonTest2Async()
        {
            var json = jsonConversion.Adapter.Serialize(
                new NoteItemCore
                {
                    Title = "zxcv"
                });

            await PerformNoteBookJsonTestAsync(
                config,
                dirSep,
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteBookJsonFileName,
                        TextFileContents = jsonConversion.Adapter.Serialize(
                            new NoteBookCore
                            {
                                Title = "asdf"
                            })
                    }.Arr(new TextFile
                    {
                        Name = config.FileNames.NoteBookJsonFileName,
                        TextFileContents = json
                    }));
                },
                new NoteBookJsonTuple
                {
                    TrmrkGuidIsValid = false,
                    Item = new NoteBookCore
                    {
                        Title = "zxcv",
                    },
                    File = new DriveItem
                    {
                        Name = config.FileNames.NoteBookJsonFileName
                    },
                    FileIdnf = string.Concat(dirSep, config.FileNames.NoteBookJsonFileName),
                    RawContent = json
                });
        }

        private async Task PerformNoteJsonTestAsync<TItem, TTuple>(
            NoteDirsPairConfigMtbl cfg,
            string parentPath,
            Action<DriveItem> rootItemBuilder,
            TTuple expectedResult,
            Func<INoteDirsPairConfig, string, DriveItem[], Task<TTuple>> retrieverFunc)
            where TItem : NoteItemCoreBase
            where TTuple : NoteJsonTupleCore<TItem>, new()
        {
            await Semaphore.WaitAsync();

            try
            {
                RefreshRootItem(rootItemBuilder);
                var parentDir = await driveItemsRetriever.GetFolderAsync(parentPath, false);

                var filesArr = parentDir.FolderFiles.ToArray();
                var prIdnf = parentPath;

                var actualResult = await retrieverFunc(
                    cfg, prIdnf, filesArr);

                AssertEqual(expectedResult, actualResult);
            }
            finally
            {
                Semaphore.Release();
            }
        }

        private Task PerformNoteItemJsonTestAsync(
            NoteDirsPairConfigMtbl cfg,
            string parentPath,
            Action<DriveItem> rootItemBuilder,
            NoteItemJsonTuple expectedResult) => PerformNoteJsonTestAsync<NoteItemCore, NoteItemJsonTuple>(
                cfg, parentPath, rootItemBuilder, expectedResult,
                noteJsonRetriever.TryGetNoteItemJsonFileAsync);

        private Task PerformNoteBookJsonTestAsync(
            NoteDirsPairConfigMtbl cfg,
            string parentPath,
            Action<DriveItem> rootItemBuilder,
            NoteBookJsonTuple expectedResult) => PerformNoteJsonTestAsync<NoteBookCore, NoteBookJsonTuple>(
                cfg, parentPath, rootItemBuilder, expectedResult,
                noteJsonRetriever.TryGetNoteBookJsonFileAsync);
    }
}
