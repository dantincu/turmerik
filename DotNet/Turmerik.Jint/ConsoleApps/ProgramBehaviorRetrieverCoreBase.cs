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
        ProgramConfigWrapper<TProgramConfig> LoadProgramConfigWrapper(
            string? configFilePath = null);
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

        public virtual ProgramConfigWrapper<TProgramConfig> LoadProgramConfigWrapper(
            string? configFilePath = null)
        {
            if (configFilePath == null)
            {
                configFilePath = DefaultConfigFilePath;
            }
            else
            {
                if (!Path.IsPathRooted(configFilePath))
                {
                    configFilePath = Path.Combine(
                        DefaultConfigDirPath,
                        configFilePath);
                }
            }

            string configDirPath = Path.GetDirectoryName(
                configFilePath)!;

            var retWrapper = this.LoadProgramConfigWrapper(
                configFilePath,
                configDirPath);

            return retWrapper;
        }

        protected override string GetDefaultConfigDirPath() => AppEnv.GetTypePath(
            AppEnvDir, GetType(), ProgramBehaviorRetrieverCore.PROGRAM_BEHAVIOR_DIR_NAME);

        protected override string GetDefaultConfigFilePath() => Path.Combine(
            DefaultConfigDirPath, ProgramBehaviorRetrieverCore.BEHAVIOR_FILE_NAME);

        protected virtual ProgramConfigWrapper<TProgramConfig> LoadProgramConfigWrapper(
            string configFilePath,
            string configDirPath)
        {
            var programConfig = base.LoadProgramConfig(
                configFilePath,
                configDirPath);

            var jintAdaptersMap = new Dictionary<string, ITrmrkJintAdapter>();

            for (int i = 0; i < programConfig.Profiles.Count; i++)
            {
                var destnProfile = programConfig.Profiles[i];

                if (destnProfile.ProfileBehaviorRelFilePath != null)
                {
                    string externalProfileFilePath = Path.Combine(
                        configDirPath, destnProfile.ProfileBehaviorRelFilePath);

                    var jintAdapter = trmrkJintAdapterFactory.Create(new TrmrkJintAdapterOpts
                    {
                        JsScripts = File.ReadAllText(
                            externalProfileFilePath).Arr().RdnlC()
                    });

                    var srcProfile = jintAdapter.Evaluate<TProgramConfigProfile>(
                        destnProfile.ProfileBehaviorExportedMembersJsCode ?? TrmrkJintAdapter.EXPORTED_MEMBERS_RETRIEVER_JS_CODE);

                    MergeProfiles(destnProfile, srcProfile, configFilePath);

                    jintAdaptersMap.Add(
                        destnProfile.ProfileName,
                        jintAdapter);
                }
            }

            var retWrapper = new ProgramConfigWrapper<TProgramConfig>(
                programConfig, new(jintAdaptersMap));

            return retWrapper;
        }

        protected override TProgramConfig LoadProgramConfig(
            string configFilePath,
            string configDirPath)
        {
            var programConfig = base.LoadProgramConfig(
                configFilePath,
                configDirPath);

            for (int i = 0; i < programConfig.Profiles.Count; i++)
            {
                var destnProfile = programConfig.Profiles[i];

                if (destnProfile.ProfileBehaviorRelFilePath != null)
                {
                    string externalProfileFilePath = Path.Combine(
                        configDirPath, destnProfile.ProfileBehaviorRelFilePath);

                    var jintAdapter = trmrkJintAdapterFactory.Create(new TrmrkJintAdapterOpts
                    {
                        JsScripts = File.ReadAllText(
                            externalProfileFilePath).Arr().RdnlC()
                    });

                    var srcProfile = jintAdapter.Evaluate<TProgramConfigProfile>(
                        destnProfile.ProfileBehaviorExportedMembersJsCode ?? TrmrkJintAdapter.EXPORTED_MEMBERS_RETRIEVER_JS_CODE);

                    MergeProfiles(destnProfile, srcProfile, configFilePath);
                }
            }

            return programConfig;
        }
    }
}
