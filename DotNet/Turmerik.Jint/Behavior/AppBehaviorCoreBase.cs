using System;
using System.IO;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Jint.Behavior
{
    public abstract class AppBehaviorCoreBase<TExportedMembersImmtbl, TExportedMembersSrlzbl> : AppConfigCoreBase<AppBehaviorConfigImmtbl, AppBehaviorConfigMtbl>, IAppBehaviorCore<TExportedMembersImmtbl, TExportedMembersSrlzbl>
    {
        public AppBehaviorCoreBase(
            IJsonConversion jsonConversion,
            IAppEnv appEnv,
            AppBehaviorSetupAdapterFactory appBehaviorSetupAdapterFactory) : base(
                jsonConversion,
                appEnv)
        {
            AppBehaviorSetupAdapter = appBehaviorSetupAdapterFactory.Create<TExportedMembersImmtbl, TExportedMembersSrlzbl>(
                GetType(), AppEnvDir.Config);
        }

        public ITrmrkJintAdapter Behavior { get; protected set; }
        public TExportedMembersImmtbl ExportedMembers { get; protected set; }

        protected AppBehaviorSetupAdapter<TExportedMembersImmtbl, TExportedMembersSrlzbl> AppBehaviorSetupAdapter { get; }

        protected abstract TExportedMembersImmtbl NormalizeExportedMembers(
            TExportedMembersSrlzbl members);

        protected override AppBehaviorConfigMtbl GetDefaultConfig(
            ) => new AppBehaviorConfigMtbl();

        protected override AppBehaviorConfigImmtbl NormalizeConfig(
            AppBehaviorConfigMtbl config) => AppBehaviorSetupAdapter.NormalizeConfig(config);

        protected override AppBehaviorConfigImmtbl LoadDataObjCore()
        {
            var retObj = base.LoadDataObjCore();

            (var behavior, var exportedMembers) = AppBehaviorSetupAdapter.LoadDataObj(
                retObj, JsonDirPath);

            Behavior = behavior;

            ExportedMembers = NormalizeExportedMembers(
                exportedMembers);

            return retObj;
        }

        protected override string GetJsonFilePath(
            ) => Path.Combine(JsonDirPath,
                JintH.BEHAVIOR_JSON_FILE_NAME);
    }
}
