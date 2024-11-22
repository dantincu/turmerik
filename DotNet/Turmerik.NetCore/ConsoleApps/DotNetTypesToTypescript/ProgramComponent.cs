using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.NetCore.Reflection.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramComponent
    {
        Task RunAsync(
            string[] rawArgs);
    }

    public partial class ProgramComponent : IProgramComponent
    {
        public readonly ReadOnlyDictionary<bool, ReadOnlyDictionary<TypeItemKind, string>> PrimitiveNamesMap;

        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly IJsonConversion jsonConversion;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly AssemblyLoader assemblyLoader;

        public ProgramComponent(
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            IJsonConversion jsonConversion,
            ITextMacrosReplacer textMacrosReplacer,
            AssemblyLoader assemblyLoader)
        {
            PrimitiveNamesMap = GetRdnlPrimitiveNamesMap();

            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.assemblyLoader = assemblyLoader ?? throw new ArgumentNullException(
                nameof(assemblyLoader));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = programArgsRetriever.GetArgs(rawArgs);

            if (args.PrintHelpMessage != true)
            {
                programArgsNormalizer.NormalizeArgs(args);
                await RunAsync(args);
            }
        }

        public async Task RunAsync(ProgramArgs args)
        {
            var wka = GetWorkArgs(args);
            await RunAsync(wka);
        }

        public WorkArgs GetWorkArgs(
            ProgramArgs args) => new WorkArgs(args);

        public async Task RunAsync(WorkArgs wka)
        {
            foreach (var pfSection in wka.PgArgs.Sections)
            {
                var asmbMap = await assemblyLoader.LoadAssembliesAsync(
                    new AssemblyLoaderOpts
                    {
                        Config = wka.PgArgs.Config.AssemblyLoaderConfig,
                        AssemblyDirPaths = pfSection.CsProjectsArr.Select(
                            csProj => csProj.SrcBuildDirPath).ToArray(),
                        AssembliesToLoad = pfSection.CsProjectsArr.Select(
                            csProj => new AssemblyLoaderOpts.AssemblyOpts
                            {
                                AssemblyName = csProj.Name,
                                AssemblyFilePath = csProj.CsProjectAssembly.SrcFilePath,
                                LoadAllTypes = csProj.CsProjectAssembly.IncludeAllTypes,
                                TypesToLoad = csProj.CsProjectAssembly.TypesArr?.Select(
                                    GetTypeOpts).ToList()!,
                            }).ToList(),
                        LoadPubInstnGetProps = true,
                        LoadPubInstnMethods = true,
                    });

                if (wka.PgArgs.RemoveExistingFirst == true)
                {
                    foreach (var section in wka.PgArgs.Sections)
                    {
                        if (Directory.Exists(
                            section.DirPaths.DestnPath))
                        {
                            Directory.Delete(
                                section.DirPaths.DestnPath, true);
                        }
                    }
                }

                Directory.CreateDirectory(
                    pfSection.DirPaths.DestnPath);

                Run(new SectionWorkArgs(wka, pfSection, asmbMap));
            }
        }

        public void Run(
            SectionWorkArgs wka)
        {
            var asmbWorkArgsArr = wka.AsmbMap.Select(kvp =>
            {
                var args = new AsmbWorkArgs(wka, kvp)
                {
                    TypesMap = new()
                };

                foreach (var typeKvp in kvp.Value.TypesMap)
                {
                    string tsFilePath = GetTypeDestnFilePath(
                        args, typeKvp.Value, out var shortName);

                    args.TypesMap.Add(
                        typeKvp.Key,
                        new DotNetTypeData
                        {
                            DepTypesMap = new(),
                            TsFilePath = GetTypeDestnFilePath(
                                args, typeKvp.Value, out _),
                            TypeItem = typeKvp.Value
                        });
                }

                return args;
            });

            foreach (var asmbWorkArgs in asmbWorkArgsArr)
            {
                foreach (var kvp in asmbWorkArgs.TypesMap)
                {
                    var kvpVal = kvp.Value;
                    var typeItem = kvpVal.TypeItem;

                    foreach (var dep in typeItem.GetAllTypeDependencies())
                    {
                        _ = GetUniqueTypeShortName(
                            wka, kvpVal.DepTypesMap,
                            typeItem.Name,
                            typeItem,
                            GetTypeDestnRelFilePath(
                                wka, kvpVal.TsFilePath, dep));
                    }
                }
            }

            foreach (var asmbWorkArgs in asmbWorkArgsArr)
            {
                Run(asmbWorkArgs);
            }
        }

        public void Run(
            AsmbWorkArgs wka)
        {
            foreach (var typeKvp in wka.TypesMap)
            {
                Run(new TypeWorkArgs(wka, typeKvp));
            }
        }

        public void Run(
            TypeWorkArgs wka)
        {
            var typeKvp = wka.TypeKvp;
            var typeData = typeKvp.Value;
            var typeItem = typeData.TypeItem;

            var tsCodeLinesList = GetTsCodeLines(
                new TsCodeWorkArgs(wka, [], []));

            File.WriteAllLines(
                typeData.TsFilePath,
                tsCodeLinesList.ToArray());
        }
    }
}
