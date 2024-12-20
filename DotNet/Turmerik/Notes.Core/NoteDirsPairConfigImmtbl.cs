﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Utility;
using Turmerik.Core.Helpers;
using static Turmerik.Notes.Core.NoteDirsPairConfig;

namespace Turmerik.Notes.Core
{
    public class NoteDirsPairConfigImmtbl : INoteDirsPairConfig
    {
        private ClnblDictionary<string, IDirNameIdxesT, DirNameIdxesT, NoteDirsPairConfigMtbl.DirNameIdxesT> noteSectionDirNameIdxesClnblMap;

        public NoteDirsPairConfigImmtbl(
            INoteDirsPairConfig src)
        {
            FileNameMaxLength = src.FileNameMaxLength;
            SerializeToJson = src.SerializeToJson;
            AllowGetRequestsToPersistChanges = src.AllowGetRequestsToPersistChanges;
            TrmrkGuidInputName = src.TrmrkGuidInputName;

            ArgOpts = src.GetArgOpts()?.ToImmtbl();
            DirNames = src.GetDirNames()?.ToImmtbl();
            NoteDirNameIdxes = src.GetNoteDirNameIdxes()?.ToImmtbl();
            NoteSectionDirNameIdxes = src.GetNoteSectionDirNameIdxes()?.ToImmtbl();
            NoteInternalDirNameIdxes = src.GetNoteInternalDirNameIdxes()?.ToImmtbl();
            FileNames = src.GetFileNames()?.ToImmtbl();
            FileContents = src.GetFileContents()?.ToImmtbl();

            noteSectionDirNameIdxesClnblMap = src.GetNoteSectionDirNameIdxesMap()?.Clone();
            NoteSectionDirNameIdxesMap = noteSectionDirNameIdxesClnblMap?.AsImmtblDictnr();
        }

        public int? FileNameMaxLength { get; }
        public bool? SerializeToJson { get; }
        public bool? AllowGetRequestsToPersistChanges { get; }
        public string? TrmrkGuidInputName { get; }
        public ArgOptionsAggT ArgOpts { get; }
        public DirNamesT DirNames { get; }
        public DirNameIdxesT NoteDirNameIdxes { get; }
        public DirNameIdxesT NoteSectionDirNameIdxes { get; }
        public DirNameIdxesT NoteInternalDirNameIdxes { get; }
        public FileNamesT FileNames { get; }
        public FileContentsT FileContents { get; }

        public ReadOnlyDictionary<string, DirNameIdxesT> NoteSectionDirNameIdxesMap { get; }

        public IArgOptionsAggT GetArgOpts() => ArgOpts;
        public IDirNamesT GetDirNames() => DirNames;
        public IDirNameIdxesT GetNoteDirNameIdxes() => NoteDirNameIdxes;
        public IDirNameIdxesT GetNoteSectionDirNameIdxes() => NoteSectionDirNameIdxes;
        public IDirNameIdxesT GetNoteInternalDirNameIdxes() => NoteInternalDirNameIdxes;
        public IFileNamesT GetFileNames() => FileNames;
        public IFileContentsT GetFileContents() => FileContents;

        public ClnblDictionary<string, IDirNameIdxesT, DirNameIdxesT, NoteDirsPairConfigMtbl.DirNameIdxesT> GetNoteSectionDirNameIdxesMap() => noteSectionDirNameIdxesClnblMap;

        public class ArgOptionT : IArgOptionT
        {
            public ArgOptionT(IArgOptionT src)
            {
                Command = src.Command;
                FullArg = src.FullArg;
                ShortArg = src.ShortArg;
                Description = src.Description;
            }

            public CmdCommand? Command { get; }
            public string FullArg { get; }
            public string ShortArg { get; }
            public string Description { get; }
        }

        public class ArgOptionsAggT : IArgOptionsAggT
        {
            private ClnblDictionary<CmdCommand, IArgOptionT, ArgOptionT, NoteDirsPairConfigMtbl.ArgOptionT> commandsMap;

            public ArgOptionsAggT(IArgOptionsAggT src)
            {
                Help = src.GetHelp()?.ToImmtbl();
                SrcNote = src.GetSrcNote()?.ToImmtbl();
                SrcDirIdnf = src.GetSrcDirIdnf()?.ToImmtbl();
                SrcNoteIdx = src.GetSrcNoteIdx()?.ToImmtbl();
                DestnNote = src.GetDestnNote()?.ToImmtbl();
                DestnDirIdnf = src.GetDestnDirIdnf()?.ToImmtbl();
                DestnNoteIdx = src.GetDestnNoteIdx()?.ToImmtbl();
                IsSection = src.GetIsSection()?.ToImmtbl();
                SortIdx = src.GetSortIdx()?.ToImmtbl();
                NoteIdx = src.GetNoteIdx()?.ToImmtbl();
                OpenMdFile = src.GetOpenMdFile()?.ToImmtbl();
                ReorderNotes = src.GetReorderNotes()?.ToImmtbl();
                CreateNoteFilesDirsPair = src.GetCreateNoteFilesDirsPair()?.ToImmtbl();
                CreateNoteInternalDirsPair = src.GetCreateNoteInternalDirsPair()?.ToImmtbl();

                commandsMap = src.GetCommandsMap()?.Clone();
                CommandsMap = commandsMap?.AsImmtblDictnr();
            }

            public ArgOptionT Help { get; }
            public ArgOptionT SrcNote { get; }
            public ArgOptionT SrcDirIdnf { get; }
            public ArgOptionT SrcNoteIdx { get; }
            public ArgOptionT DestnNote { get; }
            public ArgOptionT DestnDirIdnf { get; }
            public ArgOptionT DestnNoteIdx { get; }
            public ArgOptionT NotesOrder { get; }
            public ArgOptionT NoteIdxesOrder { get; }
            public ArgOptionT IsSection { get; }
            public ArgOptionT SortIdx { get; }
            public ArgOptionT NoteIdx { get; }
            public ArgOptionT OpenMdFile { get; }
            public ArgOptionT ReorderNotes { get; }
            public ArgOptionT CreateNoteFilesDirsPair { get; }
            public ArgOptionT CreateNoteInternalDirsPair { get; }

            public ReadOnlyDictionary<CmdCommand, ArgOptionT> CommandsMap { get; }

            public IArgOptionT GetHelp() => Help;
            public IArgOptionT GetSrcNote() => SrcNote;
            public IArgOptionT GetSrcDirIdnf() => SrcDirIdnf;
            public IArgOptionT GetSrcNoteIdx() => SrcNoteIdx;
            public IArgOptionT GetDestnNote() => DestnNote;
            public IArgOptionT GetDestnDirIdnf() => DestnDirIdnf;
            public IArgOptionT GetDestnNoteIdx() => DestnNoteIdx;
            public IArgOptionT GetNotesOrder() => NotesOrder;
            public IArgOptionT GetNoteIdxesOrder() => NoteIdxesOrder;
            public IArgOptionT GetIsSection() => IsSection;
            public IArgOptionT GetSortIdx() => SortIdx;
            public IArgOptionT GetNoteIdx() => NoteIdx;
            public IArgOptionT GetOpenMdFile() => OpenMdFile;
            public IArgOptionT GetReorderNotes() => ReorderNotes;
            public IArgOptionT GetCreateNoteFilesDirsPair() => CreateNoteFilesDirsPair;
            public IArgOptionT GetCreateNoteInternalDirsPair() => CreateNoteInternalDirsPair;

            public ClnblDictionary<CmdCommand, IArgOptionT, ArgOptionT, NoteDirsPairConfigMtbl.ArgOptionT> GetCommandsMap() => commandsMap;
        }

        public class DirNamesT : IDirNamesT
        {
            public DirNamesT(IDirNamesT src)
            {
                NoteBook = src.NoteBook;
                NoteFiles = src.NoteFiles;
                NoteInternals = src.NoteInternals;
                NoteInternalsPfxes = src.GetNoteInternalsPfxes()?.ToImmtbl();
                NoteItemsPfxes = src.GetNoteItemsPfxes()?.ToImmtbl();
                NoteSectionsPfxes = src.GetNoteSectionsPfxes()?.ToImmtbl();
            }

            public string NoteBook { get; }
            public string NoteFiles { get; }
            public string NoteInternals { get; }

            public DirNamePfxesT NoteInternalsPfxes { get; }
            public DirNamePfxesT NoteItemsPfxes { get; }
            public DirNamePfxesT NoteSectionsPfxes { get; }

            public IDirNamePfxesT GetNoteInternalsPfxes() => NoteInternalsPfxes;
            public IDirNamePfxesT GetNoteItemsPfxes() => NoteItemsPfxes;
            public IDirNamePfxesT GetNoteSectionsPfxes() => NoteSectionsPfxes;
        }

        public class DirNamePfxesT : IDirNamePfxesT
        {
            public DirNamePfxesT(IDirNamePfxesT src)
            {
                MainPfx = src.MainPfx;
                AltPfx = src.AltPfx;
                UseAltPfx = src.UseAltPfx;
                JoinStr = src.JoinStr;
            }

            public string MainPfx { get; }
            public string AltPfx { get; }
            public string JoinStr { get; }
            public bool? UseAltPfx { get; }
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
                NoteItemMdFileNamePfx = src.NoteItemMdFileNamePfx;
                PrependTitleToNoteMdFileName = src.PrependTitleToNoteMdFileName;
                KeepFileName = src.KeepFileName;
            }

            public string NoteBookJsonFileName { get; }
            public string NoteItemJsonFileName { get; }
            public string NoteItemMdFileName { get; }
            public string NoteItemMdFileNamePfx { get; }
            public bool? PrependTitleToNoteMdFileName { get; }
            public string KeepFileName { get; }
        }

        public class FileContentsT : IFileContentsT
        {
            public FileContentsT(IFileContentsT src)
            {
                KeepFileContentsTemplate = src.KeepFileContentsTemplate;
                KeepFileContainsNoteJson = src.KeepFileContainsNoteJson;
                NoteFileContentsTemplate = src.NoteFileContentsTemplate;
                NoteFileContentSectionTemplate = src.NoteFileContentSectionTemplate;
                ExpectTrmrkGuidInNoteJsonFile = src.ExpectTrmrkGuidInNoteJsonFile;
                ExpectTrmrkGuidInNoteMdFile = src.ExpectTrmrkGuidInNoteMdFile;
            }

            public string KeepFileContentsTemplate { get; }
            public bool? KeepFileContainsNoteJson { get; }
            public string NoteFileContentsTemplate { get; }
            public string NoteFileContentSectionTemplate { get; }
            public bool? ExpectTrmrkGuidInNoteJsonFile { get; }
            public bool? ExpectTrmrkGuidInNoteMdFile { get; }
        }
    }
}
