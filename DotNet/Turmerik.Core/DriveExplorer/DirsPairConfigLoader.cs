using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDirsPairConfigLoader
    {
        DirsPairConfig LoadConfig(
            string configFilePath = null);

        DirsPairConfig NormalizeConfig(
            DirsPairConfig config,
            string configFilePath);

        DirsPairConfig.DirNamesT NormalizeConfig(
            DirsPairConfig.DirNamesT config,
            string configFilePath);

        DirsPairConfig.MacrosT NormalizeConfig(
            DirsPairConfig.MacrosT config,
            string configFilePath);
    }

    public class DirsPairConfigLoader : IDirsPairConfigLoader
    {
        private readonly IJsonConversion jsonConversion;

        public DirsPairConfigLoader(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));
        }

        public DirsPairConfig LoadConfig(
            string configFilePath = null)
        {
            configFilePath ??= DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME;

            if (!Path.IsPathRooted(configFilePath))
            {
                configFilePath = Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    configFilePath);
            }

            var config = jsonConversion.Adapter.Deserialize<DirsPairConfig>(
                File.ReadAllText(configFilePath));

            config = NormalizeConfig(
                config,
                configFilePath);

            return config;
        }

        public DirsPairConfig NormalizeConfig(
            DirsPairConfig config,
            string configFilePath)
        {
            config.DirNames = NormalizeConfig(
                config.DirNames,
                configFilePath);

            config.Macros = NormalizeConfig(
                config.Macros,
                configFilePath);

            return config;
        }

        public DirsPairConfig.DirNamesT NormalizeConfig(
            DirsPairConfig.DirNamesT config,
            string configFilePath)
        {
            config.MacrosMapFilePathsArr = NormalizeConfigCore(
                configFilePath,
                config.MacrosMap ??= new(),
                config.MacrosMapFilePathsArr);

            return config;
        }

        public DirsPairConfig.MacrosT NormalizeConfig(
            DirsPairConfig.MacrosT config,
            string configFilePath)
        {
            config.MapFilePathsArr = NormalizeConfigCore(
                configFilePath,
                config.Map ??= new(),
                config.MapFilePathsArr);

            return config;
        }

        private string[]? NormalizeConfigCore<TMapValue>(
            string configFilePath,
            Dictionary<string, TMapValue> existingMap,
            string[]? mapFilePathsArr)
        {
            if (mapFilePathsArr != null)
            {
                mapFilePathsArr = mapFilePathsArr.Select(
                    mapFilePath =>
                    {
                        if (!Path.IsPathRooted(mapFilePath))
                        {
                            mapFilePath = Path.Combine(
                                Path.GetDirectoryName(
                                    configFilePath),
                                mapFilePath);
                        }

                        Dictionary<string, TMapValue> additionalMap;

                        try
                        {
                            additionalMap = jsonConversion.Adapter.Deserialize<Dictionary<string, TMapValue>>(
                                File.ReadAllText(mapFilePath));
                        }
                        catch
                        {
                            additionalMap = null;
                        }

                        if (additionalMap != null)
                        {
                            foreach (var kvp in additionalMap)
                            {
                                existingMap[kvp.Key] = kvp.Value;
                            }
                        }

                        return mapFilePath;
                    }).ToArray();
            }

            return mapFilePathsArr;
        }
    }
}
