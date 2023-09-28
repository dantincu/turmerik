﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace Turmerik.MkFsDirsPair.Lib
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
            string configFileName = APP_SETTINGS_FILE_NAME)
        {
            string configFilePath = Path.Combine(
                ExecutingAssemblyDirPath,
                configFileName);

            string configJson = File.ReadAllText(
                configFilePath);

            TConfig config = JsonConvert.DeserializeObject<TConfig>(configJson);
            return config;
        }
    }
}
