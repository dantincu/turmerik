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

namespace Turmerik.Notes.Core
{
    public interface INotesAppConfigLoader
    {
        NotesAppConfigMtbl LoadConfig(
            string configFilePath = null);

        NotesAppConfigMtbl NormalizeConfig(
            NotesAppConfigMtbl config,
            string configFilePath);

        NotesAppConfigMtbl NormalizeConfig(
            NotesAppConfigMtbl config,
            NotesAppConfigMtbl nestedConfig);

        NoteDirsPairConfigMtbl NormalizeConfig(
            NoteDirsPairConfigMtbl config,
            NoteDirsPairConfigMtbl nestedConfig);

        NoteDirsPairConfigMtbl.ArgOptionsAggT NormalizeConfig(
            NoteDirsPairConfigMtbl.ArgOptionsAggT config,
            NoteDirsPairConfigMtbl.ArgOptionsAggT nestedConfig);

        NoteDirsPairConfigMtbl.ArgOptionT NormalizeConfig(
            NoteDirsPairConfigMtbl.ArgOptionT config,
            NoteDirsPairConfigMtbl.ArgOptionT nestedConfig);

        NoteDirsPairConfigMtbl.DirNamesT NormalizeConfig(
            NoteDirsPairConfigMtbl.DirNamesT config,
            NoteDirsPairConfigMtbl.DirNamesT nestedConfig);

        NoteDirsPairConfigMtbl.DirNamePfxesT NormalizeConfig(
            NoteDirsPairConfigMtbl.DirNamePfxesT config,
            NoteDirsPairConfigMtbl.DirNamePfxesT nestedConfig);

        NoteDirsPairConfigMtbl.DirNameIdxesT NormalizeConfig(
            NoteDirsPairConfigMtbl.DirNameIdxesT config,
            NoteDirsPairConfigMtbl.DirNameIdxesT nestedConfig);

        NoteDirsPairConfigMtbl.FileNamesT NormalizeConfig(
            NoteDirsPairConfigMtbl.FileNamesT config,
            NoteDirsPairConfigMtbl.FileNamesT nestedConfig);

        NoteDirsPairConfigMtbl.FileContentsT NormalizeConfig(
            NoteDirsPairConfigMtbl.FileContentsT config,
            NoteDirsPairConfigMtbl.FileContentsT nestedConfig);

    }

    public class NotesAppConfigLoader : INotesAppConfigLoader
    {
        private readonly IJsonConversion jsonConversion;

        private static readonly StaticDataCache<Type, ReadOnlyCollection<PropertyInfo>> propsMap;

        static NotesAppConfigLoader()
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

        public NotesAppConfigLoader(
            IJsonConversion jsonConversion)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));
        }

        public NotesAppConfigMtbl LoadConfig(
            string configFilePath = null)
        {
            configFilePath ??= TrmrkNotesH.NOTES_CFG_FILE_NAME;

            if (!Path.IsPathRooted(configFilePath))
            {
                configFilePath = Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    configFilePath);
            }

            var config = jsonConversion.Adapter.Deserialize<NotesAppConfigMtbl>(
                File.ReadAllText(configFilePath));

            config = NormalizeConfig(
                config,
                configFilePath);

            if (config.NestedConfigFilePaths != null)
            {
                foreach (var nestedConfigFilePath in config.NestedConfigFilePaths)
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

        public NotesAppConfigMtbl NormalizeConfig(
            NotesAppConfigMtbl config,
            string configFilePath)
        {
            config.NoteDirPairs ??= new ();
            config.StorageOptions ??= new ();

            return config;
        }

        public NotesAppConfigMtbl NormalizeConfig(
            NotesAppConfigMtbl config,
            NotesAppConfigMtbl nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            NormalizeConfig(
                config.NoteDirPairs,
                nestedConfig.NoteDirPairs);

            config.SingleStorageOption = nestedConfig.SingleStorageOption ?? config.SingleStorageOption;

            config.StorageOptions.AddRange(
                nestedConfig.StorageOptions);

            return config;
        }

        public NoteDirsPairConfigMtbl NormalizeConfig(
            NoteDirsPairConfigMtbl config,
            NoteDirsPairConfigMtbl nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            NormalizeConfig(
                config.ArgOpts ??= new (),
                nestedConfig.ArgOpts ??= new ());

            NormalizeConfig(
                config.DirNames ??= new(),
                nestedConfig.DirNames ??= new());

            NormalizeConfig(
                config.NoteDirNameIdxes ??= new(),
                nestedConfig.NoteDirNameIdxes ??= new());

            NormalizeConfig(
                config.NoteSectionDirNameIdxes ??= new(),
                nestedConfig.NoteSectionDirNameIdxes ??= new());

            config.NoteSectionDirNameIdxesMap ??= new();

            if (nestedConfig.NoteSectionDirNameIdxesMap != null)
            {
                foreach (var kvp in nestedConfig.NoteSectionDirNameIdxesMap)
                {
                    config.NoteSectionDirNameIdxesMap.AddOrUpdate(
                        kvp.Key, key => new(),
                        (key, value) => NormalizeConfig(
                            value, kvp.Value));
                }
            }

            NormalizeConfig(
                config.NoteInternalDirNameIdxes ??= new(),
                nestedConfig.NoteInternalDirNameIdxes ??= new());

            NormalizeConfig(
                config.FileNames ??= new(),
                nestedConfig.FileNames ??= new());

            NormalizeConfig(
                config.FileContents ??= new(),
                nestedConfig.FileContents ??= new());

            return config;
        }

        public NoteDirsPairConfigMtbl.ArgOptionsAggT NormalizeConfig(
            NoteDirsPairConfigMtbl.ArgOptionsAggT config,
            NoteDirsPairConfigMtbl.ArgOptionsAggT nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            NormalizeConfig(
                config.Help ??= new (),
                nestedConfig.Help ??= new());

            NormalizeConfig(
                config.SrcNote ??= new(),
                nestedConfig.SrcNote ??= new());

            NormalizeConfig(
                config.SrcDirIdnf ??= new(),
                nestedConfig.SrcDirIdnf ??= new());

            NormalizeConfig(
                config.SrcNoteIdx ??= new(),
                nestedConfig.SrcNoteIdx ??= new());

            NormalizeConfig(
                config.DestnNote ??= new(),
                nestedConfig.DestnNote ??= new());

            NormalizeConfig(
                config.DestnDirIdnf ??= new(),
                nestedConfig.DestnDirIdnf ??= new());

            NormalizeConfig(
                config.DestnNoteIdx ??= new(),
                nestedConfig.DestnNoteIdx ??= new());

            NormalizeConfig(
                config.NotesOrder ??= new(),
                nestedConfig.NotesOrder ??= new());

            NormalizeConfig(
                config.NoteIdxesOrder ??= new(),
                nestedConfig.NoteIdxesOrder ??= new());

            NormalizeConfig(
                config.IsSection ??= new(),
                nestedConfig.IsSection ??= new());

            NormalizeConfig(
                config.SortIdx ??= new(),
                nestedConfig.SortIdx ??= new());

            NormalizeConfig(
                config.NoteIdx ??= new(),
                nestedConfig.NoteIdx ??= new());

            NormalizeConfig(
                config.OpenMdFile ??= new(),
                nestedConfig.OpenMdFile ??= new());

            NormalizeConfig(
                config.ReorderNotes ??= new(),
                nestedConfig.ReorderNotes ??= new());

            NormalizeConfig(
                config.CreateNoteFilesDirsPair ??= new(),
                nestedConfig.CreateNoteFilesDirsPair ??= new());

            NormalizeConfig(
                config.CreateNoteInternalDirsPair ??= new(),
                nestedConfig.CreateNoteInternalDirsPair ??= new());

            config.CommandsMap ??= new();
            nestedConfig.CommandsMap ??= new();

            foreach (var kvp in nestedConfig.CommandsMap)
            {
                config.CommandsMap.AddOrUpdate(
                    kvp.Key,
                    key => kvp.Value,
                    (key, val) => NormalizeConfig(
                        val, kvp.Value));
            }

            return config;
        }

        public NoteDirsPairConfigMtbl.ArgOptionT NormalizeConfig(
            NoteDirsPairConfigMtbl.ArgOptionT config,
            NoteDirsPairConfigMtbl.ArgOptionT nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            return config;
        }

        public NoteDirsPairConfigMtbl.DirNamesT NormalizeConfig(
            NoteDirsPairConfigMtbl.DirNamesT config,
            NoteDirsPairConfigMtbl.DirNamesT nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            NormalizeConfig(
                config.NoteInternalsPfxes ??= new(),
                nestedConfig.NoteInternalsPfxes ??= new());

            NormalizeConfig(
                config.NoteItemsPfxes ??= new(),
                nestedConfig.NoteItemsPfxes ??= new());

            NormalizeConfig(
                config.NoteSectionsPfxes ??= new(),
                nestedConfig.NoteSectionsPfxes ??= new());

            return config;
        }

        public NoteDirsPairConfigMtbl.DirNamePfxesT NormalizeConfig(
            NoteDirsPairConfigMtbl.DirNamePfxesT config,
            NoteDirsPairConfigMtbl.DirNamePfxesT nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            return config;
        }

        public NoteDirsPairConfigMtbl.DirNameIdxesT NormalizeConfig(
            NoteDirsPairConfigMtbl.DirNameIdxesT config,
            NoteDirsPairConfigMtbl.DirNameIdxesT nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            return config;
        }

        public NoteDirsPairConfigMtbl.FileNamesT NormalizeConfig(
            NoteDirsPairConfigMtbl.FileNamesT config,
            NoteDirsPairConfigMtbl.FileNamesT nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            return config;
        }

        public NoteDirsPairConfigMtbl.FileContentsT NormalizeConfig(
            NoteDirsPairConfigMtbl.FileContentsT config,
            NoteDirsPairConfigMtbl.FileContentsT nestedConfig)
        {
            NormalizeConfigCore(
                config,
                nestedConfig);

            return config;
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
