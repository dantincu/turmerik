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
using Json.Schema;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramComponent
    {
        Task RunAsync(
            string[] rawArgs);

        Task RunAsync(
            ProgramArgs args);

        Task RunAsync(
            ProgramComponent.WorkArgs wka);

        Task RunAsync(
            ProgramComponent.WorkArgs wka,
            ProgramComponent.WorkArgs.Section section);

        Task RunAsync(
            ProgramComponent.WorkArgs wka,
            ProgramComponent.WorkArgs.Section section,
            ProgramComponent.WorkArgs.DotNetAssemblyObj asmb);

        Task RunAsync(
            ProgramComponent.WorkArgs wka,
            ProgramComponent.WorkArgs.Section section,
            ProgramComponent.WorkArgs.DotNetAssemblyObj asmb,
            ProgramComponent.WorkArgs.DotNetTypeObj dotNetType);

        ProgramComponent.WorkArgs GetWorkArgs(
            ProgramArgs args);

        void AddAssembly(
            ProgramComponent.WorkArgs wka,
            ProgramComponent.WorkArgs.Section section,
            List<ProgramComponent.WorkArgs.DotNetAssemblyObj> assembliesList,
            ProgramConfig.DotNetAssembly pfAsmb,
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
                Sections = []
            };

            return wka;
        }

        public async Task RunAsync(WorkArgs wka)
        {
            try
            {
                foreach (var pfSection in wka.PgArgs.Sections)
                {
                    var section = new WorkArgs.Section
                    {
                        PfSection = pfSection,
                        Assemblies = [],
                        AsmbLoaderWkasList = []
                    };

                    wka.Sections.Add(section);

                    foreach (var csProj in pfSection.CsProjectsArr)
                    {
                        var csProjAsmb = csProj.CsProjectAssembly;

                        section.AsmbLoaderWkasList.Add(
                            await assemblyLoader.LoadAssembliesAsync(new AssemblyLoaderOpts
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
                                    foreach (var asmb in loadedAssembliesResult.LoadedAssemblies)
                                    {
                                        bool isTurmerikAssembly = wka.PgArgs.Profile.IsTurmerikAssemblyPredicate(
                                            asmb.BclItem!);

                                        var assembliesList = section.Assemblies;

                                        AddAssembly(
                                            wka,
                                            section,
                                            assembliesList,
                                            csProjAsmb,
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
                        if (Directory.Exists(
                            section.DirPaths.DestnPath))
                        {
                            Directory.Delete(
                                section.DirPaths.DestnPath, true);
                        }
                    }
                }

                foreach (var section in wka.Sections)
                {
                    Directory.CreateDirectory(
                        section.PfSection.DirPaths.DestnPath);

                    await RunAsync(wka, section);
                }
            }
            finally
            {
                foreach (var section in wka.Sections)
                {
                    foreach (var asmbLoaderWka in section.AsmbLoaderWkasList)
                    {
                        asmbLoaderWka.MetadataLoadContext!.Dispose();
                    }
                }
            }
        }

        public void AddAssembly(
            WorkArgs wka,
            WorkArgs.Section section,
            List<WorkArgs.DotNetAssemblyObj> assembliesList,
            ProgramConfig.DotNetAssembly pfAsmb,
            DotNetAssembly assembly,
            bool isTurmerikAssembly)
        {
            var existingAssembly = assembliesList.FirstOrDefault(
                asmb => assemblyLoader.AssembliesAreEqual(
                    assembly.BclItem,
                    asmb.Asmb.BclItem));

            if (existingAssembly == null)
            {
                var assemblyObj = new WorkArgs.DotNetAssemblyObj
                {
                    IsTurmerikAssembly = isTurmerikAssembly,
                    Asmb = assembly,
                };

                assembliesList.Add(assemblyObj);

                assemblyObj.TypesList = assembly.TypesList.Select(
                    type => GetDotNetTypeObj(
                        wka, section, assemblyObj, type)).ToList();
            }
            else
            {
                var typesToAdd = assembly.TypesList!.Where(
                    type => assemblyLoader.FindMatching(
                        default, type.BclItem!,
                        existingAssembly.Asmb.TypesList!) == null).ToArray();

                existingAssembly.Asmb.TypesList!.AddRange(typesToAdd);

                existingAssembly.TypesList.AddRange(typesToAdd.Select(
                    type => GetDotNetTypeObj(
                        wka, section, existingAssembly, type)));
            }
        }

        public async Task RunAsync(
            WorkArgs wka,
            WorkArgs.Section section)
        {
            foreach (var asmb in section.Assemblies)
            {
                await RunAsync(wka, section, asmb);
            }
        }

        public async Task RunAsync(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb)
        {
            foreach (var type in asmb.TypesList)
            {
                await RunAsync(wka, section, asmb, type);
            }
        }

        public async Task RunAsync(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            WorkArgs.DotNetTypeObj dotNetTypeObj)
        {
            if (dotNetTypeObj.DestnFilePath != null)
            {
                string destnFilePath = dotNetTypeObj.DestnFilePath;

                string destnDirPath = Path.GetDirectoryName(destnFilePath);
                Directory.CreateDirectory(destnDirPath);

                var dependentTypesList = GetDependenciesList(
                    wka, section, asmb, dotNetTypeObj);

                var dependenciesMap = MapDependencyNames(
                    dependentTypesList);

                var importLines = dependenciesMap.Select(
                    kvp =>
                    {
                        string importedDep = kvp.Key;

                        if (kvp.Key != kvp.Value.Type.Name)
                        {
                            importedDep = $"{kvp.Value.Type.Name} as {importedDep}";
                        }

                        string relFilePath = GetRelFilePath(
                            dotNetTypeObj,
                            kvp.Value);

                        string importLine = $"import {{ {importedDep} }} from \"{relFilePath}\";";
                        return importLine;
                    }).ToList();
            }
        }

        private List<WorkArgs.DotNetTypeObj> GetDependenciesList(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            WorkArgs.DotNetTypeObj dotNetTypeObj)
        {
            var allDependentTypesArr = (dotNetTypeObj.Type.GenericTypeArgs?.Where(
                arg => arg.TypeArg != null).Select(
                arg => arg.TypeArg) ?? []).Concat(
                    dotNetTypeObj.Type.Properties.Select(
                        prop => prop.PropType).Concat(
                        dotNetTypeObj.Type.Methods.SelectMany(
                            method => method.ReturnType.Arr(
                                method.Parameters.Select(
                                    @param => @param.ParamType).ToArray(
                                    ))))).SelectMany(ExpandDependency).ToArray();

            var dependentTypesList = new List<DotNetType>();

            foreach (var refType in allDependentTypesArr.NotNull())
            {
                if (dependentTypesList.None(
                    type => assemblyLoader.TypesAreEqual(
                        type, refType)))
                {
                    dependentTypesList.Add(refType);
                }
            }

            dependentTypesList.Sort(
                (@ref, trg) => @ref.FullName?.CompareTo(
                    trg.FullName) ?? (trg.FullName is null ? 0 : -1));

            var retTypesList = dependentTypesList.Select(
                type => new WorkArgs.DotNetTypeObj
                {
                    Type = type,
                    DestnFilePath = GetDestnFilePath(
                        wka, section, asmb, type)
                }).ToList();

            return retTypesList;
        }

        private DotNetType[] ExpandDependency(
            DotNetType type)
        {
            DotNetType[] retArr;

            if (type.IsGenericType == true)
            {
                if (type.IsNullableType == true)
                {
                    retArr = ExpandDependency(
                        type.GenericTypeArgs.Single().TypeArg);
                }
                else
                {
                    retArr = type.GenericTypeArgs.Where(
                        type => type.TypeArg != null).SelectMany(
                        type => ExpandDependency(type.TypeArg)).ToArray();
                }
            }
            else if (type.IsArrayType == true)
            {
                retArr = ExpandDependency(
                    type.ArrayElementType);
            }
            else
            {
                retArr = [type];
            }

            return retArr;
        }

        private Dictionary<string, WorkArgs.DotNetTypeObj> MapDependencyNames(
            List<WorkArgs.DotNetTypeObj> typesList)
        {
            var typesMap = new Dictionary<string, WorkArgs.DotNetTypeObj>();

            foreach (var type in typesList)
            {
                if (typesMap.Keys.Contains(type.Type.Name))
                {
                    int idx = 1;

                    string typeName = GetUniquifiedTypeName(
                        type, idx);

                    while (typesMap.Keys.Contains(typeName))
                    {
                        idx++;

                        typeName = GetUniquifiedTypeName(
                            type, idx);
                    }

                    typesMap.Add(typeName, type);
                }
                else
                {
                    typesMap.Add(type.Type.Name, type);
                }
            }

            return typesMap;
        }

        private string GetRelFilePath(
            WorkArgs.DotNetTypeObj dotNetTypeObj,
            WorkArgs.DotNetTypeObj dependantTypeObj)
        {
            var typePathParts = dotNetTypeObj.DestnFilePath.Split(['/', '\\']).ToList();
            var dependantTypePathParts = dependantTypeObj.DestnFilePath.Split(['/', '\\']).ToList();

            int typePathPartsLen = typePathParts.Count;
            int dependantTypePathPartsLen = dependantTypePathParts.Count;

            int maxCount = Math.Min(typePathPartsLen, dependantTypePathPartsLen);

            for (int i = 0; i < maxCount; i++)
            {
                if (typePathParts.First() == dependantTypePathParts.First())
                {
                    typePathParts.RemoveAt(0);
                    dependantTypePathParts.RemoveAt(0);
                }
                else
                {
                    break;
                }
            }

            string typePath = Path.Combine(
                typePathParts.Select(
                    part => "..").Concat(
                    dependantTypePathParts).ToArray());

            return typePath;
        }

        private string GetUniquifiedTypeName(
            WorkArgs.DotNetTypeObj type,
            int uniqueIdx) => string.Format(
                "{0}_{1}",
                type.Type.Name,
                uniqueIdx);

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

        private WorkArgs.DotNetTypeObj GetDotNetTypeObj(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType) => new WorkArgs.DotNetTypeObj
            {
                Type = dotNetType,
                DestnFilePath = dotNetType.FullName != null ? GetDestnFilePath(
                    wka, section, asmb, dotNetType) : null
            };

        private string GetDestnFilePath(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType)
        {
            string destnDirPath = GetDestnAsmbDirPath(
                wka, section, asmb);

            var destnPath = GetDefaultTsRelFilePath(
                wka.PgArgs, dotNetType.RelNsPartsArr?.Reverse(
                    ).Skip(1).Reverse().ToArray(), dotNetType.Name);

            destnPath = Path.Combine(
                destnDirPath,
                destnPath);

            return destnPath;
        }

        private string GetDestnAsmbDirPath(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb)
        {
            var assembliesDirName = GetAssembliesDirName(wka, asmb);

            string destnDirPath = Path.Combine(
                section.PfSection.DirPaths.DestnPath,
                assembliesDirName,
                asmb.Asmb.Name ?? throw new InvalidOperationException(
                    $"Assembly name should not be null"));

            return destnDirPath;
        }

        private string GetDefaultTsRelFilePath(
            ProgramArgs args,
            string[] relNsPartsArr,
            string typeName)
        {
            var relNsPartsCount = relNsPartsArr.Length;

            Func<string, int, string> tsRelFilePathPartNameFactory = (
                part, idx) => (relNsPartsCount - idx > 1) switch
                {
                    true => args.Profile.TypesHcyNodeDirName,
                    false => args.Profile.TypesNodeDirName
                };

            Func<string, int, IEnumerable<string>> tsRelFilePathPartSelector = (
                part, idx) => [part, tsRelFilePathPartNameFactory(part, idx)];

            var tsRelFilePathParts = relNsPartsArr.SelectMany(
                    tsRelFilePathPartSelector);

            tsRelFilePathParts = tsRelFilePathParts.Concat(
                [$"{typeName}.ts"]);

            var tsRelFilePath = Path.Combine(
                tsRelFilePathParts.ToArray());

            return tsRelFilePath;
        }

        private string GetAssembliesDirName(
            WorkArgs wka,
            WorkArgs.DotNetAssemblyObj asmb) => asmb.IsTurmerikAssembly switch
            {
                true => wka.PgArgs.Profile.DestnCsProjectAssembliesDirName,
                false => wka.PgArgs.Profile.DestnExternalAssemblliesDirName,
            };

        public class WorkArgs
        {
            public ProgramArgs PgArgs { get; set; }
            public List<Section> Sections { get; set; }

            public class Section
            {
                public ProgramConfig.ProfileSection PfSection { get; set; }
                public List<DotNetAssemblyObj> Assemblies { get; set; }

                public List<AssemblyLoader.WorkArgs> AsmbLoaderWkasList { get; set; }
            }

            public class DotNetAssemblyObj
            {
                public bool IsTurmerikAssembly { get; set; }
                public DotNetAssembly Asmb { get; set; }
                public List<DotNetTypeObj> TypesList { get; set; }
            }

            public class DotNetTypeObj
            {
                public DotNetType Type { get; set; }
                
                public string DestnFilePath { get; set; }
            }
        }
    }
}
