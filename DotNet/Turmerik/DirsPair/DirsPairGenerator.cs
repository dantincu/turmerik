using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.Notes.Core;

namespace Turmerik.DirsPair
{
    public interface IDirsPairGenerator
    {
        Task<List<DriveItemX>> GenerateItemsAsync(
            DirsPairOpts opts);
    }

    public class DirsPairGenerator : IDirsPairGenerator
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IDriveExplorerService dvExplrSvc;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;
        private readonly INextNoteIdxRetriever nextNoteIdxRetriever;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;
        private readonly INoteDirsPairConfig config;
        private readonly NoteDirsPairConfig.IFileNamesT fileNamesCfg;
        private readonly NoteDirsPairConfig.IFileContentsT fileContentsCfg;
        private readonly NoteDirsPairConfig.IDirNamesT dirNamesCfg;
        private readonly NoteDirsPairConfig.IDirNameIdxesT noteItemDirNameIdxesCfg;
        private readonly NoteDirsPairConfig.IDirNameIdxesT noteSectionDirNameIdxesCfg;
        private readonly NoteDirsPairConfig.IDirNameIdxesT internalDirNameIdxesCfg;
        private readonly bool keepFileContainsNoteJson;
        private readonly string defaultKeepFileContents;

        public DirsPairGenerator(
            IJsonConversion jsonConversion,
            IDriveExplorerService dvExplrSvc,
            IExistingDirPairsRetriever existingDirPairsRetriever,
            INextNoteIdxRetriever nextNoteIdxRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever,
            INoteDirsPairConfig config)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(
                nameof(dvExplrSvc));

            this.existingDirPairsRetriever = existingDirPairsRetriever ?? throw new ArgumentNullException(
                nameof(existingDirPairsRetriever));

            this.nextNoteIdxRetriever = nextNoteIdxRetriever ?? throw new ArgumentNullException(
                nameof(nextNoteIdxRetriever));

            this.noteCfgValuesRetriever = noteCfgValuesRetriever ?? throw new ArgumentNullException(
                nameof(noteCfgValuesRetriever));

            this.config = config ?? throw new ArgumentNullException(
                nameof(config));

            fileNamesCfg = config.GetFileNames();
            fileContentsCfg = config.GetFileContents();
            dirNamesCfg = config.GetDirNames();
            noteItemDirNameIdxesCfg = config.GetNoteDirNameIdxes();
            noteSectionDirNameIdxesCfg = config.GetNoteSectionDirNameIdxes();
            internalDirNameIdxesCfg = config.GetNoteInternalDirNameIdxes();

            keepFileContainsNoteJson = fileContentsCfg.KeepFileContainsNoteJson ?? false;

            defaultKeepFileContents = noteCfgValuesRetriever.GetKeepFileContents(
                fileContentsCfg);
        }

        public async Task<List<DriveItemX>> GenerateItemsAsync(
            DirsPairOpts opts)
        {
            List<DriveItemX> dirsList;

            bool createInternaDirs = opts.CreateNoteBook || opts.CreateNoteFilesDir || opts.CreateNoteInternalsDir;

            if (opts.CreateNote || opts.CreateNoteSection || createInternaDirs)
            {
                var noteItemsTuple = await existingDirPairsRetriever.GetNoteDirPairsAsync(
                    opts.PrIdnf);

                if (opts.CreateNote || opts.CreateNoteSection)
                {
                    dirsList = GenerateNote(
                        opts, noteItemsTuple);
                }
                else
                {
                    dirsList = GenerateInternalDirsPair(
                        opts, noteItemsTuple);
                }
            }
            else
            {
                dirsList = await GenerateItemsCoreAsync(opts);
            }

            if (opts.ThrowIfAnyItemAlreadyExists)
            {
                foreach (var item in dirsList)
                {
                    item.Idnf ??= dvExplrSvc.GetItemIdnf(
                        item, opts.PrIdnf);

                    if (await dvExplrSvc.ItemExistsAsync(
                        item.Idnf))
                    {
                        throw new InvalidOperationException(
                            $"File path {item.Idnf} already exists");
                    }
                }
            }

            return dirsList;
        }

        private async Task<List<DriveItemX>> GenerateItemsCoreAsync(
            DirsPairOpts opts)
        {
            var folderFiles = GetFolderFiles(opts);
            var dirsPair = GetDirsPair(opts, folderFiles);

            return dirsPair;
        }

        private List<DriveItemX> GenerateNote(
            DirsPairOpts opts,
            NoteItemsTupleCore noteItemsTuple)
        {
            var noteDirNameIdxesCfg = opts.CreateNoteSection switch
            {
                true => noteSectionDirNameIdxesCfg,
                false => noteItemDirNameIdxesCfg
            };

            var existingDirIdxes = opts.CreateNoteSection switch
            {
                true => noteItemsTuple.ExistingNoteSectionDirIdxes,
                false => noteItemsTuple.ExistingNoteDirIdxes
            };

            bool fillGapsByDefault = noteDirNameIdxesCfg.FillGapsByDefault ?? false;
            bool isFillingGap, isOutOfBounds;

            int idx = nextNoteIdxRetriever.GetNextIdx(
                noteDirNameIdxesCfg,
                existingDirIdxes,
                out isFillingGap,
                out isOutOfBounds);

            if (isOutOfBounds || (isFillingGap != fillGapsByDefault))
            {
                throw new InvalidOperationException(
                    string.Join(" ", $"Could not retrieve next idx: value {idx} is",
                    isOutOfBounds ? "out of bounds" : "filling idxes gaps while that not being allowed"));
            }

            var pfxesCfg = opts.CreateNoteSection switch
            {
                true => dirNamesCfg.GetNoteSectionsPfxes(),
                _ => dirNamesCfg.GetNoteItemsPfxes()
            };

            string pfx = (pfxesCfg.UseAltPfx ?? false) switch
            {
                false => pfxesCfg.MainPfx,
                true => pfxesCfg.AltPfx,
            };

            string shortDirName = opts.ShortDirName ?? (
                pfx + noteCfgValuesRetriever.GetDirIdxStr(
                    noteDirNameIdxesCfg, idx));

            string fullDirName = string.Join(
                opts.JoinStr ?? pfxesCfg.JoinStr,
                shortDirName,
                opts.FullDirNamePart);

            var dirsList = new List<DriveItemX>
            {
                new DriveItemX
                {
                    IsFolder = true,
                    Name = shortDirName,
                    FolderFiles = GetFolderFiles(opts),
                    SubFolders = GenerateInternalDirsPair(opts),
                    Data = new DriveItemXData()
                },
                GetFullNameDir(
                    fullDirName,
                    opts.Title)
            };

            return dirsList;
        }

        private List<DriveItemX> GenerateInternalDirsPair(
            DirsPairOpts opts,
            ref int idx,
            bool excludeNoteBook)
        {
            var dirsList = new List<DriveItemX>();

            if (!excludeNoteBook && opts.CreateNoteBook)
            {
                dirsList.AddRange(
                    GenerateNoteInternalDirsPairCore(
                        ref idx, NoteInternalDir.Root));
            }

            if (opts.CreateNoteInternalsDir)
            {
                dirsList.AddRange(
                    GenerateNoteInternalDirsPairCore(
                        ref idx, NoteInternalDir.Internals));
            }

            if (opts.CreateNoteFilesDir)
            {
                dirsList.AddRange(
                    GenerateNoteInternalDirsPairCore(
                        ref idx, NoteInternalDir.Files));
            }

            return dirsList;
        }

        private List<DriveItemX> GenerateInternalDirsPair(
            DirsPairOpts opts)
        {
            int idx = noteCfgValuesRetriever.GetDefaultIdx(
                config.GetNoteInternalDirNameIdxes());

            var dirsList = GenerateInternalDirsPair(
                opts, ref idx, true);

            return dirsList;
        }

        private List<DriveItemX> GenerateInternalDirsPair(
            DirsPairOpts opts, NoteItemsTupleCore noteItemsTuple)
        {
            bool fillGapsByDefault = internalDirNameIdxesCfg.FillGapsByDefault ?? false;
            bool isFillingGap, isOutOfBounds;

            int idx = nextNoteIdxRetriever.GetNextIdx(
                internalDirNameIdxesCfg,
                noteItemsTuple.ExistingInternalDirIdxes,
                out isFillingGap,
                out isOutOfBounds);

            if (isOutOfBounds || (isFillingGap != fillGapsByDefault))
            {
                throw new InvalidOperationException(
                    string.Join(" ", $"Could not retrieve next idx: value {idx} is",
                    isOutOfBounds ? "out of bounds" : "filling idxes gaps while that not being allowed"));
            }

            var dirsList = GenerateInternalDirsPair(
                opts, ref idx, false);

            return dirsList;
        }

        private List<DriveItemX> GenerateNoteInternalDirsPairCore(
            ref int idx, NoteInternalDir noteInternalDir)
        {
            var pfxesCfg = dirNamesCfg.GetNoteInternalsPfxes();

            string pfx = (pfxesCfg.UseAltPfx ?? false) switch
            {
                false => pfxesCfg.MainPfx,
                true => pfxesCfg.AltPfx,
            };

            string shortDirName = pfx + noteCfgValuesRetriever.GetDirIdxStr(
                config.GetNoteInternalDirNameIdxes(), idx);

            string fullDirNamePart = noteInternalDir switch
            {
                NoteInternalDir.Root => dirNamesCfg.NoteBook,
                NoteInternalDir.Internals => dirNamesCfg.NoteInternals,
                NoteInternalDir.Files => dirNamesCfg.NoteFiles,
                _ => throw new NotSupportedException()
            };

            string fullDirName = string.Join(
                pfxesCfg.JoinStr,
                shortDirName,
                fullDirNamePart);

            var dirsList = new List<DriveItemX>
            {
                new DriveItemX
                {
                    IsFolder = true,
                    Name = shortDirName,
                    Data = new DriveItemXData()
                },
                GetFullNameDir(
                    fullDirName)
            };

            idx++;
            return dirsList;
        }

        private List<DriveItemX> GetDirsPair(
            DirsPairOpts opts,
            List<DriveItemX> folderFiles) => new List<DriveItemX>
            {
                new DriveItemX
                {
                    Name = opts.ShortDirName,
                    IsFolder = true,
                    FolderFiles = folderFiles,
                    Data = new DriveItemXData()
                },
                GetFullNameDir(
                    string.Join(
                        opts.JoinStr,
                        opts.ShortDirName,
                        opts.FullDirNamePart),
                    opts)
            };

        private List<DriveItemX> GetFolderFiles(
            DirsPairOpts opts)
        {
            List<DriveItemX> folderFiles = null;

            if (!string.IsNullOrWhiteSpace(
                opts.MdFileName))
            {
                var mdFile = new DriveItemX
                {
                    Name = opts.MdFileName,
                    Data = new DriveItemXData
                    {
                        TextFileContents = string.Format(
                            opts.MdFileContentsTemplate,
                            opts.Title,
                            Trmrk.TrmrkGuidStrNoDash,
                            opts.TrmrkGuidInputName ?? TrmrkNotesH.TRMRK_GUID_INPUT_NAME) + opts.MdFileFirstContent
                    }
                };

                folderFiles = new List<DriveItemX>
                {
                    mdFile
                };
            }

            return folderFiles;
        }

        private DriveItemX GetFullNameDir(
            string fullDirName,
            DirsPairOpts opts) => GetFullNameDir(
                fullDirName,
                opts.Title,
                opts.KeepFileName,
                opts.KeepFileContents);

        private DriveItemX GetFullNameDir(
            string fullDirName,
            string? title = null,
            string? keepFileName = null,
            string? keepFileContents = null) => new DriveItemX
            {
                Name = fullDirName,
                IsFolder = true,
                FolderFiles = new DriveItemX
                {
                    Name = keepFileName ?? fileNamesCfg.KeepFileName,
                    Data = new DriveItemXData
                    {
                        TextFileContents = keepFileContents ?? ((
                            keepFileContainsNoteJson && title != null) switch
                            {
                                true => jsonConversion.Adapter.Serialize(
                                    new NoteItemCore
                                    {
                                        Title = title,
                                    }),
                                false => this.defaultKeepFileContents
                            })
                    }
                }.Arr().ToList(),
                Data = new DriveItemXData()
            };
    }
}
