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
    public class NoteDirsPairConfigMtbl : INoteDirsPairConfig
    {
        public NoteDirsPairConfigMtbl(
            INoteDirsPairConfig src)
        {
            FileNameMaxLength = src.FileNameMaxLength;
            SerializeToJson = src.SerializeToJson;
            TrmrkGuidInputName = src.TrmrkGuidInputName;

            ArgOpts = src.GetArgOpts()?.ToMtbl();
            DirNames = src.GetDirNames()?.ToMtbl();
            NoteDirNameIdxes = src.GetNoteDirNameIdxes()?.ToMtbl();
            NoteInternalDirNameIdxes = src.GetNoteInternalDirNameIdxes()?.ToMtbl();
            FileNames = src.GetFileNames()?.ToMtbl();
            FileContents = src.GetFileContents()?.ToMtbl();
        }

        public NoteDirsPairConfigMtbl()
        {
        }

        public int? FileNameMaxLength { get; set; }
        public bool? SerializeToJson { get; set; }
        public string? TrmrkGuidInputName { get; set; }
        public ArgOptionsT ArgOpts { get; set; }
        public DirNamesT DirNames { get; set; }
        public DirNameIdxesT NoteDirNameIdxes { get; set; }
        public DirNameIdxesT NoteInternalDirNameIdxes { get; set; }
        public FileNamesT FileNames { get; set; }
        public FileContentsT FileContents { get; set; }

        public IArgOptionsT GetArgOpts() => ArgOpts;
        public IDirNamesT GetDirNames() => DirNames;
        public IDirNameIdxesT GetNoteDirNameIdxes() => NoteDirNameIdxes;
        public IDirNameIdxesT GetNoteInternalDirNameIdxes() => NoteInternalDirNameIdxes;
        public IFileNamesT GetFileNames() => FileNames;
        public IFileContentsT GetFileContents() => FileContents;

        public class CmdCommandTupleT : ICmdCommandTupleT
        {
            public CmdCommandTupleT()
            {
            }

            public CmdCommandTupleT(ICmdCommandTupleT src)
            {
                Value = src.Value;
                FullArgValue = src.FullArgValue;
                ShortArgValue = src.ShortArgValue;
            }

            public CmdCommand? Value { get; set; }
            public string FullArgValue { get; set; }
            public string ShortArgValue { get; set; }
        }

        public class ArgOptionsT : IArgOptionsT
        {
            private ClnblDictionary<CmdCommand, ICmdCommandTupleT, NoteDirsPairConfigImmtbl.CmdCommandTupleT, CmdCommandTupleT> commandsMap;

            public ArgOptionsT()
            {
            }

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
                CommandsMap = commandsMap?.AsMtblDictnr();
            }

            public string SrcNote { get; set; }
            public string SrcDirIdnf { get; set; }
            public string SrcNoteIdx { get; set; }
            public string DestnNote { get; set; }
            public string DestnDirIdnf { get; set; }
            public string DestnNoteIdx { get; set; }
            public string IsPinned { get; set; }
            public string SortIdx { get; set; }
            public string OpenMdFile { get; set; }
            public string CreateNoteFilesDirsPair { get; set; }
            public string CreateNoteInternalDirsPair { get; set; }

            public Dictionary<CmdCommand, CmdCommandTupleT> CommandsMap { get; set; }

            public ClnblDictionary<CmdCommand, ICmdCommandTupleT, NoteDirsPairConfigImmtbl.CmdCommandTupleT, CmdCommandTupleT> GetCommandsMap() => commandsMap;
        }

        public class DirNamesT : IDirNamesT
        {
            public DirNamesT()
            {
            }

            public DirNamesT(IDirNamesT src)
            {
                NoteBook = src.NoteBook;
                NoteFiles = src.NoteFiles;
                NoteInternals = src.NoteInternals;
                NoteInternalsPfx = src.NoteInternalsPfx;
                NoteItemsPfx = src.NoteItemsPfx;
                JoinStr = src.JoinStr;
            }

            public string NoteBook { get; set; }
            public string NoteFiles { get; set; }
            public string NoteInternals { get; set; }
            public string NoteInternalsPfx { get; set; }
            public string NoteItemsPfx { get; set; }
            public string JoinStr { get; set; }
        }

        public class DirNameIdxesT : IDirNameIdxesT
        {
            public DirNameIdxesT()
            {
            }

            public DirNameIdxesT(IDirNameIdxesT src)
            {
                MinIdx = src.MinIdx;
                MaxIdx = src.MaxIdx;
                IncIdx = src.IncIdx;
                FillGapsByDefault = src.FillGapsByDefault;
                IdxFmt = src.IdxFmt;
            }

            public int? MinIdx { get; set; }
            public int? MaxIdx { get; set; }
            public bool? IncIdx { get; set; }
            public bool? FillGapsByDefault { get; set; }
            public string? IdxFmt { get; set; }
        }

        public class FileNamesT : IFileNamesT
        {
            public FileNamesT()
            {
            }

            public FileNamesT(IFileNamesT src)
            {
                NoteBookJsonFileName = src.NoteBookJsonFileName;
                NoteItemJsonFileName = src.NoteItemJsonFileName;
                NoteItemMdFileName = src.NoteItemMdFileName;
                PrependTitleToNoteMdFileName = src.PrependTitleToNoteMdFileName;
                KeepFileName = src.KeepFileName;
            }

            public string NoteBookJsonFileName { get; set; }
            public string NoteItemJsonFileName { get; set; }
            public string NoteItemMdFileName { get; set; }
            public bool? PrependTitleToNoteMdFileName { get; set; }
            public string KeepFileName { get; set; }
        }

        public class FileContentsT : IFileContentsT
        {
            public FileContentsT()
            {
            }

            public FileContentsT(IFileContentsT src)
            {
                KeepFileContentsTemplate = src.KeepFileContentsTemplate;
                KeepFileContentsTemplate = src.KeepFileContentsTemplate;
                RequireTrmrkGuidInNoteJsonFile = src.RequireTrmrkGuidInNoteJsonFile;
                RequireTrmrkGuidInNoteMdFile = src.RequireTrmrkGuidInNoteMdFile;
            }

            public string KeepFileContentsTemplate { get; set; }
            public string NoteFileContentsTemplate { get; set; }
            public bool? RequireTrmrkGuidInNoteJsonFile { get; set; }
            public bool? RequireTrmrkGuidInNoteMdFile { get; set; }
        }
    }
}
