using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Turmerik.DriveExplorer.Notes
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
}
