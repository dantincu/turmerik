using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes
{
    public class NoteDirsPairConfigMtbl
    {
        public int? FileNameMaxLength { get; set; }
        public bool? SerializeToJson { get; set; }
        public PrefixesT Prefixes { get; set; }
        public ArgOptionsT ArgOpts { get; set; }
        public DirNamesT DirNames { get; set; }
        public FileNamesT FileNames { get; set; }
        public FileContentsT FileContents { get; set; }

        public NoteDirsPairConfig.IPrefixesT GetPrefixes() => Prefixes;
        public NoteDirsPairConfig.IArgOptionsT GetArgOpts() => ArgOpts;
        public NoteDirsPairConfig.IDirNamesT GetDirNames() => DirNames;
        public NoteDirsPairConfig.IFileNamesT GetFileNames() => FileNames;
        public NoteDirsPairConfig.IFileContentsT GetFileContents() => FileContents;

        public class PrefixesT : NoteDirsPairConfig.IPrefixesT
        {
            public string NoteBook { get; set; }
            public string NoteFiles { get; set; }
            public string NoteInternals { get; set; }
            public string Note { get; set; }
        }

        public class ArgOptionsT : NoteDirsPairConfig.IArgOptionsT
        {
            public string WorkDir { get; set; }
            public string SortIdx { get; set; }
            public string OpenMdFile { get; set; }
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

        public class FileNamesT : NoteDirsPairConfig.IFileNamesT
        {
            public string NoteBookFileName { get; set; }
            public string NoteFileName { get; set; }
            public string NoteFileNameRegex { get; set; }
            public string NoteJsonFileName { get; set; }
            public string KeepFileName { get; set; }
        }

        public class FileContentsT : NoteDirsPairConfig.IFileContentsT
        {
            public string KeepFileContentsTemplate { get; set; }
            public string NoteFileContentsTemplate { get; set; }
        }
    }
}
