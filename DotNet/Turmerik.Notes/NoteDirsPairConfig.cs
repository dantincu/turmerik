using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Notes.ConsoleApps;

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
        public interface ICmdCommandTupleT
        {
            CmdCommand? Value { get; }
            string FullArgValue { get; }
            string ShortArgValue { get; }
        }

        public interface IArgOptionsT
        {
            string SrcNote { get; }
            string SrcDirIdnf { get; }
            string SrcNoteIdx { get; }
            string DestnNote { get; }
            string DestnDirIdnf { get; }
            string DestnNoteIdx { get; }
            string IsPinned { get; }
            string SortIdx { get; }
            string OpenMdFile { get; }
            string CreateNoteFilesDirsPair { get; }
            string CreateNoteInternalDirsPair { get; }

            IEnumerable<KeyValuePair<CmdCommand, ICmdCommandTupleT>> GetCommandsMap();
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
            string NoteItemJsonFileName { get; }
            string NoteItemMdFileName { get; }
            bool? PrependTitleToNoteMdFileName { get; }
            string KeepFileName { get; }
        }

        public interface IFileContentsT
        {
            string KeepFileContentsTemplate { get; }
            string NoteFileContentsTemplate { get; }
            bool? RequireTrmrkGuidInNoteJsonFile { get; }
            bool? RequireTrmrkGuidInNoteMdFile { get; }
        }

        public static NoteDirsPairConfigImmtbl ToImmtbl(
            this INoteDirsPairConfig src) => new NoteDirsPairConfigImmtbl(src);

        public static NoteDirsPairConfigImmtbl.CmdCommandTupleT ToImmtbl(
            this ICmdCommandTupleT src) => new NoteDirsPairConfigImmtbl.CmdCommandTupleT(src);

        public static NoteDirsPairConfigImmtbl.ArgOptionsT ToImmtbl(
            this IArgOptionsT src) => new NoteDirsPairConfigImmtbl.ArgOptionsT(src);

        public static NoteDirsPairConfigImmtbl.DirNamesT ToImmtbl(
            this IDirNamesT src) => new NoteDirsPairConfigImmtbl.DirNamesT(src);

        public static NoteDirsPairConfigImmtbl.DirNameIdxesT ToImmtbl(
            this IDirNameIdxesT src) => new NoteDirsPairConfigImmtbl.DirNameIdxesT(src);

        public static NoteDirsPairConfigImmtbl.FileNamesT ToImmtbl(
            this IFileNamesT src) => new NoteDirsPairConfigImmtbl.FileNamesT(src);

        public static NoteDirsPairConfigImmtbl.FileContentsT ToImmtbl(
            this IFileContentsT src) => new NoteDirsPairConfigImmtbl.FileContentsT(src);

        public static NoteDirsPairConfigMtbl ToMtbl(
            this INoteDirsPairConfig src) => new NoteDirsPairConfigMtbl(src);

        public static NoteDirsPairConfigMtbl.CmdCommandTupleT ToMtbl(
            this ICmdCommandTupleT src) => new NoteDirsPairConfigMtbl.CmdCommandTupleT(src);

        public static NoteDirsPairConfigMtbl.ArgOptionsT ToMtbl(
            this IArgOptionsT src) => new NoteDirsPairConfigMtbl.ArgOptionsT(src);

        public static NoteDirsPairConfigMtbl.DirNamesT ToMtbl(
            this IDirNamesT src) => new NoteDirsPairConfigMtbl.DirNamesT(src);

        public static NoteDirsPairConfigMtbl.DirNameIdxesT ToMtbl(
            this IDirNameIdxesT src) => new NoteDirsPairConfigMtbl.DirNameIdxesT(src);

        public static NoteDirsPairConfigMtbl.FileNamesT ToMtbl(
            this IFileNamesT src) => new NoteDirsPairConfigMtbl.FileNamesT(src);

        public static NoteDirsPairConfigMtbl.FileContentsT ToMtbl(
            this IFileContentsT src) => new NoteDirsPairConfigMtbl.FileContentsT(src);
    }
}
