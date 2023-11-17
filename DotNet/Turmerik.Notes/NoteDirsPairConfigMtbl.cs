using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes
{
    public class NoteDirsPairConfigMtbl : INoteDirsPairConfig
    {
        public int? FileNameMaxLength { get; set; }
        public bool? SerializeToJson { get; set; }
        public string? TrmrkGuidInputName { get; set; }
        public ArgOptionsT ArgOpts { get; set; }
        public DirNamesT DirNames { get; set; }
        public DirNameIdxesT NoteDirNameIdxes { get; set; }
        public DirNameIdxesT NoteInternalDirNameIdxes { get; set; }
        public FileNamesT FileNames { get; set; }
        public FileContentsT FileContents { get; set; }

        public NoteDirsPairConfig.IArgOptionsT GetArgOpts() => ArgOpts;
        public NoteDirsPairConfig.IDirNamesT GetDirNames() => DirNames;
        public NoteDirsPairConfig.IDirNameIdxesT GetNoteDirNameIdxes() => NoteDirNameIdxes;
        public NoteDirsPairConfig.IDirNameIdxesT GetNoteInternalDirNameIdxes() => NoteInternalDirNameIdxes;
        public NoteDirsPairConfig.IFileNamesT GetFileNames() => FileNames;
        public NoteDirsPairConfig.IFileContentsT GetFileContents() => FileContents;

        public class ArgOptionsT : NoteDirsPairConfig.IArgOptionsT
        {
            public string WorkDir { get; set; }
            public string IsPinned { get; set; }
            public string SortIdx { get; set; }
            public string OpenMdFile { get; set; }
            public string CreateNoteBookDirsPair { get; set; }
            public string CreateNoteFilesDirsPair { get; set; }
            public string CreateNoteInternalDirsPair { get; set; }
        }

        public class DirNamesT : NoteDirsPairConfig.IDirNamesT
        {
            public string NoteBook { get; set; }
            public string NoteFiles { get; set; }
            public string NoteInternals { get; set; }
            public string NoteInternalsPfx { get; set; }
            public string NoteItemsPfx { get; set; }
            public string JoinStr { get; set; }
        }

        public class DirNameIdxesT : NoteDirsPairConfig.IDirNameIdxesT
        {
            public int? MinIdx { get; set; }
            public int? MaxIdx { get; set; }
            public bool? IncIdx { get; set; }
            public bool? FillGapsByDefault { get; set; }
            public string? IdxFmt { get; set; }
        }

        public class FileNamesT : NoteDirsPairConfig.IFileNamesT
        {
            public string NoteBookJsonFileName { get; set; }
            public string NoteItemJsonFileName { get; set; }
            public string NoteItemMdFileName { get; set; }
            public bool? PrependTitleToNoteMdFileName { get; set; }
            public string KeepFileName { get; set; }
        }

        public class FileContentsT : NoteDirsPairConfig.IFileContentsT
        {
            public string KeepFileContentsTemplate { get; set; }
            public string NoteFileContentsTemplate { get; set; }
            public bool? RequireTrmrkGuidInNoteJsonFile { get; set; }
            public bool? RequireTrmrkGuidInNoteMdFile { get; set; }
        }
    }
}
