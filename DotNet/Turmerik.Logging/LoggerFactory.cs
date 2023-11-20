using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.Utility;

namespace Turmerik.Logging
{
    public interface ILoggerFactory
    {

    }

    public class LoggerFactory : ILoggerFactory
    {
        private readonly IAppInstanceStartInfoProvider appInstanceStartInfoProvider;
        private readonly IAppEnv appEnv;

        public LoggerFactory(
            IAppInstanceStartInfoProvider appInstanceStartInfoProvider,
            IAppEnv appEnv)
        {
            this.appInstanceStartInfoProvider = appInstanceStartInfoProvider ?? throw new ArgumentNullException(
                nameof(appInstanceStartInfoProvider));

            this.appEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));
        }
    }
}
