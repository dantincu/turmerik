using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.Notes.Core
{
    public enum NoteDirType
    {
        ShortName,
        FullName
    }

    public enum NoteDirPfxType
    {
        Main,
        Alt
    }

    public enum NoteDirCategory
    {
        Item,
        Section,
        Internals
    }

    public enum NoteInternalDir
    {
        Root = 1,
        Internals,
        Files
    }

    public readonly struct NoteDirTypeTuple
    {
        public NoteDirTypeTuple(
            NoteDirCategory dirCat,
            NoteDirType dirType,
            NoteDirPfxType dirPfxType)
        {
            DirCat = dirCat;
            DirType = dirType;
            DirPfxType = dirPfxType;
        }

        public NoteDirCategory DirCat { get; }
        public NoteDirType DirType { get; }
        public NoteDirPfxType DirPfxType { get; }
    }

    public readonly struct NoteDirRegexTuple
    {
        public NoteDirRegexTuple(
            Regex regex,
            string prefix)
        {
            Regex = regex ?? throw new ArgumentNullException(nameof(regex));
            Prefix = prefix ?? throw new ArgumentNullException(nameof(prefix));
        }

        public Regex Regex { get; }
        public string Prefix { get; }
    }

    public readonly struct NoteDirMatchTuple
    {
        public NoteDirMatchTuple(
            string dirName,
            string shortDirName,
            string? shortDirNamePart,
            string? fullDirNamePart,
            int noteDirIdx,
            NoteDirTypeTuple dirTypeTuple,
            NoteDirRegexTuple dirRegexTuple,
            NoteInternalDir? noteInternalDir,
            string? noteSectionRank)
        {
            DirName = dirName ?? throw new ArgumentNullException(nameof(dirName));
            ShortDirName = shortDirName ?? throw new ArgumentNullException(nameof(shortDirName));
            ShortDirNamePart = shortDirNamePart;
            FullDirNamePart = fullDirNamePart;
            NoteDirIdx = noteDirIdx;
            DirTypeTuple = dirTypeTuple;
            DirRegexTuple = dirRegexTuple;
            NoteInternalDir = noteInternalDir;
            NoteSectionRank = noteSectionRank;
        }

        public string DirName { get; }
        public string ShortDirName { get; }
        public string? ShortDirNamePart { get; }
        public string? FullDirNamePart { get; }
        public int NoteDirIdx { get; }
        public NoteDirTypeTuple DirTypeTuple { get; }
        public NoteDirRegexTuple DirRegexTuple { get; }
        public NoteInternalDir? NoteInternalDir { get; }
        public string? NoteSectionRank { get; }
    }
}
