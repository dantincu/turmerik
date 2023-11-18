using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Helpers;
using Turmerik.Utility;
using static Turmerik.Notes.NoteDirsPairConfig;

namespace Turmerik.Notes
{
    public class NoteDirsPairConfigImmtbl : INoteDirsPairConfig
    {
        public NoteDirsPairConfigImmtbl(
            INoteDirsPairConfig src)
        {
            FileNameMaxLength = src.FileNameMaxLength;
            SerializeToJson = src.SerializeToJson;
            AllowGetRequestsToPersistChanges = src.AllowGetRequestsToPersistChanges;
            TrmrkGuidInputName = src.TrmrkGuidInputName;

            ArgOpts = src.GetArgOpts()?.ToImmtbl();
            DirNames = src.GetDirNames()?.ToImmtbl();
            NoteDirNameIdxes = src.GetNoteDirNameIdxes()?.ToImmtbl();
            NoteInternalDirNameIdxes = src.GetNoteInternalDirNameIdxes()?.ToImmtbl();
            FileNames = src.GetFileNames()?.ToImmtbl();
            FileContents = src.GetFileContents()?.ToImmtbl();
        }

        public int? FileNameMaxLength { get; }
        public bool? SerializeToJson { get; }
        public bool? AllowGetRequestsToPersistChanges { get; }
        public string? TrmrkGuidInputName { get; }
        public ArgOptionsAggT ArgOpts { get; }
        public DirNamesT DirNames { get; }
        public DirNameIdxesT NoteDirNameIdxes { get; }
        public DirNameIdxesT NoteInternalDirNameIdxes { get; }
        public FileNamesT FileNames { get; }
        public FileContentsT FileContents { get; }

        public IArgOptionsAggT GetArgOpts() => ArgOpts;
        public IDirNamesT GetDirNames() => DirNames;
        public IDirNameIdxesT GetNoteDirNameIdxes() => NoteDirNameIdxes;
        public IDirNameIdxesT GetNoteInternalDirNameIdxes() => NoteInternalDirNameIdxes;
        public IFileNamesT GetFileNames() => FileNames;
        public IFileContentsT GetFileContents() => FileContents;

        public class ArgOptionT : IArgOptionT
        {
            public ArgOptionT(IArgOptionT src)
            {
                Command = src.Command;
                FullArg = src.FullArg;
                ShortArg = src.ShortArg;
            }

            public CmdCommand? Command { get; }
            public string FullArg { get; }
            public string ShortArg { get; }
        }

        public class ArgOptionsAggT : IArgOptionsAggT
        {
            private ClnblDictionary<CmdCommand, IArgOptionT, ArgOptionT, NoteDirsPairConfigMtbl.ArgOptionT> commandsMap;

            public ArgOptionsAggT(IArgOptionsAggT src)
            {
                SrcNote = src.GetSrcNote()?.ToImmtbl();
                SrcDirIdnf = src.GetSrcDirIdnf()?.ToImmtbl();
                SrcNoteIdx = src.GetSrcNoteIdx()?.ToImmtbl();
                DestnNote = src.GetDestnNote()?.ToImmtbl();
                DestnDirIdnf = src.GetDestnDirIdnf()?.ToImmtbl();
                DestnNoteIdx = src.GetDestnNoteIdx()?.ToImmtbl();
                IsPinned = src.GetIsPinned()?.ToImmtbl();
                SortIdx = src.GetSortIdx()?.ToImmtbl();
                OpenMdFile = src.GetOpenMdFile()?.ToImmtbl();
                CreateNoteFilesDirsPair = src.GetCreateNoteFilesDirsPair()?.ToImmtbl();
                CreateNoteInternalDirsPair = src.GetCreateNoteInternalDirsPair()?.ToImmtbl();

                commandsMap = src.GetCommandsMap()?.Clone();
                CommandsMap = commandsMap?.AsImmtblDictnr();
            }

            public ArgOptionT SrcNote { get; }
            public ArgOptionT SrcDirIdnf { get; }
            public ArgOptionT SrcNoteIdx { get; }
            public ArgOptionT DestnNote { get; }
            public ArgOptionT DestnDirIdnf { get; }
            public ArgOptionT DestnNoteIdx { get; }
            public ArgOptionT IsPinned { get; }
            public ArgOptionT SortIdx { get; }
            public ArgOptionT OpenMdFile { get; }
            public ArgOptionT CreateNoteFilesDirsPair { get; }
            public ArgOptionT CreateNoteInternalDirsPair { get; }

            public ReadOnlyDictionary<CmdCommand, ArgOptionT> CommandsMap { get; }

            public IArgOptionT GetSrcNote() => SrcNote;
            public IArgOptionT GetSrcDirIdnf() => SrcDirIdnf;
            public IArgOptionT GetSrcNoteIdx() => SrcNoteIdx;
            public IArgOptionT GetDestnNote() => DestnNote;
            public IArgOptionT GetDestnDirIdnf() => DestnDirIdnf;
            public IArgOptionT GetDestnNoteIdx() => DestnNoteIdx;
            public IArgOptionT GetIsPinned() => IsPinned;
            public IArgOptionT GetSortIdx() => SortIdx;
            public IArgOptionT GetOpenMdFile() => OpenMdFile;
            public IArgOptionT GetCreateNoteFilesDirsPair() => CreateNoteFilesDirsPair;
            public IArgOptionT GetCreateNoteInternalDirsPair() => CreateNoteInternalDirsPair;

            public ClnblDictionary<CmdCommand, IArgOptionT, ArgOptionT, NoteDirsPairConfigMtbl.ArgOptionT> GetCommandsMap() => commandsMap;
        }

        public class DirNamesT : IDirNamesT
        {
            public DirNamesT(IDirNamesT src)
            {
                NoteBook = src.NoteBook;
                NoteFiles = src.NoteFiles;
                NoteInternals = src.NoteInternals;
                NoteInternalsPfx = src.NoteInternalsPfx;
                NoteItemsPfx = src.NoteItemsPfx;
                JoinStr = src.JoinStr;
            }

            public string NoteBook { get; }
            public string NoteFiles { get; }
            public string NoteInternals { get; }
            public string NoteInternalsPfx { get; }
            public string NoteItemsPfx { get; }
            public string JoinStr { get; }
        }

        public class DirNameIdxesT : IDirNameIdxesT
        {
            public DirNameIdxesT(IDirNameIdxesT src)
            {
                MinIdx = src.MinIdx;
                MaxIdx = src.MaxIdx;
                IncIdx = src.IncIdx;
                FillGapsByDefault = src.FillGapsByDefault;
                IdxFmt = src.IdxFmt;
            }

            public int? MinIdx { get; }
            public int? MaxIdx { get; }
            public bool? IncIdx { get; }
            public bool? FillGapsByDefault { get; }
            public string? IdxFmt { get; }
        }

        public class FileNamesT : IFileNamesT
        {
            public FileNamesT(IFileNamesT src)
            {
                NoteBookJsonFileName = src.NoteBookJsonFileName;
                NoteItemJsonFileName = src.NoteItemJsonFileName;
                NoteItemMdFileName = src.NoteItemMdFileName;
                PrependTitleToNoteMdFileName = src.PrependTitleToNoteMdFileName;
                KeepFileName = src.KeepFileName;
            }

            public string NoteBookJsonFileName { get; }
            public string NoteItemJsonFileName { get; }
            public string NoteItemMdFileName { get; }
            public bool? PrependTitleToNoteMdFileName { get; }
            public string KeepFileName { get; }
        }

        public class FileContentsT : IFileContentsT
        {
            public FileContentsT(IFileContentsT src)
            {
                KeepFileContentsTemplate = src.KeepFileContentsTemplate;
                KeepFileContentsTemplate = src.KeepFileContentsTemplate;
                RequireTrmrkGuidInNoteJsonFile = src.RequireTrmrkGuidInNoteJsonFile;
                RequireTrmrkGuidInNoteMdFile = src.RequireTrmrkGuidInNoteMdFile;
            }

            public string KeepFileContentsTemplate { get; }
            public string NoteFileContentsTemplate { get; }
            public bool? RequireTrmrkGuidInNoteJsonFile { get; }
            public bool? RequireTrmrkGuidInNoteMdFile { get; }
        }
    }
}
