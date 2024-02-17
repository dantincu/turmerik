using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.Jint.Behavior;

namespace Turmerik.UnitTests
{
    public class JintBehaviorUnitTest : UnitTestBase
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IAppEnv appEnv;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly string jintDynamicTestBehaviorDirPath;
        private readonly string jintDynamicTestBehaviorJsonFilePath;
        private readonly string jintDynamicTestBehaviorJsFilePath;
        private readonly JintDynamicTestBehavior jintDynamicTestBehavior;

        public JintBehaviorUnitTest()
        {
            jsonConversion = SvcProv.GetRequiredService<IJsonConversion>();
            appEnv = SvcProv.GetRequiredService<IAppEnv>();
            localDevicePathMacrosRetriever = SvcProv.GetRequiredService<ILocalDevicePathMacrosRetriever>();

            WriteTestDataToDisk(
                out jintDynamicTestBehaviorDirPath,
                out jintDynamicTestBehaviorJsonFilePath,
                out jintDynamicTestBehaviorJsFilePath);

            jintDynamicTestBehavior = SvcProv.GetRequiredService<JintDynamicTestBehavior>();
        }

        [Fact]
        public void DefaultDynamicBehaviorTest()
        {
            var behavior = jintDynamicTestBehavior.Behavior;

            int actualValue = behavior.Invoke<int>(
                jintDynamicTestBehavior.ExportedMembers.AddMethodName, [ 1, 2 ]);

            Assert.Equal(3, actualValue);
        }

        private void WriteTestDataToDisk(
            out string jintDynamicTestBehaviorDirPath,
            out string jintDynamicTestBehaviorJsonFilePath,
            out string jintDynamicTestBehaviorJsFilePath)
        {
            jintDynamicTestBehaviorDirPath = appEnv.GetTypePath(
                AppEnvDir.Data, typeof(JintDynamicTestBehavior));

            Directory.CreateDirectory(
                jintDynamicTestBehaviorDirPath);

            jintDynamicTestBehaviorJsonFilePath = Path.Combine(
                jintDynamicTestBehaviorDirPath,
                JintH.BEHAVIOR_JSON_FILE_NAME);

            jintDynamicTestBehaviorJsFilePath = Path.Combine(
                jintDynamicTestBehaviorDirPath,
                JintH.BEHAVIOR_JS_FILE_NAME);

            string json = jsonConversion.Adapter.Serialize(
                new AppBehaviorConfigMtbl
                {
                    JsFilePaths = Path.Combine(
                        localDevicePathMacrosRetriever.PropNameToMacro(
                            nameof(LocalDevicePathMacrosMapMtbl.TurmerikDotnetUtilityAppsEnvDir)),
                        AppEnvDir.Data.ToString(),
                        localDevicePathMacrosRetriever.PropNameToMacro(
                            nameof(LocalDevicePathMacrosMapMtbl.TurmerikDotnetUtilityAppsEnvDirTypeName)),
                        JintH.BEHAVIOR_JS_FILE_NAME).Arr().ToList()
                });

            string js = string.Join(Environment.NewLine,
                "var turmerik = {",
                "  add: function(x, y) { return x + y; },",
                "  getExportedMembers: () => ({",
                "    AddMethodName: \"turmerik.add\"",
                "   })",
                "};");

            File.WriteAllText(jintDynamicTestBehaviorJsonFilePath, json);
            File.WriteAllText(jintDynamicTestBehaviorJsFilePath, js);
        }
    }
}
