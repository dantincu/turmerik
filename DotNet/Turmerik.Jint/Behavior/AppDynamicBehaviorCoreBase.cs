using System;
using System.IO;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.Jint.Behavior
{
    public abstract class AppDynamicBehaviorCoreBase<TExportedMembersImmtbl, TExportedMembersSrlzbl> : AppDataCoreBase<AppBehaviorConfigImmtbl, AppBehaviorConfigMtbl>, IAppBehaviorCore<TExportedMembersImmtbl, TExportedMembersSrlzbl>
    {
        public AppDynamicBehaviorCoreBase(
            IJsonConversion jsonConversion,
            IAppEnv appEnv,
            AppBehaviorSetupAdapterFactory appBehaviorSetupAdapterFactory) : base(
                jsonConversion,
                appEnv)
        {
            AppBehaviorSetupAdapter = appBehaviorSetupAdapterFactory.Create<TExportedMembersImmtbl, TExportedMembersSrlzbl>(
                GetType(), AppEnvDir.Config);
        }

        public ITrmrkJintAdapter Behavior => BehaviorCore ?? LoadBehaviorCore();
        public TExportedMembersImmtbl ExportedMembers => ExportedMembersCore ?? LoadExportedMembersCore();

        protected ITrmrkJintAdapter BehaviorCore { get; set; }
        protected TExportedMembersImmtbl ExportedMembersCore { get; set; }

        protected AppBehaviorSetupAdapter<TExportedMembersImmtbl, TExportedMembersSrlzbl> AppBehaviorSetupAdapter { get; }

        public override AppBehaviorConfigImmtbl Update(RefAction<AppBehaviorConfigMtbl> updateAction)
        {
            var data = base.Update(updateAction);
            this.LoadDataObjCore(data);
            return data;
        }

        protected abstract TExportedMembersImmtbl NormalizeExportedMembers(
            TExportedMembersSrlzbl members);

        protected override AppBehaviorConfigMtbl GetDefaultConfigCore(
            ) => new AppBehaviorConfigMtbl();

        protected override AppBehaviorConfigImmtbl NormalizeConfig(
            AppBehaviorConfigMtbl config) => AppBehaviorSetupAdapter.NormalizeConfig(config);

        protected override AppBehaviorConfigMtbl SerializeConfig(
            AppBehaviorConfigImmtbl config) => new AppBehaviorConfigMtbl(config);

        protected override AppBehaviorConfigImmtbl LoadDataObjCore()
        {
            var retObj = base.LoadDataObjCore();
            this.LoadDataObjCore(retObj);
            return retObj;
        }

        protected override string GetDefaultJsonFilePath() => AppEnv.GetTypePath(
            AppEnvDir.Config,
            GetType(),
            JintH.BEHAVIOR_JSON_FILE_NAME);

        protected override string GetJsonFilePath(
            ) => Path.Combine(JsonDirPath,
                JintH.BEHAVIOR_JSON_FILE_NAME);

        protected ITrmrkJintAdapter LoadBehaviorCore()
        {
            _ = Data;
            return BehaviorCore;
        }

        protected TExportedMembersImmtbl LoadExportedMembersCore()
        {
            _ = Data;
            return ExportedMembers;
        }

        private void LoadDataObjCore(AppBehaviorConfigImmtbl retObj)
        {
            (var behavior, var exportedMembers) = AppBehaviorSetupAdapter.LoadDataObj(
                retObj, JsonDirPath);

            BehaviorCore = behavior;

            ExportedMembersCore = NormalizeExportedMembers(
                exportedMembers);
        }
    }
}
