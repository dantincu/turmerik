using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Reflection;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.NetCore.LocalDeviceEnv
{
    public interface INetCoreAppEnvFactoryCore
    {
        NetCoreAppEnv GetAppEnv(IConfiguration configuration);
    }

    public class NetCoreAppEnvFactoryCore : INetCoreAppEnvFactoryCore
    {
        private readonly IJsonConversion jsonConversion;
        private readonly ITimeStampHelper timeStampHelper;

        public NetCoreAppEnvFactoryCore(
            IJsonConversion jsonConversion,
            ITimeStampHelper timeStampHelper)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(
                nameof(timeStampHelper));
        }

        public virtual NetCoreAppEnv GetAppEnv(
            IConfiguration configuration) => new NetCoreAppEnv(
                jsonConversion,
                timeStampHelper,
                configuration);
    }
}
