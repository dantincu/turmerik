using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextParsing.IndexesFilter;

namespace Turmerik.NetCore.ConsoleApps.MkScripts
{
    public interface IProgramArgsNormalizer
    {
        void NormalizeArgs(
            ProgramArgs args);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.FilesGroup filesGroup);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.FilesGroup filesGroup,
            ProgramConfig.File file);

        string GetFileTextContents(
            ProgramArgs args,
            ProgramConfig.FilesGroup filesGroup,
            ProgramConfig.File file);

        ProgramConfig.RelDirPaths NormalizeRelDirPaths(
            ProgramArgs args,
            ProgramConfig.RelDirPaths relDirPaths,
            ProgramConfig.RelDirPaths baseDirPaths);

        ProgramConfig.ContentSpecs NormalizeContentSpecs(
            ProgramArgs args,
            ProgramConfig.ContentSpecs contentArgs,
            ProgramConfig.ContentSpecs dfContentArgs);

        Dictionary<string, ProgramConfig.Filter> NormalizeFilters(
            Dictionary<string, ProgramConfig.RawFilter> filters,
            Dictionary<string, ProgramConfig.Filter> dfFilters);

        string? JoinLinesIfNotNull(string[]? lines);
    }

    public class ProgramArgsNormalizer : IProgramArgsNormalizer
    {
        private readonly IProgramConfigRetriever programConfigRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IIdxesFilterParser idxesFilterParser;
        private readonly IFilteredItemsRetriever filteredItemsRetriever;

        public ProgramArgsNormalizer(
            IProgramConfigRetriever programConfigRetriever,
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            IIdxesFilterParser idxesFilterParser,
            IFilteredItemsRetriever filteredItemsRetriever)
        {
            this.programConfigRetriever = programConfigRetriever ?? throw new ArgumentNullException(
                nameof(programConfigRetriever));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.idxesFilterParser = idxesFilterParser ?? throw new ArgumentNullException(
                nameof(idxesFilterParser));

            this.filteredItemsRetriever = filteredItemsRetriever ?? throw new ArgumentNullException(
                nameof(filteredItemsRetriever));
        }

        public void NormalizeArgs(
            ProgramArgs args)
        {
            localDevicePathMacrosRetriever.Normalize(args.LocalDevicePathsMap);
            NormalizeArgs(args, args.Profile);
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile)
        {
            profile.RelDirPaths = NormalizeRelDirPaths(
                args, profile.RelDirPaths,
                new ProgramConfig.RelDirPaths
                {
                    DirPathsArr = [ string.Empty ],
                    Filters = new Dictionary<string, ProgramConfig.RawFilter>()
                });

            profile.DefaultContentSpecs = NormalizeContentSpecs(
                args, profile.DefaultContentSpecs,
                new ProgramConfig.ContentSpecs());

            NormalizeArgs(args, profile, args.Section);
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section)
        {
            section.RelDirPaths = NormalizeRelDirPaths(args,
                section.RelDirPaths,
                profile.RelDirPaths);

            section.DefaultContentSpecs = NormalizeContentSpecs(
                args,
                section.DefaultContentSpecs,
                profile.DefaultContentSpecs);

            foreach (var filesGroup in section.FileGroups)
            {
                NormalizeArgs(args, profile, section, filesGroup);
            }
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.FilesGroup filesGroup)
        {
            filesGroup.RelDirPaths = NormalizeRelDirPaths(args,
                filesGroup.RelDirPaths,
                section.RelDirPaths);

            filesGroup.DefaultContentSpecs = NormalizeContentSpecs(
                args, filesGroup.DefaultContentSpecs,
                section.DefaultContentSpecs);

            foreach (var file in filesGroup.Files)
            {
                NormalizeArgs(args, profile, section, filesGroup, file);
            }
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile,
            ProgramConfig.ProfileSection section,
            ProgramConfig.FilesGroup filesGroup,
            ProgramConfig.File file)
        {
            file.RelDirPaths = NormalizeRelDirPaths(args,
                file.RelDirPaths,
                filesGroup.RelDirPaths);

            file.DefaultContentSpecs = NormalizeContentSpecs(
                args, file.DefaultContentSpecs,
                filesGroup.DefaultContentSpecs);

            file.TextContent ??= GetFileTextContents(args, filesGroup, file);
        }

        public string GetFileTextContents(
            ProgramArgs args,
            ProgramConfig.FilesGroup filesGroup,
            ProgramConfig.File file)
        {
            string? textContent = JoinLinesIfNotNull(
                file.TextContentLines);

            if (textContent == null)
            {
                var sb = new StringBuilder();

                for (int sectionIdx = 0; sectionIdx < file.ContentSpecs.Count; sectionIdx++)
                {
                    var contentSpecs = file.ContentSpecs[sectionIdx];

                    NormalizeContentSpecs(
                        args, contentSpecs,
                        file.DefaultContentSpecs);

                    var contentArgsSetsArr = filteredItemsRetriever.GetFilteredItemsIfReq(
                        new FilteredItemsRetrieverOpts<string[]>
                        {
                            ItemsArr = contentSpecs.Args,
                            FiltersMap = contentSpecs.ArgFiltersMap,
                            FilterName = args.ContentArgsIdxesFilterName,
                            ToStrArrSerializer = item => item
                        });

                    int argsSetIdxMaxValue = contentSpecs.Args.Length - 1;

                    for (int argsSetIdx = 0; argsSetIdx <= argsSetIdxMaxValue; argsSetIdx++)
                    {
                        var argsSet = contentSpecs.Args[argsSetIdx];

                        string argsSetTpl;

                        if (argsSetIdx == 0)
                        {
                            argsSetTpl = contentSpecs.FirstArgsSetTpl;
                        }
                        else if (argsSetIdx == argsSetIdxMaxValue)
                        {
                            argsSetTpl = contentSpecs.LastArgsSetTpl;
                        }
                        else
                        {
                            argsSetTpl = contentSpecs.ArgsSetTpl;
                        }

                        string renderedArgsSet = string.Format(
                            argsSetTpl, argsSet);

                        sb.Append(renderedArgsSet);
                    }
                }

                textContent = sb.ToString();
            }

            return textContent;
        }

        public ProgramConfig.RelDirPaths NormalizeRelDirPaths(
            ProgramArgs args,
            ProgramConfig.RelDirPaths relDirPaths,
            ProgramConfig.RelDirPaths baseDirPaths)
        {
            if (relDirPaths.DirPath != null)
            {
                relDirPaths.DirPath = textMacrosReplacer.NormalizePath(
                    args.LocalDevicePathsMap,
                    relDirPaths.DirPath,
                    baseDirPaths.DirPath);
            }
            else
            {
                relDirPaths.DirPath = baseDirPaths.DirPath;
            }

            if (relDirPaths.FiltersMap != null)
            {
                relDirPaths.FiltersMap = NormalizeFilters(
                    relDirPaths.Filters,
                    baseDirPaths.FiltersMap);
            }
            else
            {
                relDirPaths.FiltersMap = baseDirPaths.FiltersMap;
            }

            return relDirPaths;
        }

        public ProgramConfig.ContentSpecs NormalizeContentSpecs(
            ProgramArgs args,
            ProgramConfig.ContentSpecs contentSpecs,
            ProgramConfig.ContentSpecs dfContentSpecs)
        {
            contentSpecs.Args ??= dfContentSpecs.Args;

            if (contentSpecs.ArgFiltersMap != null)
            {
                contentSpecs.ArgFiltersMap = NormalizeFilters(
                    contentSpecs.ArgFilters,
                    dfContentSpecs.ArgFiltersMap);
            }
            else
            {
                contentSpecs.ArgFiltersMap = dfContentSpecs.ArgFiltersMap;
            }

            contentSpecs.FirstArgsSetTpl ??= JoinLinesIfNotNull(
                contentSpecs.FirstArgsSetTplLines) ?? dfContentSpecs.FirstArgsSetTpl;

            contentSpecs.ArgsSetTpl ??= JoinLinesIfNotNull(
                contentSpecs.ArgsSetTplLines) ?? dfContentSpecs.ArgsSetTpl;

            contentSpecs.LastArgsSetTpl ??= JoinLinesIfNotNull(
                contentSpecs.LastArgsSetTplLines) ?? dfContentSpecs.LastArgsSetTpl;

            contentSpecs.Template ??= JoinLinesIfNotNull(
                contentSpecs.TemplateLines) ?? dfContentSpecs.Template;

            return contentSpecs;
        }

        public Dictionary<string, ProgramConfig.Filter> NormalizeFilters(
            Dictionary<string, ProgramConfig.RawFilter> filters,
            Dictionary<string, ProgramConfig.Filter> dfFilters) => filters?.With(
                rawFilters => rawFilters.ToDictionary(
                    kvp => kvp.Key, kvp => new ProgramConfig.Filter
                    {
                        Raw = kvp.Value,
                        Idxes = kvp.Value.Idxes?.With(
                            idxes => idxesFilterParser.ParseMultipleIdxesFilters(idxes)),
                        Regex = kvp.Value.Regex?.With(
                            regex => new Regex(regex)),
                        Regexes = kvp.Value.Regexes?.Select(
                            regex => new Regex(regex)).ToArray()
                    })) ?? dfFilters;

        public string? JoinLinesIfNotNull(
            string[]? lines) => lines != null ? string.Join(
            Environment.NewLine, lines) : null;
    }
}
