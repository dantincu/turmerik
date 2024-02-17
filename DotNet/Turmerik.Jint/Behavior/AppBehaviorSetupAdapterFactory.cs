using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;

namespace Turmerik.Jint.Behavior
{
    public class AppBehaviorSetupAdapterFactory
    {
        private readonly IAppEnv appEnv;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ITrmrkJintAdapterFactory trmrkJintAdapterFactory;

        public AppBehaviorSetupAdapterFactory(
            IAppEnv appEnv,
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            ITrmrkJintAdapterFactory trmrkJintAdapterFactory)
        {
            this.appEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.trmrkJintAdapterFactory = trmrkJintAdapterFactory ?? throw new ArgumentNullException(
                nameof(trmrkJintAdapterFactory));
        }

        public AppBehaviorSetupAdapter<TExportedMembersImmtbl, TExportedMembersSrlzbl> Create<TExportedMembersImmtbl, TExportedMembersSrlzbl>(
            Type behaviorDataType,
            AppEnvDir appEnvDir) => new AppBehaviorSetupAdapter<TExportedMembersImmtbl, TExportedMembersSrlzbl>(
                appEnv, textMacrosReplacer, localDevicePathMacrosRetriever, trmrkJintAdapterFactory,
                appEnvDir, behaviorDataType);
    }
}
