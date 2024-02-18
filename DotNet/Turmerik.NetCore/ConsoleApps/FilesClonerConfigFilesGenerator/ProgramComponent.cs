using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.NetCore.ConsoleApps.FilesCloner;
using static Turmerik.NetCore.ConsoleApps.FilesCloner.ProgramConfig;
using static System.Environment;

namespace Turmerik.NetCore.ConsoleApps.FilesClonerConfigFilesGenerator
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);
    }

    public partial class ProgramComponent : IProgramComponent
    {
        private readonly IAppEnv appEnv;
        private readonly IJsonConversion jsonConversion;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly LocalDevicePathMacrosMapMtbl localDevicePathMacrosMap;

        public ProgramComponent(
            IAppEnv appEnv,
            IJsonConversion jsonConversion,
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever)
        {
            this.appEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            localDevicePathMacrosMap = localDevicePathMacrosRetriever.LoadFromConfigFile();

            localDevicePathMacrosMap.PathsMap.Add("|$P|", "Turmerik\\Apps");
            localDevicePathMacrosMap.PathsMap.Add("|$D|", "Turmerik\\Apps-DEV");
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var configJson = GenerateConfigJson(
                out var externalProfilesJson);

            string dirPath = GetPaths(
                rawArgs,
                out var envDirPath,
                out var profilesDirPath,
                out var envProfilesDirPath);

            RemoveDirsContent(
                dirPath,
                envDirPath,
                profilesDirPath,
                envProfilesDirPath);

            WriteConfigFiles(
                dirPath,
                envDirPath,
                configJson);

            WriteProfileFiles(
                dirPath,
                envDirPath,
                externalProfilesJson);
        }

        private string GetPaths(
            string[] rawArgs,
            out string envDirPath,
            out string profilesDirPath,
            out string envProfilesDirPath)
        {
            string dirPath = Path.Combine(
                "|$TURMERIK_REPO_DIR|",
                "DotNet",
                Assembly.GetEntryAssembly().GetName().Name,
                ProgramConfigRetriever.PROGRAM_CONFIG_DIR_NAME);

            dirPath = textMacrosReplacer.ReplaceMacros(new TextMacrosReplacerOpts
            {
                InputText = dirPath,
                MacrosMap = localDevicePathMacrosMap.GetPathsMap()
            });

            var appEnvDirBasePath = GetEnvDirBasePath(rawArgs);

            envDirPath = Path.Combine(
                appEnvDirBasePath,
                AppEnvDir.Config.ToString(),
                typeof(ProgramConfigRetriever).GetTypeFullDisplayName(),
                ProgramConfigRetriever.PROGRAM_CONFIG_DIR_NAME);

            profilesDirPath = Path.Combine(
                dirPath, ProgramConfigRetriever.PROFILES_DIR_NAME);

            envProfilesDirPath = Path.Combine(
                envDirPath, ProgramConfigRetriever.PROFILES_DIR_NAME);

            return dirPath;
        }

        private string GenerateConfigJson(
            out Dictionary<string, string> externalProfilesJson)
        {
            var config = GenerateConfigCore();

            var externalProfiles = config.Profiles.Where(
                profile => profile.ProfileRelFilePath != null).ToList();

            config.Profiles.RemoveWhere(
                profile => profile.ProfileRelFilePath != null);

            config.Profiles.AddRange(
                externalProfiles.Select(
                    profile => new Profile
                    {
                        ProfileRelFilePath = profile.ProfileRelFilePath,
                    }));

            string configJson = jsonConversion.Adapter.Serialize(config);

            externalProfilesJson = externalProfiles.ToDictionary(
                    profile => profile.ProfileRelFilePath,
                        profile => jsonConversion.Adapter.Serialize(profile));

            return configJson;
        }

        private string GetEnvDirBasePath(
            string[] rawArgs)
        {
            string appEnvDirBasePath;

            if (rawArgs.Any())
            {
                appEnvDirBasePath = rawArgs.First();
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.DarkCyan;
                Console.WriteLine("Using the following macros:");

                foreach (var kvp in localDevicePathMacrosMap.GetPathsMap())
                {
                    Console.ForegroundColor = ConsoleColor.Cyan;
                    Console.Write(kvp.Key);

                    Console.ForegroundColor = ConsoleColor.Magenta;
                    Console.Write(":");

                    Console.ForegroundColor = ConsoleColor.Cyan;
                    Console.Write(kvp.Value);

                    Console.ResetColor();
                    Console.WriteLine();
                }

                Console.WriteLine();

                Console.ForegroundColor = ConsoleColor.DarkCyan;
                Console.Write($"The default Turmerik Env Directory path is ");

                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.Write(appEnv.AppEnvDirBasePath);

                Console.ForegroundColor = ConsoleColor.DarkCyan;
                Console.WriteLine();
                Console.WriteLine($"Type or paste the path to the env directory, or leave empty to use the default one:");
                Console.ResetColor();

                appEnvDirBasePath = Console.ReadLine();
            }

            if (!string.IsNullOrWhiteSpace(appEnvDirBasePath))
            {
                appEnvDirBasePath = textMacrosReplacer.ReplaceMacros(new TextMacrosReplacerOpts
                {
                    InputText = appEnvDirBasePath,
                    MacrosMap = localDevicePathMacrosMap.GetPathsMap()
                });

                if (!Path.IsPathRooted(appEnvDirBasePath))
                {
                    appEnvDirBasePath = Path.Combine(
                        GetFolderPath(SpecialFolder.ApplicationData),
                        appEnvDirBasePath);
                }
            }
            else
            {
                appEnvDirBasePath = appEnv.AppEnvDirBasePath;
            }

            return appEnvDirBasePath;
        }

        private void RemoveDirsContent(
            string dirPath,
            string envDirPath,
            string profilesDirPath,
            string envProfilesDirPath)
        {
            Directory.CreateDirectory(dirPath);
            Directory.CreateDirectory(envDirPath);

            Directory.Delete(dirPath, true);
            Directory.Delete(envDirPath, true);

            Directory.CreateDirectory(dirPath);
            Directory.CreateDirectory(envDirPath);

            Directory.CreateDirectory(profilesDirPath);
            Directory.CreateDirectory(envProfilesDirPath);
        }

        private void WriteConfigFiles(
            string dirPath,
            string envDirPath,
            string configJson)
        {
            string configFilePath = Path.Combine(
                dirPath, ProgramConfigRetriever.CONFIG_FILE_NAME);

            string envConfigFilePath = Path.Combine(
                envDirPath, ProgramConfigRetriever.CONFIG_FILE_NAME);

            File.WriteAllText(configFilePath, configJson);
            File.WriteAllText(envConfigFilePath, configJson);
        }

        private void WriteProfileFiles(
            string dirPath,
            string envDirPath,
            Dictionary<string, string> externalProfilesJson)
        {
            foreach (var kvp in externalProfilesJson)
            {
                string profileFilePath = Path.Combine(
                    dirPath, kvp.Key);

                string envProfileFilePath = Path.Combine(
                    envDirPath, kvp.Key);

                File.WriteAllText(
                    profileFilePath,
                    kvp.Value);

                File.WriteAllText(
                    envProfileFilePath,
                    kvp.Value);
            }
        }

        private ProgramConfig GenerateConfigCore() => new ProgramConfig
        {
            Profiles = new List<Profile>
            {
                GenerateDotNetBkpBinsCfgProfile(),
                GenerateDotNetUtilBinsCfgProfile(),
                GenerateDotNetUtilEnvDirsCfgProfile(),
                GenerateBlazorAppCfgProfile(),
                GenerateTextTransformBehaviorCfgProfile()
            }
        };

        private Profile GenerateConfigProfile(
            string profileName,
            Profile profile)
        {
            profile.ProfileName ??= profileName;

            profile.ProfileRelFilePath ??= Path.Combine(
                ProgramConfigRetriever.PROFILES_DIR_NAME,
                $"{profile.ProfileName}.config.json");

            return profile;
        }
    }
}
