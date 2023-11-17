using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.Notes
{
    public class NoteDirsPairConfigImmtbl : INoteDirsPairConfig
    {
        public NoteDirsPairConfigImmtbl(
            NoteDirsPairConfigMtbl src)
        {
            FileNameMaxLength = src.FileNameMaxLength;
            SerializeToJson = src.SerializeToJson;
            TrmrkGuidInputName = src.TrmrkGuidInputName;

            ArgOpts = src.ArgOpts?.ToImmtbl();
            DirNames = src.DirNames?.ToImmtbl();
            NoteDirNameIdxes = src.NoteDirNameIdxes?.ToImmtbl();
            NoteInternalDirNameIdxes = src.NoteInternalDirNameIdxes?.ToImmtbl();
            FileNames = src.FileNames?.ToImmtbl();
            FileContents = src.FileContents?.ToImmtbl();
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

        public NoteDirsPairConfig.IArgOptionsT GetArgOpts() => ArgOpts;
        public NoteDirsPairConfig.IDirNamesT GetDirNames() => DirNames;
        public NoteDirsPairConfig.IDirNameIdxesT GetNoteDirNameIdxes() => NoteDirNameIdxes;
        public NoteDirsPairConfig.IDirNameIdxesT GetNoteInternalDirNameIdxes() => NoteInternalDirNameIdxes;
        public NoteDirsPairConfig.IFileNamesT GetFileNames() => FileNames;
        public NoteDirsPairConfig.IFileContentsT GetFileContents() => FileContents;

        public class ArgOptionsT : NoteDirsPairConfig.IArgOptionsT
        {
            public ArgOptionsT(NoteDirsPairConfigMtbl.ArgOptionsT src)
            {
                WorkDir = src.WorkDir;
                IsPinned = src.IsPinned;
                SortIdx = src.SortIdx;
                OpenMdFile = src.OpenMdFile;
                CreateNoteBookDirsPair = src.CreateNoteBookDirsPair;
                CreateNoteFilesDirsPair = src.CreateNoteFilesDirsPair;
                CreateNoteInternalDirsPair = src.CreateNoteInternalDirsPair;
            }

            public string WorkDir { get; }
            public string IsPinned { get; }
            public string SortIdx { get; }
            public string OpenMdFile { get; }
            public string CreateNoteBookDirsPair { get; }
            public string CreateNoteFilesDirsPair { get; }
            public string CreateNoteInternalDirsPair { get; }
        }

        public class DirNamesT : NoteDirsPairConfig.IDirNamesT
        {
            public DirNamesT(NoteDirsPairConfigMtbl.DirNamesT src)
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

        public class DirNameIdxesT : NoteDirsPairConfig.IDirNameIdxesT
        {
            public DirNameIdxesT(NoteDirsPairConfigMtbl.DirNameIdxesT src)
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

        public class FileNamesT : NoteDirsPairConfig.IFileNamesT
        {
            public FileNamesT(NoteDirsPairConfigMtbl.FileNamesT src)
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

        public class FileContentsT : NoteDirsPairConfig.IFileContentsT
        {
            public FileContentsT(NoteDirsPairConfigMtbl.FileContentsT src)
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
