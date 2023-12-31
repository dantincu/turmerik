using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using Turmerik.Core.TextSerialization;

namespace Turmerik.Core.Helpers
{
    public static class EnvH
    {
        public const string APP_SETTINGS_FILE_NAME = "appsettings.json";

        public static readonly string ExecutingAssemmblyPath;
        public static readonly string ExecutingAssemblyDirPath;

        static EnvH()
        {
            ExecutingAssemmblyPath = AppDomain.CurrentDomain.BaseDirectory;

            ExecutingAssemblyDirPath = Path.GetDirectoryName(
                ExecutingAssemmblyPath);
        }

        public static string GetExecutingAssemblyPath(
            ) => Assembly.GetExecutingAssembly().Location;
    }
}
