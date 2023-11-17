using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Helpers;
using Turmerik.Notes;
using Turmerik.Notes.Md;
using Turmerik.Text;
using Turmerik.Utility;

namespace Turmerik.Notes
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

        string GetNoteItemShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetNoteItemFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetInternalDirShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetInternalDirFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg);

        string GetShortDirNameRegexStr(string pfx);

        string GetFullDirNameRegexStr(
            string pfx, string joinStr);

        Regex GetNoteItemShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetNoteItemFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetInternalDirShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        Regex GetInternalDirFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg);

        ReadOnlyDictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>> GetDirNamesRegexMap(
            NoteDirsPairConfig.IDirNamesT cfg);

        Dictionary<NoteDirType, Regex> GetDirNamesRegexMap(
            NoteDirsPairConfig.IDirNamesT cfg,
            Func<NoteDirsPairConfig.IDirNamesT, Regex> shortNameFactory,
            Func<NoteDirsPairConfig.IDirNamesT, Regex> fullNameFactory);
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

        public string GetNoteItemShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => GetShortDirNameRegexStr(
                cfg.NoteItemsPfx);

        public string GetNoteItemFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => GetFullDirNameRegexStr(
                cfg.NoteItemsPfx,
                cfg.JoinStr);

        public string GetInternalDirShortDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => GetShortDirNameRegexStr(
                cfg.NoteInternalsPfx);

        public string GetInternalDirFullDirNameRegexStr(
            NoteDirsPairConfig.IDirNamesT cfg) => GetFullDirNameRegexStr(
                cfg.NoteInternalsPfx,
                cfg.JoinStr);

        public string GetShortDirNameRegexStr(
            string pfx) => string.Concat(
                "^",
                RegexH.EncodeForRegex(pfx),
                "\\d+$");

        public string GetFullDirNameRegexStr(
            string pfx,
            string joinStr) => string.Concat(
                "^",
                RegexH.EncodeForRegex(pfx),
                "\\d+",
                RegexH.EncodeForRegex(joinStr));

        public Regex GetNoteItemShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetNoteItemShortDirNameRegexStr(cfg));

        public Regex GetNoteItemFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetNoteItemFullDirNameRegexStr(cfg));

        public Regex GetInternalDirShortDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetInternalDirShortDirNameRegexStr(cfg));

        public Regex GetInternalDirFullDirNameRegex(
            NoteDirsPairConfig.IDirNamesT cfg) => new Regex(
                GetInternalDirFullDirNameRegexStr(cfg));

        public ReadOnlyDictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>> GetDirNamesRegexMap(
            NoteDirsPairConfig.IDirNamesT cfg) => new Dictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>>
            {
                {
                    NoteDirCategory.Internals,
                    GetDirNamesRegexMap(cfg,
                        GetInternalDirShortDirNameRegex,
                        GetInternalDirFullDirNameRegex).RdnlD()
                },
                {
                    NoteDirCategory.Item,
                    GetDirNamesRegexMap(cfg,
                        GetNoteItemShortDirNameRegex,
                        GetNoteItemFullDirNameRegex).RdnlD()
                }
            }.RdnlD();

        public Dictionary<NoteDirType, Regex> GetDirNamesRegexMap(
            NoteDirsPairConfig.IDirNamesT cfg,
            Func<NoteDirsPairConfig.IDirNamesT, Regex> shortNameFactory,
            Func<NoteDirsPairConfig.IDirNamesT, Regex> fullNameFactory) => new Dictionary<NoteDirType, Regex>
                {
                    {
                        NoteDirType.ShortName,
                        shortNameFactory(cfg)
                    },
                    {
                        NoteDirType.FullName,
                        fullNameFactory(cfg)
                    }
                };
    }
}
