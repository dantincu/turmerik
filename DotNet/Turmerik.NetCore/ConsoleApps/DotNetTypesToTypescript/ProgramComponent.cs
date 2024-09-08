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
using Json.Schema;
using System.Collections.ObjectModel;
using System.Management.Automation.Language;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public interface IProgramComponent
    {
        ReadOnlyDictionary<string, string> DotNetPrimitiveTypesMap { get; }

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

        bool ShouldExportType(DotNetType dotNetType);
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
            DotNetPrimitiveTypesMap = new Dictionary<string, string>
            {
                { typeof(object).FullName!, "" },
                { typeof(string).FullName!, "string" },
                { typeof(byte).FullName!, "number" },
                { typeof(sbyte).FullName!, "number" },
                { typeof(short).FullName!, "number" },
                { typeof(ushort).FullName!, "number" },
                { typeof(int).FullName!, "number" },
                { typeof(uint).FullName!, "number" },
                { typeof(long).FullName!, "number" },
                { typeof(ulong).FullName!, "number" },
                { typeof(decimal).FullName!, "number" },
                { typeof(float).FullName!, "number" },
                { typeof(double).FullName!, "number" },
                { typeof(bool).FullName!, "boolean" },
                { typeof(DateTime).FullName!, "Date" },
                { typeof(DateTimeOffset).FullName!, "Date" }
            }.RdnlD();

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

        public ReadOnlyDictionary<string, string> DotNetPrimitiveTypesMap { get; }

        public string? GetTsPrimitiveName(
            string dotNetFullName)
        {
            if (!DotNetPrimitiveTypesMap.TryGetValue(
                dotNetFullName, out var tsPrimitiveName))
            {
                tsPrimitiveName = null;
            }

            return tsPrimitiveName;
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
                                        GetTypeOpts).ToList()!
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
                var dotNetType = dotNetTypeObj.Type;
                string destnFilePath = dotNetTypeObj.DestnFilePath;

                string destnDirPath = Path.GetDirectoryName(destnFilePath);
                Directory.CreateDirectory(destnDirPath);

                var dependentTypesList = GetDependenciesList(
                    wka, section, asmb, dotNetType);

                var dependenciesMap = MapDependencyNames(
                    dependentTypesList);

                var tsLinesAgg = new WorkArgs.TsLinesAgg
                {
                    TsImportLines = GetTsImportLines(
                        dotNetTypeObj,
                        dependenciesMap),
                    TsIntfDeclrStartLine = GetTsIntfDeclarationLine(
                        wka, section, asmb, dotNetTypeObj),
                    TsPropDeclrLines = GetTsPropDeclarationLines(
                        wka, section, asmb, dotNetType),
                    TsMethodDeclrLines = GetTsMethodDeclarationLines(
                        wka, section, asmb, dotNetType),
                };

                var tsCodeLines = GetTsCodeLines(tsLinesAgg);

                File.WriteAllLines(
                    dotNetTypeObj.DestnFilePath,
                    tsCodeLines.ToArray());
            }
        }

        public bool ShouldExportType(
            DotNetType dotNetType) => ReflH.IsSpecialTypeName(
                dotNetType.Name) && dotNetType.FullName != null && GetTsPrimitiveName(
                    dotNetType.FullName) == null;

        private List<string> GetTsCodeLines(
            WorkArgs.TsLinesAgg tsLinesAgg)
        {
            var tsLines = tsLinesAgg.TsImportLines.ToList();

            tsLines.Add("");
            tsLines.Add(tsLinesAgg.TsIntfDeclrStartLine);
            tsLines.AddRange(tsLinesAgg.TsPropDeclrLines);
            tsLines.AddRange(tsLinesAgg.TsMethodDeclrLines);
            tsLines.Add("}");

            return tsLines;
        }

        private List<string> GetTsImportLines(
            WorkArgs.DotNetTypeObj dotNetTypeObj,
            Dictionary<string, WorkArgs.DotNetTypeObj> dependenciesMap) => dependenciesMap.Select(
            kvp =>
            {
                string importedDep = kvp.Key;

                if (kvp.Key != kvp.Value.Type.Name)
                {
                    importedDep = $"{kvp.Value.Type.Name} as {importedDep}";
                }

                string relFilePath = GetRelFilePath(
                    dotNetTypeObj,
                    kvp.Value).Replace("\\", "\\\\");

                string importLine = $"import {{ {importedDep} }} from \"{relFilePath}\";";
                return importLine;
            }).ToList();

        private string GetTsIntfDeclarationLine(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            WorkArgs.DotNetTypeObj dotNetTypeObj)
        {
            string tsIntfName = GetTsIntfName(
                wka, section, asmb, dotNetTypeObj.Type, true);

            string intfDeclrLine = $"export interface {tsIntfName} {{";
            return intfDeclrLine;
        }

        private string GetTsIntfName(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType,
            bool includeTypeParamConstraints)
        {
            var genericTypeArgsPart = GetTsIntfGenericTypeArgsPart(
                wka, section, asmb, dotNetType,
            includeTypeParamConstraints);

            string typeName = dotNetType.Name;

            if (typeName.Contains('`'))
            {
                typeName = typeName.Split('`')[0];
            }

            string tsIntfName = string.Concat(
                typeName,
                genericTypeArgsPart);

            return tsIntfName;
        }

        private string? GetTsIntfGenericTypeArgsPart(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType,
            bool includeTypeParamConstraints)
        {
            string? retStr = null;

            var genericTypeArgs = dotNetType.GenericTypeArgs?.Select(
                genericTypeArg => GetTsIntfGenericTypeArgValue(
                    wka, section, asmb, dotNetType, genericTypeArg,
                includeTypeParamConstraints)).ToList();

            if ((genericTypeArgs?.Count ?? -1) > 0)
            {
                retStr = genericTypeArgs!.Aggregate(
                    (arg1, arg2) => $"{arg1}, {arg2}");

                retStr = $"<{retStr}>";
            }

            return retStr;
        }

        private string GetTsIntfGenericTypeArgValue(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType,
            GenericTypeArg genericTypeArg,
            bool includeTypeParamConstraints)
        {
            var typeArg = genericTypeArg.TypeArg;
            string retStr = typeArg.Name;

            if (ReflH.IsSpecialTypeName(retStr))
            {
                retStr = ReflH.RemoveInvalidCharsFromTypeName(retStr);
            }

            if (includeTypeParamConstraints)
            {
                if ((genericTypeArg.TypeParamConstraints?.Count ?? -1) > 0)
                {
                    var typeParamConstraintsArr = genericTypeArg.TypeParamConstraints.Select(
                        typeParam => GetTsIntfName(wka, section, asmb, typeParam, false)).ToArray();

                    var typeParamConstraintsStr = typeParamConstraintsArr.Aggregate(
                        (arg1, arg2) => $"{arg1} | {arg2}");

                    retStr = $"{retStr} extends {typeParamConstraintsStr}";
                }
            }
            else
            {
                var genericTypeArgsPart = GetTsIntfGenericTypeArgsPart(
                    wka, section, asmb, typeArg, false);

                retStr += genericTypeArgsPart;
            }

            return retStr;
        }

        private List<string> GetTsPropDeclarationLines(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType) => dotNetType.Properties.Select(
                prop => GetTsPropDeclarationLine(
                    wka, section, asmb, dotNetType, prop)).ToList();

        private List<string> GetTsMethodDeclarationLines(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType) => dotNetType.Methods.Select(
                method => GetTsMethodDeclarationLine(
                    wka, section, asmb, dotNetType, method)).ToList();

        private string GetTsPropDeclarationLine(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType,
            DotNetProperty dotNetProp)
        {
            string propTypeStr = GetTsIntfName(
                wka, section, asmb, dotNetProp.PropType!, false);

            string tsPropStr = $"{wka.PgArgs.Profile.TsTabStr}{dotNetProp.Name}: {propTypeStr}";
            return tsPropStr;
        }

        private string GetTsMethodDeclarationLine(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType,
            DotNetMethod dotNetMethod)
        {
            string retTypeStr = dotNetMethod.ReturnType?.With(
                type => GetTsIntfName(
                    wka, section, asmb, type, false)) ?? "void";

            var paramsArr = dotNetMethod.Parameters.Select(
                param => string.Join(": ", param.Name, GetTsIntfName(
                    wka, section, asmb, param.ParamType, false)));

            var paramsStr = paramsArr.Any() ? paramsArr.Aggregate(
                (arg1, arg2) => $"{arg1}, {arg2}") : "";

            string tsMethodStr = $"{wka.PgArgs.Profile.TsTabStr}{dotNetMethod.Name}: ({paramsStr}) => {retTypeStr}";
            return tsMethodStr;
        }

        private List<WorkArgs.DotNetTypeObj> GetDependenciesList(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType dotNetType)
        {
            var allDependentTypesArr = dotNetType.GenericTypeArgs?.Where(
                arg => arg.TypeArg != null).Select(
                arg => arg.TypeArg).ToArray() ?? [];

            allDependentTypesArr = allDependentTypesArr.Concat(
                dotNetType.Properties.Select(
                    prop => prop.PropType)).ToArray();

            allDependentTypesArr = allDependentTypesArr.Concat(
                dotNetType.Methods.SelectMany(
                    method => method.ReturnType.Arr(
                        method.Parameters.Select(
                            @param => @param.ParamType).ToArray()))).ToArray();

            allDependentTypesArr = allDependentTypesArr.NotNull().Where(
                ShouldExportType).SelectMany(ExpandDependency).ToArray();

            var dependentTypesList = new List<DotNetType>();

            foreach (var refType in allDependentTypesArr.NotNull())
            {
                if (refType.FullName != null && dependentTypesList.None(
                    type => assemblyLoader.TypesAreEqual(
                        type, refType)))
                {
                    dependentTypesList.Add(refType);
                }
            }

            dependentTypesList.Sort(
                (@ref, trg) => @ref.FullName.CompareTo(
                    trg.FullName));

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
                DeclaringTypeOpts = type.DeclaringType?.With(GetTypeOpts)
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
                DestnFilePath = ShouldExportType(dotNetType) ? GetDestnFilePath(
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
                wka.PgArgs, dotNetType.RelNsPartsArr, dotNetType.Name);

            destnPath = Path.Combine(
                destnDirPath,
                dotNetType.NsStartsWithAsmbPfx switch
                {
                    true => wka.PgArgs.Profile.AssemblyDfNsTypesDirName,
                    _ => wka.PgArgs.Profile.AssemblyNonDfNsTypesDirName
                },
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

            if (typeName.Contains('`'))
            {
                typeName = typeName.Split('`')[0];
            }

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

            public class TsLinesAgg
            {
                public List<string> TsImportLines { get; set; }
                public string TsIntfDeclrStartLine { get; set; }
                public List<string> TsPropDeclrLines { get; set; }
                public List<string> TsMethodDeclrLines { get; set; }
            }
        }
    }
}
