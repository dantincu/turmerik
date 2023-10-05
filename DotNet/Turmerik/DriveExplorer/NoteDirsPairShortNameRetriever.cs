using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairShortNameRetriever
    {
        INoteDirsPairIdxRetriever NextIdxRetriever { get; }

        string GetShortDirName(
            NoteDirsPairIdxOpts opts,
            out NoteDirsPairIdx notesDirPairIdx);

        string GetShortDirName(
            NoteDirsPairIdxOpts opts);
    }

    public class NoteDirsPairShortNameRetriever : INoteDirsPairShortNameRetriever
    {
        public NoteDirsPairShortNameRetriever(
            INoteDirsPairIdxRetriever noteDirsPairIdxRetriever)
        {
            this.NextIdxRetriever = noteDirsPairIdxRetriever ?? throw new ArgumentNullException(nameof(noteDirsPairIdxRetriever));
        }

        public INoteDirsPairIdxRetriever NextIdxRetriever { get; }

        public string GetShortDirName(
            NoteDirsPairIdxOpts opts,
            out NoteDirsPairIdx notesDirPairIdx)
        {
            notesDirPairIdx = NextIdxRetriever.GetNextDirIdx(opts);

            string dirNamePfx = GetDirNamePfx(
                opts.DirCategory);

            string shortDirName = string.Concat(
                dirNamePfx, notesDirPairIdx.Idx);

            return shortDirName;
        }

        public string GetShortDirName(
            NoteDirsPairIdxOpts opts) => GetShortDirName(
                opts, out _);

        private string GetDirNamePfx(
            DirCategory dirCat) => dirCat switch
            {
                DirCategory.Item => NextIdxRetriever.NoteItemsPfx.RawStr,
                DirCategory.Internals => NextIdxRetriever.NoteInternalsPfx.RawStr
            };
    }
}
