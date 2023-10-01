using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairShortNameRetriever
    {
        string GetShortDirName(
            NoteDirsPairIdxOpts opts);
    }

    public class NoteDirsPairShortNameRetriever : INoteDirsPairShortNameRetriever
    {
        private readonly INoteDirsPairIdxRetriever nextIdxRetriever;

        public NoteDirsPairShortNameRetriever(
            INoteDirsPairIdxRetriever noteDirsPairIdxRetriever)
        {
            this.nextIdxRetriever = noteDirsPairIdxRetriever ?? throw new ArgumentNullException(nameof(noteDirsPairIdxRetriever));
        }

        public string GetShortDirName(
            NoteDirsPairIdxOpts opts)
        {
            int nextIdx = nextIdxRetriever.GetNextDirIdx(opts);

            string dirNamePfx = GetDirNamePfx(
                opts.DirCategory);

            string shortDirName = string.Concat(
                dirNamePfx, nextIdx);

            return shortDirName;
        }

        private string GetDirNamePfx(
            NoteDirCategory dirCat) => dirCat switch
            {
                NoteDirCategory.TrmrkNote => nextIdxRetriever.NoteItemsPfx.RawStr,
                NoteDirCategory.TrmrkInternals => nextIdxRetriever.NoteInternalsPfx.RawStr
            };
    }
}
