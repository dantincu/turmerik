using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.Core.LocalDeviceEnv
{
    public interface ILocalDevicePathMacrosRetriever
    {
        ReadOnlyDictionary<string, string> DefaultPathsMap { get; }

        string PropNameToMacro(
            string propName,
            string template = null);

        LocalDevicePathMacrosMapMtbl LoadFromConfigFile(
            string configFilePath = null,
            bool normalize = true,
            IAppEnv appEnv = null);

        LocalDevicePathMacrosMapMtbl Normalize(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            IAppEnv appEnv = null);
    }

    public class LocalDevicePathMacrosRetriever : ILocalDevicePathMacrosRetriever
    {
        public const string MACRO_TEMPLATE = "|${0}|";

        private static ReadOnlyCollection<PropertyInfo> pubPropInfos;
        private static ReadOnlyDictionary<string, string> propNamesMap;

        private readonly IJsonConversion jsonConversion;

        static LocalDevicePathMacrosRetriever()
        {
            pubPropInfos = typeof(LocalDevicePathMacrosMapMtbl).GetProperties().RdnlC();

            propNamesMap = pubPropInfos.ToDictionary(
                propInfo => propInfo.Name,
                propInfo => ConvertPropNameToMacro(
                    propInfo.Name)).RdnlD();
        }

        public LocalDevicePathMacrosRetriever(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));
        }

        public ReadOnlyDictionary<string, string> DefaultPathsMap { get; } = new Dictionary<string, string>
        {
            { "|$USER_PROFILE_DIR|", Environment.GetFolderPath(
                Environment.SpecialFolder.UserProfile) }
        }.RdnlD();

        public static string ConvertPropNameToMacro(
            string propName,
            string template = null) => string.Format(
                template ?? MACRO_TEMPLATE, StringH.CamelToKebabCase(
                    propName, true));

        public string PropNameToMacro(
            string propName,
            string template = null) => ConvertPropNameToMacro(
                propName, template);

        public LocalDevicePathMacrosMapMtbl LoadFromConfigFile(
            string configFilePath = null,
            bool normalize = true,
            IAppEnv appEnv = null)
        {
            if (configFilePath == null && ProgramH.FilePathExists(
                LocalDevicePathMacrosMapH.CONFIG_FILE_NAME,
                out string filePath))
            {
                configFilePath = filePath;
            }

            var localDevicePathsMap = jsonConversion.Adapter.Deserialize<LocalDevicePathMacrosMapMtbl>(
                File.ReadAllText(configFilePath ?? throw new InvalidOperationException(
                    $"No config file containing local device path macros was found")));

            if (normalize)
            {
                localDevicePathsMap = Normalize(
                    localDevicePathsMap, appEnv);
            }

            return localDevicePathsMap;
        }

        public LocalDevicePathMacrosMapMtbl Normalize(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap,
            IAppEnv appEnv = null)
        {
            foreach (var kvp in DefaultPathsMap)
            {
                localDevicePathsMap.PathsMap.GetOrAdd(
                    kvp.Key, key => kvp.Value);
            }

            if (appEnv != null)
            {
                localDevicePathsMap.TurmerikDotnetUtilityAppsEnvDir ??= new LocalDevicePathsMap.FolderMtbl
                {
                    DirPath = appEnv.AppEnvDirBasePath,
                };
            }

            foreach (var propInfo in pubPropInfos)
            {
                string propName = propInfo.Name;
                string varName = propNamesMap[propName];

                if (localDevicePathsMap.PathsMap.TryGetValue(
                    varName, out var dirPath))
                {
                    propInfo.SetValue(localDevicePathsMap, new LocalDevicePathsMap.FolderMtbl
                    {
                        DirPath = dirPath,
                        VarName = varName
                    });
                }
                else
                {
                    var value = propInfo.GetValue(localDevicePathsMap) as LocalDevicePathsMap.FolderMtbl;

                    if (value != null)
                    {
                        value.VarName ??= varName;

                        localDevicePathsMap.PathsMap.Add(
                            value.VarName, value.DirPath);
                    }
                }
            }

            return localDevicePathsMap;
        }
    }
}
