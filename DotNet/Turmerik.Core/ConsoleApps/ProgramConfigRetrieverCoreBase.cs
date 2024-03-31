﻿using System;
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

        TProgramConfig LoadProgramConfig(
            string configFilePath = null);

        TProgramConfigProfile MergeProfiles(
            TProgramConfigProfile destnProfile,
            TProgramConfigProfile srcProfile);
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
        private readonly IAppEnv appEnv;
        private readonly IJsonConversion jsonConversion;

        public ProgramConfigRetrieverCoreBase(
            IAppEnv appEnv,
            IJsonConversion jsonConversion)
        {
            this.appEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));
        }

        public virtual AppEnvDir AppEnvDir => AppEnvDir.Config;

        public TProgramConfig LoadProgramConfig(
            string configFilePath = null)
        {
            configFilePath ??= appEnv.GetTypePath(
                AppEnvDir,
                GetType(),
                ProgramConfigRetrieverCore.PROGRAM_CONFIG_DIR_NAME,
                ProgramConfigRetrieverCore.CONFIG_FILE_NAME);

            string configDirPath = Path.GetDirectoryName(
                configFilePath)!;

            TProgramConfig programConfig = jsonConversion.Adapter.Deserialize<TProgramConfig>(
                File.ReadAllText(configFilePath));

            for (int i = 0; i < programConfig.Profiles.Count; i++)
            {
                var destnProfile = programConfig.Profiles[i];

                if (destnProfile.ProfileRelFilePath != null)
                {
                    string externalProfileFilePath = Path.Combine(
                        configDirPath, destnProfile.ProfileRelFilePath);

                    string json = File.ReadAllText(externalProfileFilePath);
                    var srcProfile = jsonConversion.Adapter.Deserialize<TProgramConfigProfile>(json);

                    MergeProfiles(destnProfile, srcProfile);
                }
            }

            return programConfig;
        }

        public TProgramConfigProfile MergeProfiles(
            TProgramConfigProfile destnProfile,
            TProgramConfigProfile srcProfile)
        {
            destnProfile.ProfileName = srcProfile.ProfileName ?? destnProfile.ProfileName;
            destnProfile = MergeProfilesCore(destnProfile, srcProfile);

            return destnProfile;
        }

        protected abstract TProgramConfigProfile MergeProfilesCore(
            TProgramConfigProfile destnProfile,
            TProgramConfigProfile srcProfile);
    }
}
