using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.Logging;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.LocalFileNotes.WinFormsApp
{
    public class TrmrkApplicationContextFactory
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IExceptionSerializer exceptionSerializer;
        private readonly IAppInstanceStartInfoProvider appInstanceStartInfoProvider;
        private readonly IAppEnv appEnv;
        private readonly IAppLoggerCreator appLoggerCreator;
        private readonly AppArgsParser appArgsParser;
        private readonly AppOptionsBuilder appOptionsBuilder;
        private readonly AppOptionsRetriever appOptionsRetriever;

        public TrmrkApplicationContextFactory(
            IJsonConversion jsonConversion,
            IExceptionSerializer exceptionSerializer,
            IAppInstanceStartInfoProvider appInstanceStartInfoProvider,
            IAppEnv appEnv,
            IAppLoggerCreator appLoggerCreator,
            AppArgsParser appArgsParser,
            AppOptionsBuilder appOptionsBuilder,
            AppOptionsRetriever appOptionsRetriever)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(nameof(jsonConversion));
            this.exceptionSerializer = exceptionSerializer ?? throw new ArgumentNullException(nameof(exceptionSerializer));
            this.appInstanceStartInfoProvider = appInstanceStartInfoProvider ?? throw new ArgumentNullException(nameof(appInstanceStartInfoProvider));
            this.appEnv = appEnv ?? throw new ArgumentNullException(nameof(appEnv));
            this.appLoggerCreator = appLoggerCreator ?? throw new ArgumentNullException(nameof(appLoggerCreator));
            this.appArgsParser = appArgsParser ?? throw new ArgumentNullException(nameof(appArgsParser));
            this.appOptionsBuilder = appOptionsBuilder ?? throw new ArgumentNullException(nameof(appOptionsBuilder));
            this.appOptionsRetriever = appOptionsRetriever ?? throw new ArgumentNullException(nameof(appOptionsRetriever));
        }

        public TrmrkApplicationContext Create(
            string[] args) => new TrmrkApplicationContext(
                jsonConversion,
                exceptionSerializer,
                appInstanceStartInfoProvider,
                appEnv,
                appLoggerCreator,
                appArgsParser,
                appOptionsBuilder,
                appOptionsRetriever,
                args);
    }
}
