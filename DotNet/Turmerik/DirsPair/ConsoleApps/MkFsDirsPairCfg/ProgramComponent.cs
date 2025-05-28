using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.Text;
using Turmerik.Core.Utility;
using System.Collections.ObjectModel;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.TextSerialization;

namespace Turmerik.DirsPair.ConsoleApps.MkFsDirsPairCfg
{
    public interface IProgramComponent
    {
        void Run(string[] rawArgs);
        void Run(ProgramArgs pgArgs);
    }

    public class ProgramComponent : IProgramComponent
    {
        public static readonly string ConfigBaseFileName = DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME.Split('.')[0];

        private readonly ProgramConfig programConfig;
        private readonly IJsonConversion jsonConversion;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;

        public ProgramComponent(
            ProgramConfig programConfig,
            IJsonConversion jsonConversion,
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever)
        {
            this.programConfig = programConfig.ThrowIfNull(
                nameof(programConfig));

            this.jsonConversion = jsonConversion.ThrowIfNull(
                nameof(jsonConversion));

            this.textMacrosReplacer = textMacrosReplacer.ThrowIfNull(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever.ThrowIfNull(
                nameof(localDevicePathMacrosRetriever));
        }

        public void Run(string[] rawArgs)
        {
            var pgArgs = new ProgramArgs
            {
                LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile()
            };

            pgArgs.BasePath = pgArgs.LocalDevicePathsMap.TurmerikRepoDir.DirPath;

            pgArgs.BasePath = Path.Combine(
                pgArgs.BasePath,
                Trmrk.Repo.DotNet.DirName,
                Trmrk.TurmerikCorePfx);

            Run(pgArgs);
        }

        public void Run(ProgramArgs pgArgs)
        {
            var config = programConfig.Data;

            foreach (var chunkKvp in config.ChunksMap)
            {
                Run(pgArgs, chunkKvp.Key, chunkKvp.Value.Map);
            }
        }

        private void Run(
            ProgramArgs pgArgs,
            string chunkName,
            ReadOnlyDictionary<string, string> chunkMap)
        {
            Run(pgArgs, chunkName, chunkMap,
                "DirPairsMacrosMap",
                key => $"|{key}|",
                value => value);

            Run(pgArgs, chunkName, chunkMap,
                "MacrosMap",
                key => key,
                value => ":s:1".Arr(
                    value));
        }

        private void Run<TNewValue>(
            ProgramArgs pgArgs,
            string chunkName,
            ReadOnlyDictionary<string, string> chunkMap,
            string fileName,
            Func<string, string> newKeyFactory,
            Func<string, TNewValue> newValueFactory)
        {
            string configFileName = string.Join(".",
                ConfigBaseFileName,
                fileName,
                chunkName,
                "json");

            string configFilePath = Path.Combine(
                pgArgs.BasePath,
                configFileName);

            var newMap = chunkMap.ToDictionary(
                kvp => newKeyFactory(kvp.Key),
                kvp => newValueFactory(kvp.Value));

            string newMapJson = jsonConversion.Adapter.Serialize(newMap);
            File.WriteAllText(configFilePath, newMapJson);
        }
    }
}
