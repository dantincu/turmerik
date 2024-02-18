using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;

namespace Turmerik.Jint.Behavior
{
    public class AppBehaviorSetupAdapter<TExportedMembersImmtbl, TExportedMembersSrlzbl>
    {
        private readonly IAppEnv appEnv;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ITrmrkJintAdapterFactory trmrkJintAdapterFactory;
        private readonly LocalDevicePathMacrosMapImmtbl localDevicePathsMap;
        private readonly AppEnvDir appEnvDir;
        private readonly Type behaviorDataType;

        public AppBehaviorSetupAdapter(
            IAppEnv appEnv,
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            ITrmrkJintAdapterFactory trmrkJintAdapterFactory,
            AppEnvDir appEnvDir,
            Type behaviorDataType)
        {
            this.appEnv = appEnv ?? throw new ArgumentNullException(
                nameof(appEnv));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.trmrkJintAdapterFactory = trmrkJintAdapterFactory ?? throw new ArgumentNullException(
                nameof(trmrkJintAdapterFactory));

            this.appEnvDir = appEnvDir;

            this.behaviorDataType = behaviorDataType ?? throw new ArgumentNullException(
                nameof(behaviorDataType));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            localDevicePathsMap = GetLocalDevicePathMacrosMap();
        }

        public AppBehaviorConfigImmtbl NormalizeConfig(
            AppBehaviorConfigMtbl config)
        {
            config.ExportedMembersRetrieverJsCode ??= "turmerik.getExportedMembers()";
            config.JsFilePaths ??= GetDefaultBehaviorJsFilePath().Lst();

            var immtbl = new AppBehaviorConfigImmtbl(config);
            return immtbl;
        }

        public string GetDefaultBehaviorJsFilePath() => Path.Combine(
            localDevicePathsMap.TurmerikDotnetUtilityAppsEnvDir.VarName,
            appEnvDir.ToString(),
            string.Concat("|$", StringH.CamelToKebabCase(nameof(
                localDevicePathsMap.TurmerikDotnetUtilityAppsEnvDirTypeName), true), "|"),
            JintH.BEHAVIOR_JS_FILE_NAME);

        public Tuple<ITrmrkJintAdapter, TExportedMembersSrlzbl> LoadDataObj(
            AppBehaviorConfigImmtbl config,
            string jsonDirPath)
        {
            var behavior = trmrkJintAdapterFactory.Create(
                new TrmrkJintAdapterOpts
                {
                    JsScripts = config.GetJsFilePaths().Select(
                        fileName => NormalizeFilePath(
                            jsonDirPath, fileName)).Select(
                        filePath => File.ReadAllText(
                            filePath)).RdnlC()
                });

            var exportedMembers = behavior.Evaluate<TExportedMembersSrlzbl>(
                config.ExportedMembersRetrieverJsCode);

            return Tuple.Create(
                behavior, exportedMembers);
        }

        public string NormalizeFilePath(
            string basePath, string filePath)
        {
            filePath = textMacrosReplacer.ReplaceMacros(
                new TextMacrosReplacerOpts
                {
                    InputText = filePath,
                    MacrosMap = localDevicePathsMap.GetPathsMap(),
                });

            if (!Path.IsPathRooted(filePath))
            {
                filePath = Path.Combine(basePath, filePath);
            }

            return filePath;
        }

        public LocalDevicePathMacrosMapImmtbl GetLocalDevicePathMacrosMap()
        {
            var localDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile(
                null, false, appEnv);

            localDevicePathsMap.TurmerikDotnetUtilityAppsEnvDirTypeName = new LocalDevicePathsMap.FolderMtbl
            {
                DirPath = behaviorDataType.GetTypeFullDisplayName()
            };

            localDevicePathsMap = localDevicePathMacrosRetriever.Normalize(
                localDevicePathsMap, appEnv);

            var localDevicePathsMapImmtbl = localDevicePathsMap.ToImmtbl();
            return localDevicePathsMapImmtbl;
        }
    }
}
