using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Core.ConsoleApps
{
    public interface IProgramConfigRetrieverCore<TProgramConfig, TProgramConfigProfile>
        where TProgramConfig : ProgramConfigCoreBase<TProgramConfigProfile>, new()
        where TProgramConfigProfile : ProgramConfigProfileCoreBase, new()
    {
        AppEnvDir AppEnvDir { get; }
        string DefaultConfigDirPath { get; }
        string DefaultConfigFilePath { get; }

        TProgramConfig LoadProgramConfig(
            string? configFilePath = null);

        TProgramConfigProfile MergeProfiles(
            TProgramConfigProfile destnProfile,
            TProgramConfigProfile srcProfile,
            string configFilePath = null);

        TProgramConfig NormalizeProgramConfig(
            TProgramConfig programConfig,
            string configFilePath = null);
    }

    public static class ProgramConfigRetrieverCore
    {
        public const string CONFIG_FILE_NAME = "config.json";
        public const string PROGRAM_CONFIG_DIR_NAME = "program-config";
        public const string PROFILES_DIR_NAME = "profiles";
    }

    public abstract class ProgramConfigRetrieverCoreBase<TProgramConfig, TProgramConfigProfile> : IProgramConfigRetrieverCore<TProgramConfig, TProgramConfigProfile>
        where TProgramConfig : ProgramConfigCoreBase<TProgramConfigProfile>, new()
        where TProgramConfigProfile : ProgramConfigProfileCoreBase, new()
    {
        protected readonly IAppEnv AppEnv;
        protected readonly IJsonConversion JsonConversion;

        public ProgramConfigRetrieverCoreBase(
            IAppEnv appEnv,
            IJsonConversion jsonConversion)
        {
            this.AppEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            this.JsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            DefaultConfigDirPath = GetDefaultConfigDirPath();
            DefaultConfigFilePath = GetDefaultConfigFilePath();
        }

        public virtual AppEnvDir AppEnvDir => AppEnvDir.Config;
        public string DefaultConfigDirPath { get; }
        public string DefaultConfigFilePath { get; }

        public virtual TProgramConfig LoadProgramConfig(
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

            TProgramConfig programConfig = JsonConversion.Adapter.Deserialize<TProgramConfig>(
                File.ReadAllText(configFilePath));

            for (int i = 0; i < programConfig.Profiles.Count; i++)
            {
                var destnProfile = programConfig.Profiles[i];

                if (destnProfile.ProfileRelFilePath != null)
                {
                    string externalProfileFilePath = Path.Combine(
                        configDirPath, destnProfile.ProfileRelFilePath);

                    string json = File.ReadAllText(externalProfileFilePath);
                    var srcProfile = JsonConversion.Adapter.Deserialize<TProgramConfigProfile>(json);

                    MergeProfiles(destnProfile, srcProfile, configFilePath);
                }
            }

            return programConfig;
        }

        public TProgramConfigProfile MergeProfiles(
            TProgramConfigProfile destnProfile,
            TProgramConfigProfile srcProfile,
            string? configFilePath = null)
        {
            destnProfile.ProfileName = srcProfile.ProfileName ?? destnProfile.ProfileName;
            destnProfile = MergeProfilesCore(destnProfile, srcProfile, configFilePath);

            return destnProfile;
        }

        public virtual TProgramConfig NormalizeProgramConfig(
            TProgramConfig programConfig,
            string configFilePath = null) => programConfig;

        protected abstract TProgramConfigProfile MergeProfilesCore(
            TProgramConfigProfile destnProfile,
            TProgramConfigProfile srcProfile,
            string configFilePath);

        protected virtual string GetDefaultConfigDirPath() => AppEnv.GetTypePath(
            AppEnvDir, GetType(), ProgramConfigRetrieverCore.PROGRAM_CONFIG_DIR_NAME);

        protected virtual string GetDefaultConfigFilePath() => Path.Combine(
            DefaultConfigDirPath, ProgramConfigRetrieverCore.CONFIG_FILE_NAME);
    }
}
