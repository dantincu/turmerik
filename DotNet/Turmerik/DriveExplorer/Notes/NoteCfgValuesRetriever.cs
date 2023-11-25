using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Helpers;
using Turmerik.Text;
using Turmerik.Utility;

namespace Turmerik.DriveExplorer.Notes
{
    public interface INoteCfgValuesRetriever
    {
        string GetNoteMdFileContents(
            string noteTitle,
            NoteDirsPairConfig.IFileContentsT cfg,
            string? trmrkUuidInputName = null);

        string GetKeepFileContents(
            NoteDirsPairConfig.IFileContentsT cfg);

        string GetNoteMdFileName(
            string noteFullDirNamePart,
            NoteDirsPairConfig.IFileNamesT cfg);

        string GetDirIdxStr(
            NoteDirsPairConfig.IDirNameIdxesT cfg,
            int idx);

        string GetMainNoteItemShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetMainNoteItemFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetMainInternalDirShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetMainInternalDirFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetAltNoteItemShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetAltNoteItemFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetAltInternalDirShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetAltInternalDirFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetShortDirNameRegexStr(string pfx);

        string GetFullDirNameRegexStr(
            string pfx, string joinStr);

        Regex GetMainNoteItemShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetMainNoteItemFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetMainInternalDirShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetMainInternalDirFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetAltNoteItemShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetAltNoteItemFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetAltInternalDirShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetAltInternalDirFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        NoteDirRegexTuple GetMainNoteItemShortDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg);

        NoteDirRegexTuple GetMainNoteItemFullDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg);

        NoteDirRegexTuple GetMainInternalDirShortDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg);

        NoteDirRegexTuple GetMainInternalDirFullDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg);

        NoteDirRegexTuple GetAltNoteItemShortDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg);

        NoteDirRegexTuple GetAltNoteItemFullDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg);

        NoteDirRegexTuple GetAltInternalDirShortDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg);

        NoteDirRegexTuple GetAltInternalDirFullDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg);

        ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> GetDirNamesRegexMap(
            NoteDirsPairConfig.IDirNamesT cfg);
    }

    public class NoteCfgValuesRetriever : INoteCfgValuesRetriever
    {
        public string GetNoteMdFileContents(
            string noteTitle,
            NoteDirsPairConfig.IFileContentsT cfg,
            string? trmrkUuidInputName = null) => string.Format(
                cfg.NoteFileContentsTemplate,
                noteTitle,
                Trmrk.TrmrkGuidStrNoDash,
                trmrkUuidInputName ?? TrmrkNotesH.TRMRK_GUID_INPUT_NAME);

        public string GetKeepFileContents(
            NoteDirsPairConfig.IFileContentsT cfg) => string.Format(
                cfg.KeepFileContentsTemplate,
                Trmrk.TrmrkGuidStrNoDash);

        public string GetNoteMdFileName(
            string noteFullDirNamePart,
            NoteDirsPairConfig.IFileNamesT cfg) => string.Concat(
                cfg.PrependTitleToNoteMdFileName?.If(
                    () => noteFullDirNamePart), cfg.NoteItemMdFileName);

        public string GetDirIdxStr(
            NoteDirsPairConfig.IDirNameIdxesT cfg,
            int idx) => idx.ToString(
                cfg.IdxFmt ?? "D1");

        public string GetMainNoteItemShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => GetShortDirNameRegexStr(
                cfg.GetNoteItemsPfxes().MainPfx);

        public string GetMainNoteItemFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => cfg.GetNoteItemsPfxes(
                ).With(pfxes => GetFullDirNameRegexStr(
                    pfxes.MainPfx, pfxes.JoinStr));

        public string GetMainInternalDirShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => GetShortDirNameRegexStr(
                cfg.GetNoteInternalsPfxes().MainPfx);

        public string GetMainInternalDirFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => cfg.GetNoteInternalsPfxes(
                ).With(pfxes => GetFullDirNameRegexStr(
                    pfxes.MainPfx, pfxes.JoinStr));

        public string GetAltNoteItemShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => GetShortDirNameRegexStr(
                cfg.GetNoteItemsPfxes().AltPfx);

        public string GetAltNoteItemFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => cfg.GetNoteItemsPfxes(
                ).With(pfxes => GetFullDirNameRegexStr(
                    pfxes.AltPfx, pfxes.JoinStr));

        public string GetAltInternalDirShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => GetShortDirNameRegexStr(
                cfg.GetNoteInternalsPfxes().AltPfx);

        public string GetAltInternalDirFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => cfg.GetNoteInternalsPfxes(
                ).With(pfxes => GetFullDirNameRegexStr(
                    pfxes.AltPfx, pfxes.JoinStr));

        public string GetShortDirNameRegexStr(
            string pfx) => string.Concat(
                "^",
                pfx.EncodeForRegex().EncodedStr,
                "\\d+$");

        public string GetFullDirNameRegexStr(
            string pfx,
            string joinStr) => string.Concat(
                "^",
                pfx.EncodeForRegex().EncodedStr,
                "\\d+",
                joinStr.EncodeForRegex().EncodedStr);

        public Regex GetMainNoteItemShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetMainNoteItemShortDirNameRegexStr(cfg));

        public Regex GetMainNoteItemFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetMainNoteItemFullDirNameRegexStr(cfg));

        public Regex GetMainInternalDirShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetMainInternalDirShortDirNameRegexStr(cfg));

        public Regex GetMainInternalDirFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetMainInternalDirFullDirNameRegexStr(cfg));

        public Regex GetAltNoteItemShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetAltNoteItemShortDirNameRegexStr(cfg));

        public Regex GetAltNoteItemFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetAltNoteItemFullDirNameRegexStr(cfg));

        public Regex GetAltInternalDirShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetAltInternalDirShortDirNameRegexStr(cfg));

        public Regex GetAltInternalDirFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetAltInternalDirFullDirNameRegexStr(cfg));

        public NoteDirRegexTuple GetMainNoteItemShortDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg) => GetMainNoteItemShortDirNameRegex(
                cfg).NoteDirTuple(cfg.GetNoteItemsPfxes().MainPfx);

        public NoteDirRegexTuple GetMainNoteItemFullDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg) => GetMainNoteItemFullDirNameRegex(
                cfg).NoteDirTuple(cfg.GetNoteItemsPfxes().MainPfx);

        public NoteDirRegexTuple GetMainInternalDirShortDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg) => GetMainInternalDirShortDirNameRegex(
                cfg).NoteDirTuple(cfg.GetNoteInternalsPfxes().MainPfx);

        public NoteDirRegexTuple GetMainInternalDirFullDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg) => GetMainInternalDirFullDirNameRegex(
                cfg).NoteDirTuple(cfg.GetNoteInternalsPfxes().MainPfx);

        public NoteDirRegexTuple GetAltNoteItemShortDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg) => GetAltNoteItemShortDirNameRegex(
                cfg).NoteDirTuple(cfg.GetNoteItemsPfxes().AltPfx);

        public NoteDirRegexTuple GetAltNoteItemFullDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg) => GetAltNoteItemFullDirNameRegex(
                cfg).NoteDirTuple(cfg.GetNoteItemsPfxes().AltPfx);

        public NoteDirRegexTuple GetAltInternalDirShortDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg) => GetAltInternalDirShortDirNameRegex(
                cfg).NoteDirTuple(cfg.GetNoteItemsPfxes().AltPfx);

        public NoteDirRegexTuple GetAltInternalDirFullDirNameRegexTuple(
            NoteDirsPairConfig.IDirNamesT cfg) => GetAltInternalDirFullDirNameRegex(
                cfg).NoteDirTuple(cfg.GetNoteItemsPfxes().AltPfx);

        public ReadOnlyDictionary<NoteDirTypeTuple, NoteDirRegexTuple> GetDirNamesRegexMap(
            NoteDirsPairConfig.IDirNamesT cfg) => new Dictionary<NoteDirTypeTuple, NoteDirRegexTuple>
            {
                {
                    new NoteDirTypeTuple(
                        NoteDirCategory.Item,
                        NoteDirType.ShortName,
                        NoteDirPfxType.Main),
                    GetMainNoteItemShortDirNameRegexTuple(cfg)
                },
                {
                    new NoteDirTypeTuple(
                        NoteDirCategory.Item,
                        NoteDirType.ShortName,
                        NoteDirPfxType.Alt),
                    GetAltNoteItemShortDirNameRegexTuple(cfg)
                },
                {
                    new NoteDirTypeTuple(
                        NoteDirCategory.Item,
                        NoteDirType.FullName,
                        NoteDirPfxType.Main),
                    GetMainNoteItemFullDirNameRegexTuple(cfg)
                },
                {
                    new NoteDirTypeTuple(
                        NoteDirCategory.Item,
                        NoteDirType.FullName,
                        NoteDirPfxType.Alt),
                    GetAltNoteItemFullDirNameRegexTuple(cfg)
                },
                {
                    new NoteDirTypeTuple(
                        NoteDirCategory.Internals,
                        NoteDirType.ShortName,
                        NoteDirPfxType.Main),
                    GetMainInternalDirShortDirNameRegexTuple(cfg)
                },
                {
                    new NoteDirTypeTuple(
                        NoteDirCategory.Internals,
                        NoteDirType.ShortName,
                        NoteDirPfxType.Alt),
                    GetAltInternalDirShortDirNameRegexTuple(cfg)
                },
                {
                    new NoteDirTypeTuple(
                        NoteDirCategory.Internals,
                        NoteDirType.FullName,
                        NoteDirPfxType.Main),
                    GetMainInternalDirFullDirNameRegexTuple(cfg)
                },
                {
                    new NoteDirTypeTuple(
                        NoteDirCategory.Internals,
                        NoteDirType.FullName,
                        NoteDirPfxType.Alt),
                    GetAltInternalDirFullDirNameRegexTuple(cfg)
                }
            }.RdnlD();
    }
}
