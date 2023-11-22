using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Utility;
using Turmerik.Helpers;
using Turmerik.TextSerialization;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public interface IAppArgs
    {
        IEnumerable<string> GetRawArgs();
    }

    public interface IAppOptions
    {
        bool LastRunCrashed { get; }

        ILastRunCrashedInfo GetLastRunCrashInfo();
        IAppArgs GetArgs();
    }

    public interface ILastRunCrashedInfo
    {
        DateTime CrashMoment { get; }
        SerializedException UnhandledException { get; }

        IAppInstanceStartInfo GetAppInstanceStartInfo();
    }

    public static class AppArgs
    {
        public static AppArgsImmtbl ToImmtbl(
            this IAppArgs src) => new AppArgsImmtbl(src);

        public static AppOptionsImmtbl ToImmtbl(
            this IAppOptions src) => new AppOptionsImmtbl(src);

        public static LastRunCrashedInfoImmtbl ToImmtbl(
            this ILastRunCrashedInfo src) => new LastRunCrashedInfoImmtbl(src);

        public static LastRunCrashedInfoMtbl ToMtbl(
            this ILastRunCrashedInfo src) => new LastRunCrashedInfoMtbl(src);

        public static AppArgsMtbl ToMtbl(
            this IAppArgs src) => new AppArgsMtbl(src);

        public static AppOptionsMtbl ToMtbl(
            this IAppOptions src) => new AppOptionsMtbl(src);
    }

    public class AppArgsImmtbl : IAppArgs
    {
        public AppArgsImmtbl(IAppArgs src)
        {
            RawArgs = src.GetRawArgs()?.RdnlC();
        }

        public ReadOnlyCollection<string> RawArgs { get; }

        public IEnumerable<string> GetRawArgs() => RawArgs;
    }

    public class AppArgsMtbl : IAppArgs
    {
        public AppArgsMtbl()
        {
        }

        public AppArgsMtbl(IAppArgs src)
        {
            RawArgs = src.GetRawArgs()?.ToArray();
        }

        public string[] RawArgs { get; set; }

        public IEnumerable<string> GetRawArgs() => RawArgs;
    }

    public class AppOptionsImmtbl : IAppOptions
    {
        public AppOptionsImmtbl(IAppOptions src)
        {
            LastRunCrashed = src.LastRunCrashed;
            LastRunCrashedInfo = src.GetLastRunCrashInfo()?.ToImmtbl();
            Args = src.GetArgs()?.ToImmtbl();
        }

        public bool LastRunCrashed { get; }
        public LastRunCrashedInfoImmtbl LastRunCrashedInfo { get; }
        public AppArgsImmtbl Args { get; }

        public ILastRunCrashedInfo GetLastRunCrashInfo() => LastRunCrashedInfo;
        public IAppArgs GetArgs() => Args;
    }

    public class AppOptionsMtbl : IAppOptions
    {
        public AppOptionsMtbl()
        {
        }

        public AppOptionsMtbl(IAppOptions src)
        {
            LastRunCrashed = src.LastRunCrashed;
            LastRunCrashInfo = src.GetLastRunCrashInfo()?.ToMtbl();
            Args = src.GetArgs()?.ToMtbl();
        }

        public bool LastRunCrashed { get; set; }
        public LastRunCrashedInfoMtbl LastRunCrashInfo { get; set; }
        public AppArgsMtbl Args { get; set; }

        public ILastRunCrashedInfo GetLastRunCrashInfo() => LastRunCrashInfo;
        public IAppArgs GetArgs() => Args;
    }

    public class AppWorkArgs
    {
        public AppOptionsImmtbl Opts { get; set; }
    }

    public class LastRunCrashedInfoImmtbl : ILastRunCrashedInfo
    {
        public LastRunCrashedInfoImmtbl(
            ILastRunCrashedInfo src)
        {
            CrashMoment = src.CrashMoment;
            UnhandledException = src.UnhandledException;
            AppInstanceStartInfo = src.GetAppInstanceStartInfo()?.ToImmtbl();
        }

        public DateTime CrashMoment { get; }
        public SerializedException UnhandledException { get; }
        public AppInstanceStartInfoImmtbl AppInstanceStartInfo { get; }

        public IAppInstanceStartInfo GetAppInstanceStartInfo() => AppInstanceStartInfo;
    }

    public class LastRunCrashedInfoMtbl : ILastRunCrashedInfo
    {
        public LastRunCrashedInfoMtbl()
        {
        }

        public LastRunCrashedInfoMtbl(
            ILastRunCrashedInfo src)
        {
            CrashMoment = src.CrashMoment;
            UnhandledException = src.UnhandledException;
            AppInstanceStartInfo = src.GetAppInstanceStartInfo()?.ToMtbl();
        }

        public DateTime CrashMoment { get; set; }
        public SerializedException UnhandledException { get; set; }
        public AppInstanceStartInfoMtbl AppInstanceStartInfo { get; set; }

        public IAppInstanceStartInfo GetAppInstanceStartInfo() => AppInstanceStartInfo;
    }
}
