using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Helpers;
using Turmerik.Notes.ConsoleApps;
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
        public string? TrmrkGuidInputName { get; }
        public ArgOptionsT ArgOpts { get; }
        public DirNamesT DirNames { get; }
        public DirNameIdxesT NoteDirNameIdxes { get; }
        public DirNameIdxesT NoteInternalDirNameIdxes { get; }
        public FileNamesT FileNames { get; }
        public FileContentsT FileContents { get; }

        public IArgOptionsT GetArgOpts() => ArgOpts;
        public IDirNamesT GetDirNames() => DirNames;
        public IDirNameIdxesT GetNoteDirNameIdxes() => NoteDirNameIdxes;
        public IDirNameIdxesT GetNoteInternalDirNameIdxes() => NoteInternalDirNameIdxes;
        public IFileNamesT GetFileNames() => FileNames;
        public IFileContentsT GetFileContents() => FileContents;

        public class CmdCommandTupleT : ICmdCommandTupleT
        {
            public CmdCommandTupleT(ICmdCommandTupleT src)
            {
                Value = src.Value;
                FullArgValue = src.FullArgValue;
                ShortArgValue = src.ShortArgValue;
            }

            public CmdCommand? Value { get; }
            public string FullArgValue { get; }
            public string ShortArgValue { get; }
        }

        public class ArgOptionsT : IArgOptionsT
        {
            private ClnblDictionary<CmdCommand, ICmdCommandTupleT, CmdCommandTupleT, NoteDirsPairConfigMtbl.CmdCommandTupleT> commandsMap;

            public ArgOptionsT(IArgOptionsT src)
            {
                SrcNote = src.SrcNote;
                SrcDirIdnf = src.SrcDirIdnf;
                SrcNoteIdx = src.SrcNoteIdx;
                DestnNote = src.DestnNote;
                DestnDirIdnf = src.DestnDirIdnf;
                DestnNoteIdx = src.DestnNoteIdx;
                IsPinned = src.IsPinned;
                SortIdx = src.SortIdx;
                OpenMdFile = src.OpenMdFile;
                CreateNoteFilesDirsPair = src.CreateNoteFilesDirsPair;
                CreateNoteInternalDirsPair = src.CreateNoteInternalDirsPair;

                commandsMap = src.GetCommandsMap()?.Clone();
                CommandsMap = commandsMap?.AsImmtblDictnr();
            }

            public string SrcNote { get; }
            public string SrcDirIdnf { get; }
            public string SrcNoteIdx { get; }
            public string DestnNote { get; }
            public string DestnDirIdnf { get; }
            public string DestnNoteIdx { get; }
            public string IsPinned { get; }
            public string SortIdx { get; }
            public string OpenMdFile { get; }
            public string CreateNoteFilesDirsPair { get; }
            public string CreateNoteInternalDirsPair { get; }

            public ReadOnlyDictionary<CmdCommand, CmdCommandTupleT> CommandsMap { get; }

            public ClnblDictionary<CmdCommand, ICmdCommandTupleT, CmdCommandTupleT, NoteDirsPairConfigMtbl.CmdCommandTupleT> GetCommandsMap() => commandsMap;
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
