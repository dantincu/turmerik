using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Core.LocalDeviceEnv
{
    public static class LocalDevicePathsMapH
    {
        public const string CONFIG_FILE_NAME = "trmrk-localdevice-paths.json";

        public static LocalDevicePathsMap LoadFromConfigFile(
            IJsonConversion jsonConversion,
            string configFilePath = null,
            bool autoFillProps = true,
            bool normalize = true)
        {
            var localDevicePathsMap = jsonConversion.Adapter.Deserialize<LocalDevicePathsMap>(
                File.ReadAllText(configFilePath ?? CONFIG_FILE_NAME));

            if (autoFillProps)
            {
                localDevicePathsMap = localDevicePathsMap.AutoFillProps();
            }

            if (normalize)
            {
                localDevicePathsMap = localDevicePathsMap.Normalize();
            }

            return localDevicePathsMap;
        }

        public static LocalDevicePathsMap Normalize(
            this LocalDevicePathsMap localDevicePathsMap) => localDevicePathsMap;

        public static LocalDevicePathsMap AutoFillProps(
            this LocalDevicePathsMap localDevicePathsMap) => localDevicePathsMap;
    }
}
