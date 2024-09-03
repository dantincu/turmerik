using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Notes.Core
{
    public interface INotesAppConfig
    {
        string FsExplorerServiceReqRootPath { get; }
        string AppEnvLocatorFilePath { get; }
        bool IsDevEnv { get; }
        int RequiredClientVersion { get; }
        string ClientRedirectUrl { get; }
        INoteDirsPairConfig GetNoteDirPairs();

        IEnumerable<string> GetNestedConfigFilePaths();

        IEnumerable<NotesAppConfig.ITrmrkNotesStorageOption> GetStorageOptions();
        NotesAppConfig.ITrmrkNotesStorageOption GetSingleStorageOption();
    }

    public static class NotesAppConfigH
    {
        public static NotesAppConfigImmtbl ToImmtbl(
            this INotesAppConfig src) => new NotesAppConfigImmtbl(src);

        public static NotesAppConfigMtbl ToMtbl(
            this INotesAppConfig src) => new NotesAppConfigMtbl(src);

        public static NotesAppConfigImmtbl.TrmrkNotesStorageOptionImmtbl ToImmtbl(
            this NotesAppConfig.ITrmrkNotesStorageOption src) => new NotesAppConfigImmtbl.TrmrkNotesStorageOptionImmtbl(src);

        public static NotesAppConfigMtbl.TrmrkNotesStorageOptionMtbl ToMtbl(
            this NotesAppConfig.ITrmrkNotesStorageOption src) => new NotesAppConfigMtbl.TrmrkNotesStorageOptionMtbl(src);

        public static ReadOnlyCollection<NotesAppConfigImmtbl.TrmrkNotesStorageOptionImmtbl> ToImmtblRdnlC(
            this IEnumerable<NotesAppConfig.ITrmrkNotesStorageOption> src) => src.Select(
                item => item.ToImmtbl()).RdnlC();

        public static List<NotesAppConfigMtbl.TrmrkNotesStorageOptionMtbl> ToMtblList(
            this IEnumerable<NotesAppConfig.ITrmrkNotesStorageOption> src) => src.Select(
                item => item.ToMtbl()).ToList();
    }

    public static class NotesAppConfig
    {
        public interface ITrmrkNotesStorageOption
        {
            string Name { get; }
            string NoteBookPath { get; }
            TrmrkStorageOption? Storage { get; }
            bool? IsCloudStorage { get; }
            string TrmrkRestApiHost { get; }
            bool? IsApi { get; }
            bool? IsTrmrkRestApi { get; }
            bool? IsLocalFilesTrmrkRestApi { get; }
            bool? IsCloudStorageApi { get; }
            bool? IsCloudStorageTrmrkRestApi { get; }
        }
    }
}
