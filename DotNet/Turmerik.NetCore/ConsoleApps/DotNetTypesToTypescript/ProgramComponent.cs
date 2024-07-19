﻿using System;
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

        ProgramComponent.WorkArgs GetWorkArgs(
            ProgramArgs args);

        Task RunAsync(
            ProgramComponent.WorkArgs wka);

        void AddAssembly(
            List<DotNetAssembly> assembliesList,
            DotNetAssembly assembly,
            bool isTurmerikAssembly);
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

        public WorkArgs GetWorkArgs(
            ProgramArgs args)
        {
            var wka = new WorkArgs
            {
                PgArgs = args,
                CsProjAssemblies = [],
                ExternalAssemblies = [],
                AsmbLoaderWkasList = []
            };

            return wka;
        }

        public async Task RunAsync(WorkArgs wka)
        {
            try
            {
                foreach (var section in wka.PgArgs.Sections)
                {
                    foreach (var csProj in section.CsProjectsArr)
                    {
                        var csProjAsmb = csProj.CsProjectAssembly;

                        wka.AsmbLoaderWkasList.Add(await assemblyLoader.LoadAssembliesAsync(new AssemblyLoaderOpts
                        {
                            Config = wka.PgArgs.Config.AssemblyLoaderConfig,
                            AssembliesBaseDirPath = csProj.SrcBuildDirPath,
                            AssembliesToLoad = [new AssemblyLoaderOpts.AssemblyOpts
                            {
                                AssemblyFilePath = csProjAsmb.Paths.SrcPath,
                                LoadAllTypes = csProjAsmb.IncludeAllTypes,
                                TypesToLoad = csProjAsmb.TypesArr?.Select(
                                    type => GetTypeOpts(type)).ToList()!
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

                                return true;
                            }
                        }));
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
            finally
            {
                foreach (var asmbLoaderWka in wka.AsmbLoaderWkasList)
                {
                    asmbLoaderWka.MetadataLoadContext!.Dispose();
                }
            }
        }

        public void AddAssembly(
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
                DeclaringTypeOpts = type.DeclaringType?.With(
                    declaringType => GetTypeOpts(
                        declaringType))
            };

            return typeOpts;
        }

        public class WorkArgs
        {
            public ProgramArgs PgArgs { get; set; }

            public List<DotNetAssembly> CsProjAssemblies { get; set; }
            public List<DotNetAssembly> ExternalAssemblies { get; set; }

            public List<AssemblyLoader.WorkArgs> AsmbLoaderWkasList { get; set; }
        }
    }
}
