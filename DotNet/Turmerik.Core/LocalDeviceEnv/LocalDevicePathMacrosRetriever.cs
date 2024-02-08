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

        LocalDevicePathMacrosMapMtbl LoadFromConfigFile(
            string configFilePath = null,
            bool normalize = true);

        LocalDevicePathMacrosMapMtbl Normalize(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap);
    }

    public class LocalDevicePathMacrosRetriever : ILocalDevicePathMacrosRetriever
    {
        private static ReadOnlyCollection<PropertyInfo> pubPropInfos;

        private static ReadOnlyDictionary<string, string> propNamesMap;

        private readonly IJsonConversion jsonConversion;

        static LocalDevicePathMacrosRetriever()
        {
            pubPropInfos = typeof(LocalDevicePathMacrosMapMtbl).GetProperties().RdnlC();

            propNamesMap = pubPropInfos.ToDictionary(
                propInfo => propInfo.Name,
                propInfo => string.Format("<${0}>", StringH.CamelToKebabCase(
                    propInfo.Name, true))).RdnlD();
        }

        public LocalDevicePathMacrosRetriever(IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));
        }

        public ReadOnlyDictionary<string, string> DefaultPathsMap { get; } = new Dictionary<string, string>
        {
            { "<$USER_PROFILE_DIR>", Environment.GetFolderPath(
                Environment.SpecialFolder.UserProfile) }
        }.RdnlD();

        public LocalDevicePathMacrosMapMtbl LoadFromConfigFile(
            string configFilePath = null,
            bool normalize = true)
        {
            var localDevicePathsMap = jsonConversion.Adapter.Deserialize<LocalDevicePathMacrosMapMtbl>(
                File.ReadAllText(configFilePath ?? LocalDevicePathMacrosMapH.CONFIG_FILE_NAME));

            if (normalize)
            {
                localDevicePathsMap = Normalize(localDevicePathsMap);
            }

            return localDevicePathsMap;
        }

        public LocalDevicePathMacrosMapMtbl Normalize(
            LocalDevicePathMacrosMapMtbl localDevicePathsMap)
        {
            foreach (var kvp in DefaultPathsMap)
            {
                localDevicePathsMap.PathsMap.GetOrAdd(
                    kvp.Key, key => kvp.Value);
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
