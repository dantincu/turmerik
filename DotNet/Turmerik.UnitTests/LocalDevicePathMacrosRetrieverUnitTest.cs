using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextSerialization;

namespace Turmerik.UnitTests
{
    public class LocalDevicePathMacrosRetrieverUnitTest : UnitTestBase
    {
        private readonly IAppEnv appEnv;
        private readonly IJsonConversion jsonConversion;
        private readonly ILocalDevicePathMacrosRetriever pathMacrosRetriever;

        public LocalDevicePathMacrosRetrieverUnitTest()
        {
            appEnv = SvcProv.GetRequiredService<IAppEnv>();
            jsonConversion = SvcProv.GetRequiredService<IJsonConversion>();
            pathMacrosRetriever = SvcProv.GetRequiredService<ILocalDevicePathMacrosRetriever>();
        }

        [Fact]
        public void MainTest()
        {
            var inputObj = new LocalDevicePathMacrosMapMtbl
            {
                PathsMap = new Dictionary<string, string>(),
                TurmerikTempDir = new LocalDevicePathsMap.FolderMtbl
                {
                    DirPath = Environment.CurrentDirectory
                },
                OnedriveDir = new LocalDevicePathsMap.FolderMtbl
                {
                    DirPath = "OnedriveDir"
                },
                OnedriveTurmerikDotNetUtilityAppsArchiveReldir = new LocalDevicePathsMap.FolderMtbl
                {
                    DirPath = "OnedriveTurmerikDotNetUtilityAppsArchiveReldir"
                },
                TurmerikRepoDir = new LocalDevicePathsMap.FolderMtbl
                {
                    DirPath = "TurmerikRepoDir"
                },
                TurmerikDotnetUtilityAppsEnvDir = new LocalDevicePathsMap.FolderMtbl
                {
                    DirPath = "TurmerikDotnetUtilityAppsEnvDir"
                },
                TurmerikDotnetUtilityAppsEnvDirTypeName = new LocalDevicePathsMap.FolderMtbl
                {
                    DirPath = "TurmerikDotnetUtilityAppsEnvDirTypeName"
                }
            };

            inputObj = pathMacrosRetriever.Normalize(inputObj);

            Assert.NotNull(inputObj.UserProfileDir);

            var cloneObj = new LocalDevicePathMacrosMapMtbl(inputObj)
            {
                TurmerikTempDir = null,
                UserProfileDir = null,
                OnedriveDir = null,
                OnedriveTurmerikDotNetUtilityAppsArchiveReldir = null,
                TurmerikRepoDir = null,
                TurmerikDotnetUtilityAppsEnvDir = null,
                TurmerikDotnetUtilityAppsEnvDirTypeName = null
            };

            var objDumpDirPath = appEnv.GetTypePath(
                AppEnvDir.Temp, GetType());

            Directory.CreateDirectory(objDumpDirPath);

            var objDumpFilePath = Path.Combine(
                objDumpDirPath,
                $"{nameof(LocalDevicePathMacrosMapMtbl)}.json");

            File.WriteAllText(objDumpFilePath,
                jsonConversion.Adapter.Serialize(cloneObj));

            var outputObj = pathMacrosRetriever.LoadFromConfigFile(
                objDumpFilePath);

            Assert.Equal(inputObj.TurmerikTempDir.VarName, outputObj.TurmerikTempDir.VarName);
            Assert.Equal(inputObj.TurmerikTempDir.DirPath, outputObj.TurmerikTempDir.DirPath);
            Assert.Equal(inputObj.UserProfileDir.VarName, outputObj.UserProfileDir.VarName);
            Assert.Equal(inputObj.UserProfileDir.DirPath, outputObj.UserProfileDir.DirPath);
            Assert.Equal(inputObj.OnedriveDir.VarName, outputObj.OnedriveDir.VarName);
            Assert.Equal(inputObj.OnedriveDir.DirPath, outputObj.OnedriveDir.DirPath);

            Assert.Equal(inputObj.OnedriveTurmerikDotNetUtilityAppsArchiveReldir.VarName,
                outputObj.OnedriveTurmerikDotNetUtilityAppsArchiveReldir.VarName);

            Assert.Equal(inputObj.OnedriveTurmerikDotNetUtilityAppsArchiveReldir.DirPath,
                outputObj.OnedriveTurmerikDotNetUtilityAppsArchiveReldir.DirPath);

            Assert.Equal(inputObj.TurmerikRepoDir.VarName, outputObj.TurmerikRepoDir.VarName);
            Assert.Equal(inputObj.TurmerikRepoDir.DirPath, outputObj.TurmerikRepoDir.DirPath);

            Assert.Equal(inputObj.TurmerikDotnetUtilityAppsEnvDir.VarName,
                outputObj.TurmerikDotnetUtilityAppsEnvDir.VarName);

            Assert.Equal(inputObj.TurmerikDotnetUtilityAppsEnvDir.DirPath,
                outputObj.TurmerikDotnetUtilityAppsEnvDir.DirPath);
        }
    }
}
