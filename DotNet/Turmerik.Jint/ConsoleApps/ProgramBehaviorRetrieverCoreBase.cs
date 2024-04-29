using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;
using Turmerik.Jint.Behavior;

namespace Turmerik.Jint.ConsoleApps
{
    public interface IProgramBehaviorRetrieverCore<TProgramConfig, TProgramConfigProfile> : IProgramConfigRetrieverCore<TProgramConfig, TProgramConfigProfile>
        where TProgramConfig : ProgramBehaviorCoreBase<TProgramConfigProfile>, new()
        where TProgramConfigProfile : ProgramBehaviorProfileCoreBase, new()
    {
    }

    public static class ProgramBehaviorRetrieverCore
    {
        public const string BEHAVIOR_FILE_NAME = "behavior.json";
        public const string PROGRAM_BEHAVIOR_DIR_NAME = "program-behavior";
    }

    public abstract class ProgramBehaviorRetrieverCoreBase<TProgramConfig, TProgramConfigProfile> : ProgramConfigRetrieverCoreBase<TProgramConfig, TProgramConfigProfile>, IProgramBehaviorRetrieverCore<TProgramConfig, TProgramConfigProfile>
        where TProgramConfig : ProgramBehaviorCoreBase<TProgramConfigProfile>, new()
        where TProgramConfigProfile : ProgramBehaviorProfileCoreBase, new()
    {
        private readonly ITrmrkJintAdapterFactory trmrkJintAdapterFactory;

        public ProgramBehaviorRetrieverCoreBase(
            IAppEnv appEnv,
            IJsonConversion jsonConversion,
            ITrmrkJintAdapterFactory trmrkJintAdapterFactory) : base(
                appEnv,
                jsonConversion)
        {
            this.trmrkJintAdapterFactory = trmrkJintAdapterFactory ?? throw new ArgumentNullException(
                nameof(trmrkJintAdapterFactory));
        }

        public override TProgramConfig LoadProgramConfig(
            string? configFilePath = null)
        {
            var programConfig = base.LoadProgramConfig();

            for (int i = 0; i < programConfig.Profiles.Count; i++)
            {
                var destnProfile = programConfig.Profiles[i];

                if (destnProfile.ProfileBehaviorRelFilePath != null)
                {
                    var jintAdapter = trmrkJintAdapterFactory.Create(new TrmrkJintAdapterOpts
                    {
                        JsScripts = File.ReadAllText(
                            destnProfile.ProfileBehaviorRelFilePath).Arr().RdnlC()
                    });

                    var srcProfile = jintAdapter.Evaluate<TProgramConfigProfile>(
                        destnProfile.ProfileBehaviorExportedMembersJsCode ?? TrmrkJintAdapter.EXPORTED_MEMBERS_RETRIEVER_JS_CODE);

                    MergeProfiles(destnProfile, srcProfile, configFilePath);
                }
            }

            return programConfig;
        }

        protected override string GetDefaultConfigDirPath() => AppEnv.GetTypePath(
            AppEnvDir, GetType(), ProgramBehaviorRetrieverCore.PROGRAM_BEHAVIOR_DIR_NAME);

        protected override string GetDefaultConfigFilePath() => Path.Combine(
            DefaultConfigDirPath, ProgramBehaviorRetrieverCore.BEHAVIOR_FILE_NAME);
    }
}
