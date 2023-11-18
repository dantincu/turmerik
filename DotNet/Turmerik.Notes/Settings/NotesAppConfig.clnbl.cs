using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes.Settings
{
    public interface INotesAppConfig
    {
        bool IsDevEnv { get; }
        int RequiredClientVersion { get; }
        string ClientRedirectUrl { get; }
        INoteDirsPairConfig GetNoteDirPairs();
    }

    public static class NotesAppConfigH
    {
        public static NotesAppConfigImmtbl ToImmtbl(
            this INotesAppConfig src) => new NotesAppConfigImmtbl(src);

        public static NotesAppConfigMtbl ToMtbl(
            this INotesAppConfig src) => new NotesAppConfigMtbl(src);
    }

    public class NotesAppConfigMtbl : INotesAppConfig
    {
        public NotesAppConfigMtbl()
        {
        }

        public NotesAppConfigMtbl(
            INotesAppConfig src)
        {
            IsDevEnv = src.IsDevEnv;
            RequiredClientVersion = src.RequiredClientVersion;
            ClientRedirectUrl = src.ClientRedirectUrl;
            NoteDirPairs = src.GetNoteDirPairs()?.ToMtbl();
        }

        public bool IsDevEnv { get; set; }
        public int RequiredClientVersion { get; set; }
        public string ClientRedirectUrl { get; set; }
        public NoteDirsPairConfigMtbl NoteDirPairs { get; set; }

        public INoteDirsPairConfig GetNoteDirPairs() => NoteDirPairs;
    }

    public class NotesAppConfigImmtbl : INotesAppConfig
    {
        public NotesAppConfigImmtbl(
            INotesAppConfig src)
        {
            IsDevEnv = src.IsDevEnv;
            RequiredClientVersion = src.RequiredClientVersion;
            ClientRedirectUrl = src.ClientRedirectUrl;
            NoteDirPairs = src.GetNoteDirPairs()?.ToImmtbl();
        }

        public bool IsDevEnv { get; }
        public int RequiredClientVersion { get; }
        public string ClientRedirectUrl { get; }
        public NoteDirsPairConfigImmtbl NoteDirPairs { get; }

        public INoteDirsPairConfig GetNoteDirPairs() => NoteDirPairs;
    }
}
