using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.Utility
{
    public interface IAppInstanceStartInfoProvider
    {
        IAppInstanceStartInfo Data { get; }
        public string ProcessDirName { get; }
    }

    public interface IAppInstanceStartInfo
    {
        Guid InstanceGuid { get; }
        DateTime InstanceTimeStamp { get; }
        long InstanceTicks { get; }

        string GetInstanceGuidStr();
        string GetInstanceGuidStrNoDashes();
    }

    public static class AppInstanceStartInfo
    {
        public static AppInstanceStartInfoImmtbl ToImmtbl(
            this IAppInstanceStartInfo src) => new AppInstanceStartInfoImmtbl(src);

        public static AppInstanceStartInfoImmtbl ToImmtbl(
            this AppInstanceStartInfoMtbl src) => new AppInstanceStartInfoImmtbl(src);

        public static AppInstanceStartInfoMtbl ToMtbl(
            this IAppInstanceStartInfo src) => new AppInstanceStartInfoMtbl(src);
    }

    public class AppInstanceStartInfoImmtbl : IAppInstanceStartInfo
    {
        public AppInstanceStartInfoImmtbl(
            IAppInstanceStartInfo src)
        {
            InstanceGuid = src.InstanceGuid;
            InstanceTimeStamp = src.InstanceTimeStamp;
            InstanceTicks = src.InstanceTimeStamp.Ticks;
        }

        public AppInstanceStartInfoImmtbl(
            AppInstanceStartInfoMtbl src) : this(
                (IAppInstanceStartInfo)src)
        {
            InstanceGuidStr = src.InstanceGuidStr;
            InstanceGuidStrNoDashes = src.InstanceGuidStrNoDashes;
        }

        public Guid InstanceGuid { get; }
        public DateTime InstanceTimeStamp { get; }
        public long InstanceTicks { get; }

        private string InstanceGuidStr { get; }
        private string InstanceGuidStrNoDashes { get; }

        public string GetInstanceGuidStr() => InstanceGuidStr;
        public string GetInstanceGuidStrNoDashes() => InstanceGuidStrNoDashes;
    }

    public class AppInstanceStartInfoMtbl : IAppInstanceStartInfo
    {
        public AppInstanceStartInfoMtbl()
        {
        }

        public AppInstanceStartInfoMtbl(
            IAppInstanceStartInfo src)
        {
            InstanceGuid = src.InstanceGuid;
            InstanceTimeStamp = src.InstanceTimeStamp;
            InstanceTicks = src.InstanceTimeStamp.Ticks;
        }

        public AppInstanceStartInfoMtbl(
            AppInstanceStartInfoMtbl src) : this(
                (IAppInstanceStartInfo)src)
        {
            InstanceGuidStr = src.InstanceGuidStr;
            InstanceGuidStrNoDashes = src.InstanceGuidStrNoDashes;
        }

        public Guid InstanceGuid { get; set; }
        public string InstanceGuidStr { get; set; }
        public string InstanceGuidStrNoDashes { get; set; }
        public DateTime InstanceTimeStamp { get; set; }
        public long InstanceTicks { get; set; }

        public string GetInstanceGuidStr() => InstanceGuidStr;
        public string GetInstanceGuidStrNoDashes() => InstanceGuidStrNoDashes;
    }

    public class AppInstanceStartInfoProvider : IAppInstanceStartInfoProvider
    {
        public AppInstanceStartInfoProvider(
            ITrmrkUniqueDirRetriever trmrkUniqueDirRetriever)
        {
            var timeStamp = DateTime.UtcNow;

            var uniqueDir = trmrkUniqueDirRetriever.GetTrmrkUniqueDir(
                new TrmrkUniqueDirOpts
                {
                    DirNameTicks = timeStamp.Ticks,
                });

            Data = new AppInstanceStartInfoImmtbl(
                new AppInstanceStartInfoMtbl
                {
                    InstanceGuid = uniqueDir.DirNameGuid,
                    InstanceTimeStamp = timeStamp,
                    InstanceTicks = timeStamp.Ticks,
                    InstanceGuidStr = uniqueDir.DirNameGuid.ToString("D"),
                    InstanceGuidStrNoDashes = uniqueDir.DirNameGuid.ToString("N")
                });

            ProcessDirName = uniqueDir.DirName;
        }

        public IAppInstanceStartInfo Data { get; }
        public string ProcessDirName { get; }
    }
}
