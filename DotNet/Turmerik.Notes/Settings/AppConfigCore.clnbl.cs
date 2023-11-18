using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Notes.Settings
{
    public interface IAppConfigCore
    {
        bool IsDevEnv { get; }
        int RequiredClientVersion { get; }
        string ClientRedirectUrl { get; }
        INoteDirsPairConfig GetNoteDirPairs();
    }

    public static class AppConfigCore
    {
        public static AppConfigCoreImmtbl ToImmtbl(
            this IAppConfigCore src) => new AppConfigCoreImmtbl(src);

        public static AppConfigCoreMtbl ToMtbl(
            this IAppConfigCore src) => new AppConfigCoreMtbl(src);
    }

    public class AppConfigCoreMtbl : IAppConfigCore
    {
        public AppConfigCoreMtbl()
        {
        }

        public AppConfigCoreMtbl(
            IAppConfigCore src)
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

    public class AppConfigCoreImmtbl : IAppConfigCore
    {
        public AppConfigCoreImmtbl(
            IAppConfigCore src)
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
