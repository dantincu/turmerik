using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.Notes;
using Turmerik.Helpers;
using Turmerik.Utility;

namespace Turmerik.DriveExplorer.DirsPair
{
    public interface IDirsPairGenerator
    {
        Task<List<DriveItemX>> GenerateItemsAsync(
            DirsPairOpts opts);
    }

    public class DirsPairGenerator : IDirsPairGenerator
    {
        private readonly IDriveExplorerService dvExplrSvc;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;
        private readonly INextNoteIdxRetriever nextNoteIdxRetriever;
        private readonly INoteCfgValuesRetriever noteCfgValuesRetriever;
        private readonly INoteDirsPairConfig config;
        private readonly NoteDirsPairConfig.IFileNamesT fileNamesCfg;
        private readonly NoteDirsPairConfig.IFileContentsT fileContentsCfg;
        private readonly NoteDirsPairConfig.IDirNamesT dirNamesCfg;
        private readonly NoteDirsPairConfig.IDirNameIdxesT dirNameIdxesCfg;
        private readonly string keepFileContents;

        public DirsPairGenerator(
            IDriveExplorerService dvExplrSvc,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IExistingDirPairsRetriever existingDirPairsRetriever,
            INextNoteIdxRetriever nextNoteIdxRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever,
            INoteDirsPairConfig config)
        {
            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(
                nameof(dvExplrSvc));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

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
            dirNameIdxesCfg = config.GetNoteDirNameIdxes();

            keepFileContents = noteCfgValuesRetriever.GetKeepFileContents(
                fileContentsCfg);
        }

        public async Task<List<DriveItemX>> GenerateItemsAsync(
            DirsPairOpts opts)
        {
            List<DriveItemX> dirsList;

            bool createInternaDirs = opts.CreateNoteBook || opts.CreateNoteFilesDir || opts.CreateNoteInternalsDir;

            if (opts.CreateNote || createInternaDirs)
            {
                var noteItemsTuple = await existingDirPairsRetriever.GetNoteDirPairsAsync(
                    opts.PrIdnf);

                if (opts.CreateNote)
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
            DirsPairOpts opts, NoteItemsTupleCore noteItemsTuple)
        {
            int idx = nextNoteIdxRetriever.GetNextIdx(
                dirNameIdxesCfg, noteItemsTuple.ExistingNoteDirIdxes);

            var pfxesCfg = dirNamesCfg.GetNoteItemsPfxes();

            string pfx = (pfxesCfg.UseAltPfx ?? false) switch
            {
                false => pfxesCfg.MainPfx,
                true => pfxesCfg.AltPfx,
            };

            string shortDirName = pfx + noteCfgValuesRetriever.GetDirIdxStr(
                config.GetNoteDirNameIdxes(), idx);

            string fullDirName = string.Join(
                pfxesCfg.JoinStr,
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
                    fullDirName)
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
            int idx = 1;

            var dirsList = GenerateInternalDirsPair(
                opts, ref idx, true);

            return dirsList;
        }

        private List<DriveItemX> GenerateInternalDirsPair(
            DirsPairOpts opts, NoteItemsTupleCore noteItemsTuple)
        {
            int idx = nextNoteIdxRetriever.GetNextIdx(
                dirNameIdxesCfg, noteItemsTuple.ExistingInternalDirIdxes);

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
                opts.KeepFileName,
                opts.KeepFileContents);

        private DriveItemX GetFullNameDir(
            string fullDirName,
            string keepFileName = null,
            string keepFileContents = null) => new DriveItemX
            {
                Name = fullDirName,
                IsFolder = true,
                FolderFiles = new DriveItemX
                {
                    Name = keepFileName ?? fileNamesCfg.KeepFileName,
                    Data = new DriveItemXData
                    {
                        TextFileContents = keepFileContents ?? this.keepFileContents
                    }
                }.Arr().ToList(),
                Data = new DriveItemXData()
            };
    }
}
