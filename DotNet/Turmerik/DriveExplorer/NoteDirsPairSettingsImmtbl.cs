﻿using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.Lib;

namespace Turmerik.DriveExplorer
{
    public class NoteDirsPairSettingsImmtbl
    {
        public NoteDirsPairSettingsImmtbl(
            NoteDirsPairSettingsMtbl src)
        {
            FileNameMaxLength = src.FileNameMaxLength;
            SerializeToJson = src.SerializeToJson;
            NoteDirPairsIntegrityCheck = src.NoteDirPairsIntegrityCheck;

            Prefixes = src.Prefixes?.ToImmtbl();
            ArgOpts = src.ArgOpts?.ToImmtbl();
            DirNames = src.DirNames?.ToImmtbl();
            FileNames = src.FileNames?.ToImmtbl();
            FileContents = src.FileContents?.ToImmtbl();
        }

        public int? FileNameMaxLength { get; }
        public bool? SerializeToJson { get; }
        public DirPairsIntegrityCheckType? NoteDirPairsIntegrityCheck { get; }
        public PrefixesT Prefixes { get; }
        public ArgOptionsT ArgOpts { get; }
        public DirNamesT DirNames { get; }
        public FileNamesT FileNames { get; }
        public FileContentsT FileContents { get; }

        public class PrefixesT
        {
            public PrefixesT(NoteDirsPairSettingsMtbl.PrefixesT src)
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

        public class ArgOptionsT
        {
            public ArgOptionsT(NoteDirsPairSettingsMtbl.ArgOptionsT src)
            {
                WorkDir = src.WorkDir;
                SortIdx = src.SortIdx;
            }

            public string WorkDir { get; }
            public string SortIdx { get; }
        }

        public class DirNamesT
        {
            public DirNamesT(NoteDirsPairSettingsMtbl.DirNamesT src)
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

        public class FileNamesT
        {
            public FileNamesT(NoteDirsPairSettingsMtbl.FileNamesT src)
            {
                NoteBookFileName = src.NoteBookFileName;
                NoteFileName = src.NoteFileName;
                KeepFileName = src.KeepFileName;
            }

            public string NoteBookFileName { get; }
            public string NoteFileName { get; }
            public string KeepFileName { get; }
        }

        public class FileContentsT
        {
            public FileContentsT(NoteDirsPairSettingsMtbl.FileContentsT src)
            {
                KeepFileContentsTemplate = src.KeepFileContentsTemplate;
                KeepFileContentsTemplate = src.KeepFileContentsTemplate;
            }

            public string KeepFileContentsTemplate { get; }
            public string NoteFileContentsTemplate { get; }
        }
    }
}
