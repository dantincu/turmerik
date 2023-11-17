using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.Notes.Settings;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.Notes.UnitTests
{
    public class NoteMdRetrieverUnitTest : UnitTestBase
    {
        private static readonly string dirSep = Path.DirectorySeparatorChar.ToString();

        private static readonly IJsonConversion jsonConversion;
        private static readonly INoteMdRetriever noteMdRetriever;
        private static readonly IDriveItemsRetriever driveItemsRetriever;
        private static readonly AppConfigCoreMtbl appConfig;
        private static readonly NoteDirsPairConfigMtbl config;

        static NoteMdRetrieverUnitTest()
        {
            jsonConversion = SvcProv.GetRequiredService<IJsonConversion>();
            noteMdRetriever = SvcProv.GetRequiredService<INoteMdRetriever>();
            driveItemsRetriever = SvcProv.GetRequiredService<IDriveItemsRetriever>();

            string configFilePath = Path.Combine(
                Environment.CurrentDirectory,
                TrmrkNotesH.NOTES_CFG_FILE_NAME);

            appConfig = jsonConversion.Adapter.Deserialize<AppConfigCoreMtbl>(
                File.ReadAllText(configFilePath));

            config = appConfig.NoteDirPairs;
            config.FileContents.RequireTrmrkGuidInNoteJsonFile = false;
        }

        [Fact]
        public async Task BasicNoteItemMdTest1Async()
        {
            string text = $"<div><input type=\"hidden\" name=\"trmrk_guid\" value=\"{Trmrk.TrmrkGuidStrNoDash}\" /></div>\n\n<div>\n\n#  asdf  \n\n</div>";

            await PerformNoteMdTestAsync(
                config,
                dirSep,
                new NoteItemCore
                {
                },
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = config.FileNames.NoteItemMdFileName,
                        TextFileContents = text
                    }.Arr());
                },
                new NoteMdTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = config.FileNames.NoteItemMdFileName
                    },
                    FileIdnf = string.Concat(dirSep, config.FileNames.NoteItemMdFileName),
                    RawContent = text
                });
        }

        [Fact]
        public async Task BasicNoteItemMdTest2Async()
        {
            string text = $"<div><input type=\"hidden\" name=\"trmrk_guid\" value=\"{Trmrk.TrmrkGuidStrNoDash}\" /></div>\n\n<div>\n\n#  asdf  \n\n</div>";

            await PerformNoteMdTestAsync(
                config,
                dirSep,
                new NoteItemCore
                {
                    Title = "asdf"
                },
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "asdf" + config.FileNames.NoteItemMdFileName,
                        TextFileContents = text
                    }.Arr());
                },
                new NoteMdTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = "asdf" + config.FileNames.NoteItemMdFileName
                    },
                    FileIdnf = string.Concat(dirSep, "asdf" + config.FileNames.NoteItemMdFileName),
                    RawContent = text
                });
        }

        [Fact]
        public async Task BasicNoteItemMdTest3Async()
        {
            string text = $"<div><input type=\"hidden\" name=\"trmrk_guid\" value=\"{Trmrk.TrmrkGuidStrNoDash}\" /></div>\n\n<div>\n\n#  asdf  \n\n</div>";

            await PerformNoteMdTestAsync(
                config,
                dirSep,
                new NoteItemCore
                {
                    Title = "asdf",
                    MdFileName = "qwer" + config.FileNames.NoteItemMdFileName
                },
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteItemMdFileName,
                        TextFileContents = text
                    }.Arr());
                },
                new NoteMdTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = "qwer" + config.FileNames.NoteItemMdFileName
                    },
                    FileIdnf = string.Concat(dirSep, "qwer" + config.FileNames.NoteItemMdFileName),
                    RawContent = text
                });
        }

        [Fact]
        public async Task MainNoteItemMdTest1Async()
        {
            string text = $"<div></div>\n\n<div>\n\n#  asdf  \n\n</div>";

            await PerformNoteMdTestAsync(
                config,
                dirSep,
                new NoteItemCore
                {
                },
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = config.FileNames.NoteItemMdFileName,
                        TextFileContents = text
                    }.Arr());
                },
                new NoteMdTuple
                {
                    TrmrkGuidIsValid = false,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                    },
                    File = new DriveItem
                    {
                        Name = config.FileNames.NoteItemMdFileName
                    },
                    FileIdnf = string.Concat(dirSep, config.FileNames.NoteItemMdFileName),
                    RawContent = text
                });
        }

        [Fact]
        public async Task MainNoteItemMdTest2Async()
        {
            string text = $"<div></div>\n\n<div>\n\n#  asdf  \n\n</div>";

            await PerformNoteMdTestAsync(
                config,
                dirSep,
                new NoteItemCore
                {
                    Title = "asdf"
                },
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "asdf" + config.FileNames.NoteItemMdFileName,
                        TextFileContents = text
                    }.Arr());
                },
                new NoteMdTuple
                {
                    TrmrkGuidIsValid = false,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                    },
                    File = new DriveItem
                    {
                        Name = "asdf" + config.FileNames.NoteItemMdFileName
                    },
                    FileIdnf = string.Concat(dirSep, "asdf" + config.FileNames.NoteItemMdFileName),
                    RawContent = text
                });
        }

        [Fact]
        public async Task MainNoteItemMdTest3Async()
        {
            string text = $"<div></div>\n\n<div>\n\n#  asdf  \n\n</div>";

            await PerformNoteMdTestAsync(
                config,
                dirSep,
                new NoteItemCore
                {
                    Title = "asdf",
                    MdFileName = "qwer" + config.FileNames.NoteItemMdFileName
                },
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteItemMdFileName,
                        TextFileContents = text
                    }.Arr());
                },
                new NoteMdTuple
                {
                    TrmrkGuidIsValid = false,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                    },
                    File = new DriveItem
                    {
                        Name = "qwer" + config.FileNames.NoteItemMdFileName
                    },
                    FileIdnf = string.Concat(dirSep, "qwer" + config.FileNames.NoteItemMdFileName),
                    RawContent = text
                });
        }

        [Fact]
        public async Task FinalNoteItemMdTest1Async()
        {
            string text = $"<div><input type=\"hidden\" name=\"trmrk_guid\" value=\"{Trmrk.TrmrkGuidStrNoDash}\" /></div>\n\n<div>\n\n#  asdf  \n\n</div>";

            await PerformNoteMdTestAsync(
                config,
                dirSep,
                new NoteItemCore
                {
                    Title = "asdf",
                    MdFileName = "qwer" + config.FileNames.NoteItemMdFileName
                },
                rootItem =>
                {
                    rootItem.FolderFiles.AddRange(new TextFile
                    {
                        Name = "zxcv" + config.FileNames.NoteItemMdFileName,
                        TextFileContents = text
                    }.Arr(new TextFile
                    {
                        Name = "qwer" + config.FileNames.NoteItemMdFileName,
                        TextFileContents = "<div></div>\n\n<div>\n\n#  asdf  \n\n</div>"
                    }));
                },
                new NoteMdTuple
                {
                    TrmrkGuidIsValid = true,
                    Item = new NoteItemCore
                    {
                        Title = "asdf",
                        TrmrkGuid = Trmrk.TrmrkGuid
                    },
                    File = new DriveItem
                    {
                        Name = "zxcv" + config.FileNames.NoteItemMdFileName
                    },
                    FileIdnf = string.Concat(dirSep, "zxcv" + config.FileNames.NoteItemMdFileName),
                    RawContent = text
                });
        }

        private async Task PerformNoteMdTestAsync(
            NoteDirsPairConfigMtbl cfg,
            string parentPath,
            NoteItemCore noteItem,
            Action<DriveItem> rootItemBuilder,
            NoteMdTuple expectedResult)
        {
            await Semaphore.WaitAsync();

            try
            {
                RefreshRootItem(rootItemBuilder);
                var parentDir = await driveItemsRetriever.GetFolderAsync(parentPath);

                var filesArr = parentDir.FolderFiles.ToArray();
                var prIdnf = parentPath;

                var actualResult = await noteMdRetriever.TryGetNoteMdFileAsync(
                    cfg, prIdnf, noteItem, filesArr);

                AssertEqual(expectedResult, actualResult);
            }
            finally
            {
                Semaphore.Release();
            }
        }
    }
}
