using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.LocalDeviceEnv;
using System.Reflection;
using System.IO;
using System.Reflection.PortableExecutable;
using System.Reflection.Metadata;
using Turmerik.Core.Utility;
using Turmerik.NetCore.Utility;
using Turmerik.NetCore.Utility.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramComponent
    {
        Task RunAsync(
            string[] rawArgs);

        Task RunAsync(
            ProgramArgs args);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly IJsonConversion jsonConversion;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly IAssemblyLoader assemblyLoader;

        public ProgramComponent(
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            IJsonConversion jsonConversion,
            ITextMacrosReplacer textMacrosReplacer,
            IAssemblyLoader assemblyLoader)
        {
            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.assemblyLoader = assemblyLoader ?? throw new ArgumentNullException(
                nameof(assemblyLoader));

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

        private WorkArgs GetWorkArgs(
            ProgramArgs args)
        {
            var wka = new WorkArgs
            {
                PgArgs = args,
                CsProjAssemblies = [],
                ExternalAssemblies = []
            };

            return wka;
        }

        private async Task RunAsync(WorkArgs wka)
        {
            foreach (var section in wka.PgArgs.Sections)
            {
                foreach (var csProj in section.CsProjectsArr)
                {
                    var csProjAsmb = csProj.CsProjectAssembly;

                    await assemblyLoader.LoadAssembliesAsync(new AssemblyLoaderOpts
                    {
                        Config = wka.PgArgs.Config.AssemblyLoaderConfig,
                        LoadAllTypes = csProjAsmb.IncludeAllTypes,
                        AssembliesBaseDirPath = csProj.SrcBuildDirPath,
                        AssembliesToLoad = [new AssemblyLoaderOpts.AssemblyOpts
                        {
                            AssemblyFilePath = csProjAsmb.Paths.SrcPath
                        }],
                        AssembliesCallback = loadedAssembliesResult =>
                        {
                            foreach (var asmb in loadedAssembliesResult.LoadedAssemblies.Concat(
                                loadedAssembliesResult.ReferencedAssemblies))
                            {
                                bool isTurmerikAssembly = wka.PgArgs.Profile.IsTurmerikAssemblyPredicate(
                                    asmb.BclItem!);

                                var assembliesList = isTurmerikAssembly switch
                                {
                                    true => wka.CsProjAssemblies,
                                    _ => wka.ExternalAssemblies
                                };

                                AddAssembly(
                                    assembliesList,
                                    asmb,
                                    isTurmerikAssembly);
                            }
                        }
                    });
                }
            }

            if (wka.PgArgs.RemoveExistingFirst == true)
            {
                foreach (var section in wka.PgArgs.Sections)
                {
                    if (Directory.Exists(section.DirPaths.DestnPath))
                    {
                        Directory.Delete(section.DirPaths.DestnPath, true);
                    }
                }
            }
        }

        private void AddAssembly(
            List<DotNetAssembly> assembliesList,
            DotNetAssembly assembly,
            bool isTurmerikAssembly)
        {
            if (assembly.TypesList != null)
            {
                var existingAssembly = assembliesList.FirstOrDefault(
                    asmb => asmb.BclItem == assembly.BclItem);

                if (existingAssembly == null)
                {
                    assembliesList.Add(assembly);
                }
                else
                {
                    var typesToAdd = assembly.TypesList!.Where(
                        type => assemblyLoader.FindMatching(
                            default, type.BclItem!,
                            existingAssembly.TypesList!) == null).ToArray();

                    existingAssembly.TypesList!.AddRange(typesToAdd);
                }
            }
        }

        private class WorkArgs
        {
            public ProgramArgs PgArgs { get; set; }

            public List<DotNetAssembly> CsProjAssemblies { get; set; }
            public List<DotNetAssembly> ExternalAssemblies { get; set; }
        }
    }
}
