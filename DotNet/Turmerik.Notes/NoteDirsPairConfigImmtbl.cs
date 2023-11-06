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

            Prefixes = src.Prefixes?.ToImmtbl();
            ArgOpts = src.ArgOpts?.ToImmtbl();
            DirNames = src.DirNames?.ToImmtbl();
            FileNames = src.FileNames?.ToImmtbl();
            FileContents = src.FileContents?.ToImmtbl();
        }

        public int? FileNameMaxLength { get; }
        public bool? SerializeToJson { get; }
        public PrefixesT Prefixes { get; }
        public ArgOptionsT ArgOpts { get; }
        public DirNamesT DirNames { get; }
        public FileNamesT FileNames { get; }
        public FileContentsT FileContents { get; }

        public NoteDirsPairConfig.IPrefixesT GetPrefixes() => Prefixes;
        public NoteDirsPairConfig.IArgOptionsT GetArgOpts() => ArgOpts;
        public NoteDirsPairConfig.IDirNamesT GetDirNames() => DirNames;
        public NoteDirsPairConfig.IFileNamesT GetFileNames() => FileNames;
        public NoteDirsPairConfig.IFileContentsT GetFileContents() => FileContents;

        public class PrefixesT : NoteDirsPairConfig.IPrefixesT
        {
            public PrefixesT(NoteDirsPairConfigMtbl.PrefixesT src)
            {
                NoteBook = src.NoteBook;
                NoteFiles = src.NoteFiles;
                NoteInternals = src.NoteInternals;
                Note = src.Note;
            }

            public string NoteBook { get; }
            public string NoteFiles { get; }
            public string NoteInternals { get; }
            public string Note { get; }
        }

        public class ArgOptionsT : NoteDirsPairConfig.IArgOptionsT
        {
            public ArgOptionsT(NoteDirsPairConfigMtbl.ArgOptionsT src)
            {
                WorkDir = src.WorkDir;
                SortIdx = src.SortIdx;
                OpenMdFile = src.OpenMdFile;
            }

            public string WorkDir { get; }
            public string SortIdx { get; }
            public string OpenMdFile { get; }
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

        public class FileNamesT : NoteDirsPairConfig.IFileNamesT
        {
            public FileNamesT(NoteDirsPairConfigMtbl.FileNamesT src)
            {
                NoteBookFileName = src.NoteBookFileName;
                NoteFileName = src.NoteFileName;
                NoteJsonFileName = src.NoteJsonFileName;
                NoteFileNameRegex = src.NoteFileNameRegex;
                KeepFileName = src.KeepFileName;
            }

            public string NoteBookFileName { get; }
            public string NoteFileName { get; }
            public string NoteFileNameRegex { get; set; }
            public string NoteJsonFileName { get; }
            public string KeepFileName { get; }
        }

        public class FileContentsT : NoteDirsPairConfig.IFileContentsT
        {
            public FileContentsT(NoteDirsPairConfigMtbl.FileContentsT src)
            {
                KeepFileContentsTemplate = src.KeepFileContentsTemplate;
                KeepFileContentsTemplate = src.KeepFileContentsTemplate;
            }

            public string KeepFileContentsTemplate { get; }
            public string NoteFileContentsTemplate { get; }
        }
    }
}
