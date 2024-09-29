using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
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
                                AssemblyFilePath = csProj.CsProjectAssembly.Paths.SrcPath,
                                LoadAllTypes = csProj.CsProjectAssembly.IncludeAllTypes,
                                TypesToLoad = csProj.CsProjectAssembly.TypesArr?.Select(
                                    GetTypeOpts).ToList()!
                            }).ToList()
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
            foreach (var asmb in wka.Section.CsProjectsArr)
            {
                Run(new CsProjWorkArgs(wka, asmb));
            }
        }

        public void Run(
            CsProjWorkArgs wka)
        {
            foreach (var kvp in wka.AsmbMap)
            {
                Run(new CsProjAsmbWorkArgs(wka, kvp));
            }
        }

        public void Run(
            CsProjAsmbWorkArgs wka)
        {
            string asmbDirPath = GetAsmbDestnDirPath(wka);

            foreach (var typeKvp in wka.AsmbKvp.Value.TypesMap)
            {
                Run(new TypeWorkArgs(wka, typeKvp, asmbDirPath));
            }
        }

        public void Run(
            TypeWorkArgs wka)
        {
            string relDirPath = GetTypeDestnRelDirPath(
                wka, out var shortTypeName);

            string dirPath = Path.Combine(
                wka.AsmbDirPath, relDirPath);

            Directory.CreateDirectory(dirPath);

            string filePath = Path.Combine(
                dirPath,
                wka.PgArgs.Profile.TypeDefFileName);

            var tsCodeLinesList = GetTsCodeLines(
                new TsCodeWorkArgs(wka, shortTypeName,
                    GetTypeDepNames(wka), []));

            File.WriteAllLines(filePath,
                tsCodeLinesList.ToArray());
        }
    }
}
