using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Notes.Core;

namespace Turmerik.DirsPair
{
    public interface INoteDirsPairIdxRetriever
    {
        bool TryGetNoteDirsPairIdx(
           ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> dirNamesRegexMap,
           string dirName,
           INoteDirsPairConfig config,
           out NoteDirMatchTuple match);

        NoteDirMatchTuple GetNoteDirsPairIdx(
            KeyValuePair<NoteDirTypeTuple, NoteDirRegexTuple> dirNamesRegexKvp,
            string dirName,
            NoteDirsPairConfig.IDirNamesT config,
            string capturedStr);

        bool IsMatchCandidate(
            NoteDirTypeTuple dirTypeTuple,
            NoteDirsPairConfig.IDirNamesT config);

        NoteDirsPairConfig.IDirNamePfxesT GetDirNamePfxesCfg(
            NoteDirTypeTuple dirTypeTuple,
            NoteDirsPairConfig.IDirNamesT config);

        NoteDirsPairConfig.IDirNameIdxesT GetDirNameIdxesCfg(
            NoteDirTypeTuple dirTypeTuple,
            INoteDirsPairConfig config);

        string GetDirNamePfx(
            NoteDirsPairConfig.IDirNamePfxesT cfg);

        NoteInternalDir? GetNoteInternalDir(
            NoteDirsPairConfig.IDirNamesT dirNamesCfg,
            string fullDirNamePart);
    }

    public class NoteDirsPairIdxRetriever : INoteDirsPairIdxRetriever
    {
        public bool TryGetNoteDirsPairIdx(
            ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> dirNamesRegexMap,
            string dirName,
            INoteDirsPairConfig config,
            out NoteDirMatchTuple match)
        {
            bool foundMatch = false;
            match = default;
            var dirNamesCfg = config.GetDirNames();

            foreach (var kvp in dirNamesRegexMap)
            {
                if (IsMatchCandidate(
                    kvp.Key, dirNamesCfg))
                {
                    var regexMatch = kvp.Value.Regex.Match(dirName);

                    if (regexMatch?.Success ?? false)
                    {
                        var possibleMatch = GetNoteDirsPairIdx(
                            kvp, dirName, dirNamesCfg, regexMatch.Value);

                        var idxesCfg = GetDirNameIdxesCfg(
                            kvp.Key, config);

                        if (possibleMatch.NoteDirIdx >= 
                            (idxesCfg.MinIdx ?? NextNoteIdxRetriever.DF_MIN_VALUE) && possibleMatch.NoteDirIdx <= (
                            idxesCfg.MaxIdx ?? NextNoteIdxRetriever.DF_MAX_VALUE))
                        {
                            foundMatch = true;
                            match = possibleMatch;
                            break;
                        }
                    }
                }
            }

            return foundMatch;
        }

        public NoteDirMatchTuple GetNoteDirsPairIdx(
            KeyValuePair<NoteDirTypeTuple, NoteDirRegexTuple> dirNamesRegexKvp,
            string dirName,
            NoteDirsPairConfig.IDirNamesT dirNamesCfg,
            string capturedStr)
        {
            var dirTypeTuple = dirNamesRegexKvp.Key;
            var dirRegexTuple = dirNamesRegexKvp.Value;

            var config = GetDirNamePfxesCfg(
                dirTypeTuple, dirNamesCfg);

            string pfx = GetDirNamePfx(
                config) ?? string.Empty;

            string restOfCapturedStr = capturedStr.Substring(
                pfx.Length);

            string noteDirIdxStr = new string(
                restOfCapturedStr.TakeWhile(
                    c => char.IsDigit(c)).ToArray());

            int noteDirIdx = int.Parse(noteDirIdxStr);

            string shortDirName = pfx + noteDirIdxStr;
            string shortDirNamePart = null;
            string fullDirNamePart = null;
            NoteInternalDir? noteInternalDir = null;

            if (dirTypeTuple.DirType == NoteDirType.FullName)
            {
                shortDirNamePart = shortDirName + config.JoinStr;

                fullDirNamePart = dirName.Substring(
                    shortDirNamePart.Length);

                noteInternalDir = GetNoteInternalDir(
                    dirNamesCfg, fullDirNamePart);
            }

            return new NoteDirMatchTuple(
                dirName,
                shortDirName,
                shortDirNamePart,
                fullDirNamePart,
                noteDirIdx,
                dirTypeTuple,
                dirRegexTuple,
                noteInternalDir);
        }

        public bool IsMatchCandidate(
            NoteDirTypeTuple dirTypeTuple,
            NoteDirsPairConfig.IDirNamesT dirNamesCfg)
        {
            var config = GetDirNamePfxesCfg(
                dirTypeTuple, dirNamesCfg);

            bool? useAltPfx = config.UseAltPfx;
            bool isMatchCandidate;

            if (useAltPfx.HasValue)
            {
                isMatchCandidate = useAltPfx.Value == (
                    dirTypeTuple.DirPfxType == NoteDirPfxType.Alt);
            }
            else
            {
                isMatchCandidate = true;
            }

            return isMatchCandidate;
        }

        public NoteDirsPairConfig.IDirNamePfxesT GetDirNamePfxesCfg(
            NoteDirTypeTuple dirTypeTuple,
            NoteDirsPairConfig.IDirNamesT dirNamesCfg) => dirTypeTuple.DirCat switch
            {
                NoteDirCategory.Item => dirNamesCfg.GetNoteItemsPfxes(),
                NoteDirCategory.Section => dirNamesCfg.GetNoteSectionsPfxes(),
                NoteDirCategory.Internals => dirNamesCfg.GetNoteInternalsPfxes(),
                _ => throw new ArgumentException(nameof(dirTypeTuple.DirCat))
            };

        public NoteDirsPairConfig.IDirNameIdxesT GetDirNameIdxesCfg(
            NoteDirTypeTuple dirTypeTuple,
            INoteDirsPairConfig config) => dirTypeTuple.DirCat switch
            {
                NoteDirCategory.Item => config.GetNoteDirNameIdxes(),
                NoteDirCategory.Section => config.GetNoteSectionDirNameIdxes(),
                NoteDirCategory.Internals => config.GetNoteInternalDirNameIdxes(),
                _ => throw new ArgumentException(nameof(dirTypeTuple.DirCat))
            };

        public string GetDirNamePfx(
            NoteDirsPairConfig.IDirNamePfxesT cfg) => (cfg.UseAltPfx ?? false) switch
            {
                false => cfg.MainPfx,
                true => cfg.AltPfx,
            };

        public NoteInternalDir? GetNoteInternalDir(
            NoteDirsPairConfig.IDirNamesT dirNamesCfg,
            string fullDirNamePart)
        {
            NoteInternalDir? noteInternalDir = null;

            if (dirNamesCfg.NoteBook == fullDirNamePart)
            {
                noteInternalDir = NoteInternalDir.Root;
            }
            else if (dirNamesCfg.NoteInternals == fullDirNamePart)
            {
                noteInternalDir = NoteInternalDir.Internals;
            }
            else if (dirNamesCfg.NoteFiles == fullDirNamePart)
            {
                noteInternalDir = NoteInternalDir.Files;
            }

            return noteInternalDir;
        }
    }
}
