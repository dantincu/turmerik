using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes
{
    public interface INoteDirsPairConfig
    {
        int? FileNameMaxLength { get; }
        bool? SerializeToJson { get; }
        string? TrmrkGuidInputName { get; }
        NoteDirsPairConfig.IArgOptionsT GetArgOpts();
        NoteDirsPairConfig.IDirNamesT GetDirNames();
        NoteDirsPairConfig.IDirNameIdxesT GetNoteDirNameIdxes();
        NoteDirsPairConfig.IDirNameIdxesT GetNoteInternalDirNameIdxes();
        NoteDirsPairConfig.IFileNamesT GetFileNames();
        NoteDirsPairConfig.IFileContentsT GetFileContents();
    }

    public static class NoteDirsPairConfig
    {
        public interface IArgOptionsT
        {
            string WorkDir { get; }
            string IsPinned { get; }
            string SortIdx { get; }
            string OpenMdFile { get; }
            string CreateNoteBookDirsPair { get; }
            string CreateNoteFilesDirsPair { get; }
            string CreateNoteInternalDirsPair { get; }
        }

        public interface IDirNamesT
        {
            string NoteBook { get; }
            string NoteFiles { get; }
            string NoteInternals { get; }
            string NoteInternalsPfx { get; }
            string NoteItemsPfx { get; }
            string JoinStr { get; }
        }

        public interface IDirNameIdxesT
        {
            int? MinIdx { get; }
            int? MaxIdx { get; }
            bool? IncIdx { get; }
            bool? FillGapsByDefault { get; }
            string? IdxFmt { get; }
        }

        public interface IFileNamesT
        {
            string NoteBookJsonFileName { get; }
            string NoteJsonFileName { get; }
            string NoteMdFileName { get; }
            bool? PrependTitleToNoteMdFileName { get; }
            string KeepFileName { get; }
        }

        public interface IFileContentsT
        {
            string KeepFileContentsTemplate { get; }
            string NoteFileContentsTemplate { get; }
        }

        public static NoteDirsPairConfigImmtbl ToImmtbl(
            this NoteDirsPairConfigMtbl src) => new NoteDirsPairConfigImmtbl(src);

        public static NoteDirsPairConfigImmtbl.ArgOptionsT ToImmtbl(
            this NoteDirsPairConfigMtbl.ArgOptionsT src) => new NoteDirsPairConfigImmtbl.ArgOptionsT(src);

        public static NoteDirsPairConfigImmtbl.DirNamesT ToImmtbl(
            this NoteDirsPairConfigMtbl.DirNamesT src) => new NoteDirsPairConfigImmtbl.DirNamesT(src);

        public static NoteDirsPairConfigImmtbl.DirNameIdxesT ToImmtbl(
            this NoteDirsPairConfigMtbl.DirNameIdxesT src) => new NoteDirsPairConfigImmtbl.DirNameIdxesT(src);

        public static NoteDirsPairConfigImmtbl.FileNamesT ToImmtbl(
            this NoteDirsPairConfigMtbl.FileNamesT src) => new NoteDirsPairConfigImmtbl.FileNamesT(src);

        public static NoteDirsPairConfigImmtbl.FileContentsT ToImmtbl(
            this NoteDirsPairConfigMtbl.FileContentsT src) => new NoteDirsPairConfigImmtbl.FileContentsT(src);
    }
}
