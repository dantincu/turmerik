using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using Turmerik.TextSerialization;

namespace Turmerik.Helpers
{
    public static class EnvH
    {
        public const string APP_SETTINGS_FILE_NAME = "appsettings.json";

        public static readonly string ExecutingAssemblyDirPath;

        static EnvH()
        {
            ExecutingAssemblyDirPath = GetExecutingAssemblyDirPath();
        }

        public static string GetExecutingAssemblyPath(
            ) => Assembly.GetExecutingAssembly().Location;

        public static string GetExecutingAssemblyDirPath()
        {
            string executingAssemblyPath = GetExecutingAssemblyPath();

            string executingAssemblyDirPath = Path.GetDirectoryName(
                executingAssemblyPath);

            return executingAssemblyDirPath;
        }

        public static TConfig LoadConfig<TConfig>(
            this IJsonConversion jsonConversion,
            string configFileName = APP_SETTINGS_FILE_NAME)
        {
            string configFilePath = Path.Combine(
                ExecutingAssemblyDirPath,
                configFileName);

            string configJson = File.ReadAllText(
                configFilePath);

            TConfig config = jsonConversion.Adapter.Deserialize<TConfig>(configJson);
            return config;
        }
    }
}
