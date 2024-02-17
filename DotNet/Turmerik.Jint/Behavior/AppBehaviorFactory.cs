using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Jint.Behavior
{
    public interface IAppBehaviorFactory
    {
        TBehavior Behavior<TBehavior, TExportedMembersImmtbl, TExportedMembersSrlzbl>()
            where TBehavior : AppBehaviorCoreBase<TExportedMembersImmtbl, TExportedMembersSrlzbl>;

        TBehavior DynamicBehavior<TBehavior, TExportedMembersImmtbl, TExportedMembersSrlzbl>()
            where TBehavior : AppDynamicBehaviorCoreBase<TExportedMembersImmtbl, TExportedMembersSrlzbl>;
    }

    public class AppBehaviorFactory : IAppBehaviorFactory
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IAppEnv appEnv;
        private readonly AppBehaviorSetupAdapterFactory appBehaviorSetupAdapterFactory;

        public AppBehaviorFactory(
            IJsonConversion jsonConversion,
            IAppEnv appEnv,
            AppBehaviorSetupAdapterFactory appBehaviorSetupAdapterFactory)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.appEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            this.appBehaviorSetupAdapterFactory = appBehaviorSetupAdapterFactory ?? throw new ArgumentNullException(
                nameof(appBehaviorSetupAdapterFactory));
        }

        public TBehavior Behavior<TBehavior, TExportedMembersImmtbl, TExportedMembersSrlzbl>()
            where TBehavior : AppBehaviorCoreBase<TExportedMembersImmtbl, TExportedMembersSrlzbl> => jsonConversion.CreateFromSrc<TBehavior>(
                null, appEnv, appBehaviorSetupAdapterFactory);

        public TBehavior DynamicBehavior<TBehavior, TExportedMembersImmtbl, TExportedMembersSrlzbl>()
            where TBehavior : AppDynamicBehaviorCoreBase<TExportedMembersImmtbl, TExportedMembersSrlzbl> => jsonConversion.CreateFromSrc<TBehavior>(
                null, appEnv, appBehaviorSetupAdapterFactory);
    }
}
