using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.NetCore.Reflection.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramComponent
    {
        Task RunAsync(
            string[] rawArgs);
    }

    public class ProgramComponent : IProgramComponent
    {
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
            ProgramArgs args)
        {
            var wka = new WorkArgs
            {
                PgArgs = args,
            };

            return wka;
        }

        public async Task RunAsync(WorkArgs wka)
        {
            try
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

                    await RunAsync(wka, pfSection, asmbMap);
                }
            }
            finally
            {
            }
        }

        public async Task RunAsync(
            WorkArgs wka,
            ProgramConfig.ProfileSection section,
            Dictionary<string, AssemblyItem> asmbMap)
        {
            foreach (var asmb in section.CsProjectsArr)
            {
                await RunAsync(wka, section, asmbMap, asmb);
            }
        }

        public async Task RunAsync(
            WorkArgs wka,
            ProgramConfig.ProfileSection section,
            Dictionary<string, AssemblyItem> asmbMap,
            ProgramConfig.DotNetCsProject asmb)
        {
            foreach (var kvp in asmbMap)
            {
                await RunAsync(wka, section, asmbMap, asmb, kvp);
            }
        }

        public async Task RunAsync(
            WorkArgs wka,
            ProgramConfig.ProfileSection section,
            Dictionary<string, AssemblyItem> asmbMap,
            ProgramConfig.DotNetCsProject asmb,
            KeyValuePair<string, AssemblyItem> asmbKvp)
        {
            string asmbDirPath = GetAsmbDestnDirPath(wka, asmbKvp);

            foreach (var typeKvp in asmbKvp.Value.TypesMap)
            {
                await RunAsync(wka, section,
                    asmbMap, asmb, asmbKvp,
                    typeKvp, asmbDirPath);
            }
        }

        public async Task RunAsync(
            WorkArgs wka,
            ProgramConfig.ProfileSection section,
            Dictionary<string, AssemblyItem> asmbMap,
            ProgramConfig.DotNetCsProject asmb,
            KeyValuePair<string, AssemblyItem> asmbKvp,
            KeyValuePair<string, TypeItemCoreBase> typeKvp,
            string asmbDirPath)
        {
            string relDirPath = GetTypeDestnRelDirPath(
                wka, typeKvp, out var shortTypeName);
        }

        private string GetAsmbDestnDirPath(
            WorkArgs wka,
            KeyValuePair<string, AssemblyItem> asmbKvp) => Path.Combine(
                wka.PgArgs.Profile.IsTurmerikAssemblyPredicate(asmbKvp.Value.BclItem) switch
                {
                    true => wka.PgArgs.Profile.DestnCsProjectAssembliesDirName,
                    false => wka.PgArgs.Profile.DestnExternalAssemblliesDirName,
                }, asmbKvp.Key);

        private string GetTypeDestnRelDirPath(
            WorkArgs wka,
            KeyValuePair<string, TypeItemCoreBase> typeKvp,
            out string shortTypeName)
        {
            var relNsPartsList = typeKvp.Key.Split('.').ToList();
            shortTypeName = relNsPartsList.Last();
            relNsPartsList.RemoveAt(relNsPartsList.Count - 1);

            var pathPartsList = relNsPartsList.Select(
                part => Path.Combine(
                    wka.PgArgs.Profile.TypesHcyNodeDirName,
                    part)).ToList();

            pathPartsList.Add(Path.Combine(
                shortTypeName,
                wka.PgArgs.Profile.TypesNodeDirName));

            shortTypeName = ReflH.GetTypeDisplayName(shortTypeName, '`');

            string relDirPath = Path.Combine(
                pathPartsList.ToArray());

            return relDirPath;
        }

        private AssemblyLoaderOpts.TypeOpts GetTypeOpts(
            ProgramConfig.DotNetType type)
        {
            var typeOpts = new AssemblyLoaderOpts.TypeOpts
            {
                TypeName = type.Name,
                FullTypeName = type.FullName,
                GenericTypeParamsCount = type.GenericTypeParamsCount,
                LoadPubInstnGetProps = true,
                LoadPubInstnMethods = true,
                DeclaringTypeOpts = type.DeclaringType?.With(GetTypeOpts)
            };

            return typeOpts;
        }

        public class WorkArgs
        {
            public ProgramArgs PgArgs { get; set; }
        }
    }
}
