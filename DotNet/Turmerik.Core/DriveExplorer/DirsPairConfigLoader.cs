using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDirsPairConfigLoader
    {
        DirsPairConfig LoadConfig(
            string configFilePath = null);

        DirsPairConfig NormalizeConfig(
            DirsPairConfig config,
            string configFilePath);

        DirsPairConfig NormalizeConfig(
            DirsPairConfig config,
            DirsPairConfig nestedConfig);

        DirsPairConfig.ArgOptionsT NormalizeConfig(
            DirsPairConfig.ArgOptionsT config,
            DirsPairConfig.ArgOptionsT nestedConfig);

        DirsPairConfig.DirNamesT NormalizeConfig(
            DirsPairConfig.DirNamesT config,
            DirsPairConfig.DirNamesT nestedConfig);

        DirsPairConfig.FileNamesT NormalizeConfig(
            DirsPairConfig.FileNamesT config,
            DirsPairConfig.FileNamesT nestedConfig);

        DirsPairConfig.FileContentsT NormalizeConfig(
            DirsPairConfig.FileContentsT config,
            DirsPairConfig.FileContentsT nestedConfig);

        DirsPairConfig.MacrosT NormalizeConfig(
            DirsPairConfig.MacrosT config,
            DirsPairConfig.MacrosT nestedConfig);

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

        private static readonly StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>> propsMap;

        static DirsPairConfigLoader()
        {
            propsMap = new StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>>(
                type => type.GetProperties().Where(
                    prop =>
                    {
                        var propType = prop.PropertyType;
                        bool include = propType == typeof(string) || propType.IsValueType;

                        return include;
                    }).ToArray().RdnlC());
        }

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

            if (config.NestedConfigFilePathsArr != null)
            {
                foreach (var nestedConfigFilePath in config.NestedConfigFilePathsArr)
                {
                    var nestedConfig = LoadConfig(
                        nestedConfigFilePath);

                    config = NormalizeConfig(
                        config,
                        nestedConfig);
                }
            }

            return config;
        }

        public DirsPairConfig NormalizeConfig(
            DirsPairConfig config,
            DirsPairConfig nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            config.ArgOpts = NormalizeConfig(
                config.ArgOpts ??= new(),
                nestedConfig.ArgOpts ??= new());

            config.DirNames = NormalizeConfig(
                config.DirNames ??= new(),
                nestedConfig.DirNames ??= new());

            config.FileNames = NormalizeConfig(
                config.FileNames ??= new(),
                nestedConfig.FileNames ??= new());

            config.FileContents = NormalizeConfig(
                config.FileContents ??= new(),
                nestedConfig.FileContents ??= new());

            config.Macros = NormalizeConfig(
                config.Macros ??= new(),
                nestedConfig.Macros ??= new());

            return config;
        }

        public DirsPairConfig.ArgOptionsT NormalizeConfig(
            DirsPairConfig.ArgOptionsT config,
            DirsPairConfig.ArgOptionsT nestedConfig)
        {
            /* config.PrintHelpMessage = NormRefValue(
                config.PrintHelpMessage,
                nestedConfig.PrintHelpMessage);

            config.PrintConfigSection = NormRefValue(
                config.PrintConfigSection,
                nestedConfig.PrintConfigSection);

            config.WorkDir = NormRefValue(
                config.WorkDir,
                nestedConfig.WorkDir);

            config.InteractiveMode = NormRefValue(
                config.InteractiveMode,
                nestedConfig.InteractiveMode);

            config.OpenMdFile = NormRefValue(
                config.OpenMdFile,
                nestedConfig.OpenMdFile);

            config.SkipMdFileCreation = NormRefValue(
                config.SkipMdFileCreation,
                nestedConfig.SkipMdFileCreation);

            config.SkipPdfFileCreation = NormRefValue(
                config.SkipPdfFileCreation,
                nestedConfig.SkipPdfFileCreation);

            config.SkipCurrentNode = NormRefValue(
                config.SkipCurrentNode,
                nestedConfig.SkipCurrentNode);

            config.SkipUntilPath = NormRefValue(
                config.SkipUntilPath,
                nestedConfig.SkipUntilPath);

            config.CreatePdfFile = NormRefValue(
                config.CreatePdfFile,
                nestedConfig.CreatePdfFile);

            config.DirNameTpl = NormRefValue(
                config.DirNameTpl,
                nestedConfig.DirNameTpl);

            config.CreateNote = NormRefValue(
                config.CreateNote,
                nestedConfig.CreateNote);

            config.CreateNoteSection = NormRefValue(
                config.CreateNoteSection,
                nestedConfig.CreateNoteSection);

            config.CreateNoteBook = NormRefValue(
                config.CreateNoteBook,
                nestedConfig.CreateNoteBook);

            config.CreateNoteInternalsDir = NormRefValue(
                config.CreateNoteInternalsDir,
                nestedConfig.CreateNoteInternalsDir);

            config.CreateNoteFilesDir = NormRefValue(
                config.CreateNoteFilesDir,
                nestedConfig.CreateNoteFilesDir);

            config.ConvertToNoteSections = NormRefValue(
                config.ConvertToNoteSections,
                nestedConfig.ConvertToNoteSections);

            config.ConvertToNoteItems = NormRefValue(
                config.ConvertToNoteItems,
                nestedConfig.ConvertToNoteItems);

            config.Url = NormRefValue(
                config.Url,
                nestedConfig.Url);

            config.Uri = NormRefValue(
                config.Uri,
                nestedConfig.Uri);

            config.ShowLastCreatedFirst = NormRefValue(
                config.ShowLastCreatedFirst,
                nestedConfig.ShowLastCreatedFirst);

            config.ShowOtherDirNames = NormRefValue(
                config.ShowOtherDirNames,
                nestedConfig.ShowOtherDirNames);

            config.HcyChildNode = NormRefValue(
                config.HcyChildNode,
                nestedConfig.HcyChildNode);

            config.HcyParentNode = NormRefValue(
                config.HcyParentNode,
                nestedConfig.HcyParentNode);

            config.HcySibblingNode = NormRefValue(
                config.HcySibblingNode,
                nestedConfig.HcySibblingNode);

            config.Macro = NormRefValue(
                config.Macro,
                nestedConfig.Macro);

            config.Title = NormRefValue(
                config.Title,
                nestedConfig.Title);

            config.RecursiveMatchingDirNames = NormRefValue(
                config.RecursiveMatchingDirNames,
                nestedConfig.RecursiveMatchingDirNames); */

            NormalizeConfigCore(
                config,
                nestedConfig);

            return config;
        }

        public DirsPairConfig.DirNamesT NormalizeConfig(
            DirsPairConfig.DirNamesT config,
            DirsPairConfig.DirNamesT nestedConfig)
        {
            /* config.DefaultJoinStr = NormRefValue(
                config.DefaultJoinStr,
                nestedConfig.DefaultJoinStr); */

            NormalizeConfigCore(
                config,
                nestedConfig);

            config.DirNamesTplMap = NormMaps(
                config.DirNamesTplMap ??= new (),
                nestedConfig.DirNamesTplMap ??= new());

            config.MacrosMap = NormMaps(
                config.MacrosMap ??= new(),
                nestedConfig.MacrosMap ??= new());

            config.MacrosMap = config.MacrosMap.ToList().With(list =>
            {
                list.Sort((kvp1, kvp2) => kvp1.Value.CompareTo(kvp2.Value));
                var retMap = list.Dictnr();

                return retMap;
            });

            return config;
        }

        public DirsPairConfig.FileNamesT NormalizeConfig(
            DirsPairConfig.FileNamesT config,
            DirsPairConfig.FileNamesT nestedConfig)
        {
            /* config.MdFileName = NormRefValue(
                config.MdFileName,
                nestedConfig.MdFileName);

            config.MdFileNamePfx = NormRefValue(
                config.MdFileNamePfx,
                nestedConfig.MdFileNamePfx);

            config.PrependTitleToNoteMdFileName = NormNllblValue(
                config.PrependTitleToNoteMdFileName,
                nestedConfig.PrependTitleToNoteMdFileName);

            config.KeepFileName = NormRefValue(
                config.KeepFileName,
                nestedConfig.KeepFileName); */

            NormalizeConfigCore(
                config,
                nestedConfig);

            return config;
        }

        public DirsPairConfig.FileContentsT NormalizeConfig(
            DirsPairConfig.FileContentsT config,
            DirsPairConfig.FileContentsT nestedConfig)
        {
            /* config.KeepFileContentsTemplate = NormRefValue(
                config.KeepFileContentsTemplate,
                nestedConfig.KeepFileContentsTemplate);

            config.KeepFileContainsNoteJson = NormNllblValue(
                config.KeepFileContainsNoteJson,
                nestedConfig.KeepFileContainsNoteJson);

            config.MdFileContentsTemplate = NormRefValue(
                config.MdFileContentsTemplate,
                nestedConfig.MdFileContentsTemplate);

            config.MdFileContentSectionTemplate = NormRefValue(
                config.MdFileContentSectionTemplate,
                nestedConfig.MdFileContentSectionTemplate); */

            NormalizeConfigCore(
                config,
                nestedConfig);

            return config;
        }

        public DirsPairConfig.MacrosT NormalizeConfig(
            DirsPairConfig.MacrosT config,
            DirsPairConfig.MacrosT nestedConfig)
        {
            config.Map = NormMaps(
                config.Map,
                nestedConfig.Map);

            config.Map = config.Map.ToList().With(list =>
            {
                list.Sort((kvp1, kvp2) => kvp1.Key.CompareTo(kvp2.Key));
                var retMap = list.Dictnr();

                return retMap;
            });

            return config;
        }

        public DirsPairConfig NormalizeConfig(
            DirsPairConfig config,
            string configFilePath)
        {
            config.DirNames = NormalizeConfig(
                config.DirNames ??= new (),
                configFilePath);

            config.Macros = NormalizeConfig(
                config.Macros ??= new(),
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

        private TObj NormalizeConfigCore<TObj>(
            TObj config,
            TObj nestedConfig)
        {
            var propsCllctn = propsMap.Get(typeof(TObj));

            foreach (var prop in propsCllctn)
            {
                var propType = prop.PropertyType;
                var propVal = prop.GetValue(nestedConfig, null);

                if (propVal != null && (!propType.IsValueType || !propVal.Equals(
                    Activator.CreateInstance(prop.PropertyType))))
                {
                    prop.SetValue(config, propVal);
                }
            }

            return config;
        }

        private Dictionary<string, TValue> NormMaps<TValue>(
            Dictionary<string, TValue> map,
            Dictionary<string, TValue> nestedMap)
        {
            foreach (var kvp in nestedMap)
            {
                map[kvp.Key] = kvp.Value;
            }

            return map;
        }
    }
}
