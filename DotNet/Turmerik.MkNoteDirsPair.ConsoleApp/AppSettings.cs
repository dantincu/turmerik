using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkNoteDirsPair.ConsoleApp
{
    public class AppSettings
    {
        public TrmrkT Trmrk { get; set; }

        public class TrmrkT
        {
            public int? FileNameMaxLength { get; set; }
            public PrefixesT Prefixes { get; set; }
            public ArgOptionsT ArgOpts { get; set; }
            public DirNamesT DirNames { get; set; }
            public FileNamesT FileNames { get; set; }
            public FileContentsT FileContents { get; set; }

            public class PrefixesT
            {
                public string NoteBook { get; set; }
                public string NoteFiles { get; set; }
                public string NoteInternals { get; set; }
                public string Note { get; set; }
            }

            public class ArgOptionsT
            {
                public string GroudIdx { get; set; }
            }

            public class DirNamesT
            {
                public string NoteBook { get; set; }
                public string NoteFiles { get; set; }
                public string NoteInternals { get; set; }
                public string NoteInternalsPfx { get; set; }
                public string NoteItemsPfx { get; set; }
                public string JoinStr { get; set; }
            }

            public class FileNamesT
            {
                public string KeepFileName { get; set; }
                public string NoteFileName { get; set; }
            }

            public class FileContentsT
            {
                public string KeepFileContentsTemplate { get; set; }
                public string NoteFileContentsTemplate { get; set; }
            }
        }
    }
}
