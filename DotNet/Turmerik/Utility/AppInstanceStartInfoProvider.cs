using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Utility
{
    public interface IAppInstanceStartInfoProvider
    {
        AppInstanceStartInfo Data { get; }
    }

    public class AppInstanceStartInfo
    {
        public AppInstanceStartInfo(
            Guid instanceGuid,
            DateTime instanceTimeStamp)
        {
            InstanceGuid = instanceGuid;
            InstanceGuidStr = instanceGuid.ToString("D");
            InstanceGuidStrNoDashes = instanceGuid.ToString("N");
            InstanceTimeStamp = instanceTimeStamp;
            InstanceTicks = instanceTimeStamp.Ticks;
        }

        public Guid InstanceGuid { get; init; }
        public string InstanceGuidStr { get; }
        public string InstanceGuidStrNoDashes { get; }
        public DateTime InstanceTimeStamp { get; }
        public long InstanceTicks { get; }
    }

    public class AppInstanceStartInfoProvider : IAppInstanceStartInfoProvider
    {
        public AppInstanceStartInfoProvider()
        {
            Data = new AppInstanceStartInfo(
                Guid.NewGuid(),
                DateTime.UtcNow);
        }

        public AppInstanceStartInfo Data { get; }
    }
}
