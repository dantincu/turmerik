using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.NetCore.Utility.AssemblyLoading;

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
            DotNetAssembly<DotNetItemData> assembly,
            bool isTurmerikAssembly);

        bool ShouldExportType(DotNetType<DotNetItemData> dotNetType);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly IJsonConversion jsonConversion;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly IAssemblyLoader<DotNetItemData> assemblyLoader;

        public ProgramComponent(
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            IJsonConversion jsonConversion,
            ITextMacrosReplacer textMacrosReplacer,
            IAssemblyLoaderFactory assemblyLoaderFactory)
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
                { typeof(DateTimeOffset).FullName!, "Date" },
                { typeof(Array).FullName, "Array<any>" }
            }.RdnlD();

            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.assemblyLoader = assemblyLoaderFactory.Loader(
                new AssemblyLoaderInstnOpts<DotNetItemData>
                {
                    AssemblyDataFactory = (wka, asmb, item) => new DotNetAssemblyData(),
                    TypeDataFactory = (wka, type, opts, item) =>
                    {
                        string? tsPrimitiveName = (item.FullName != null) switch
                        {
                            true => GetTsPrimitiveName(
                                item.FullName),
                            false => null
                        };

                        bool isRootBaseType = tsPrimitiveName == string.Empty;
                        bool isPrimitive = !string.IsNullOrEmpty(tsPrimitiveName);
                        string typeName = isRootBaseType switch
                        {
                            true => "any",
                            _ => tsPrimitiveName ?? item.Name.Split('`')[0]
                        };

                        return new DotNetTypeData
                        {
                            IsPrimitive = isPrimitive,
                            IsRootBaseType = isRootBaseType,
                            TypeName = typeName,
                        };
                    }
                });
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
                            await assemblyLoader.LoadAssembliesAsync(new AssemblyLoaderOpts<DotNetItemData>
                            {
                                Config = wka.PgArgs.Config.AssemblyLoaderConfig,
                                AssembliesBaseDirPath = csProj.SrcBuildDirPath,
                                AssembliesToLoad = [new AssemblyLoaderOpts<DotNetItemData>.AssemblyOpts
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

                                        (asmb.Data as DotNetAssemblyData).IsTurmerikAssembly = isTurmerikAssembly;
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
            DotNetAssembly<DotNetItemData> assembly,
            bool isTurmerikAssembly)
        {
            var existingAssembly = assembliesList.FirstOrDefault(
                asmb => assemblyLoader.AssembliesAreEqual(
                    assembly.BclItem, asmb.Asmb.BclItem));

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
                        existingAssembly.Asmb.TypesList!, null) == null).ToArray();

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
                    dependentTypesList, dotNetType);

                var tsLinesAggArr = GetTsLinesAggArr(
                    wka, section, asmb, dotNetTypeObj, dependenciesMap);

                var tsCodeLines = GetTsCodeLines(tsLinesAggArr);

                File.WriteAllLines(
                    dotNetTypeObj.DestnFilePath,
                    tsCodeLines.ToArray());
            }
        }

        public bool ShouldExportType(
            DotNetType<DotNetItemData> dotNetType)
        {
            bool retVal = !ReflH.IsSpecialTypeName(
                dotNetType.Name, [ '`' ]) && dotNetType.FullName != null && (
                dotNetType.Data as DotNetTypeData).With(
                        data => data.IsPrimitive != true && data.IsRootBaseType != true);

            return retVal;
        }

        private WorkArgs.TsLinesAgg[] GetTsLinesAggArr(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            WorkArgs.DotNetTypeObj dotNetTypeObj,
            Dictionary<string, WorkArgs.DotNetTypeObj> dependenciesMap)
        {
            var dotNetType = dotNetTypeObj.Type;

            var methodsMx = GroupMethods(
                wka, section, asmb, dotNetType);

            DotNetType<DotNetItemData> baseType = null;

            int idx = 1;

            var overloadedTypesArr = methodsMx.Select(
                (methodsList, i) =>
                {
                    var retType = dotNetType.Clone().ActWith(newType =>
                    {
                        newType.Data = new DotNetTypeData
                        {
                            IsPrimitive = false,
                            TypeName = GetUniquifiedTypeName(
                                dependenciesMap, dotNetType.Data as DotNetTypeData, ref idx),
                        };

                        newType.Properties = [];
                        newType.Methods = methodsList;

                        newType.Interfaces = [];
                        newType.BaseType = baseType ?? dotNetType;
                    });

                    baseType ??= retType;
                    return retType;
                }).ToArray();

            var firstTsLinesAgg = new WorkArgs.TsLinesAgg
            {
                TsImportLines = GetTsImportLines(
                    dotNetTypeObj, dependenciesMap),
                TsIntfDeclrStartLine = GetTsIntfDeclarationLine(
                    wka, section, asmb, dotNetType, dependenciesMap),
                TsPropDeclrLines = GetTsPropDeclarationLines(
                    wka, section, asmb, dotNetType, dependenciesMap)
            };

            var overloadedTypeTsLinesMx = overloadedTypesArr.Select(
                overloadedType => new WorkArgs.TsLinesAgg
                {
                    TsIntfDeclrStartLine = GetTsIntfDeclarationLine(
                        wka, section, asmb, overloadedType, dependenciesMap),
                    TsMethodDeclrLines = GetTsMethodDeclarationLines(
                        wka, section, asmb, overloadedType, dependenciesMap)
                }).ToArray();

            var allTsLinesAggList = firstTsLinesAgg.Lst();
            allTsLinesAggList.AddRange(overloadedTypeTsLinesMx);

            return allTsLinesAggList.ToArray();
        }

        private List<string> GetTsCodeLines(
            WorkArgs.TsLinesAgg[] tsLinesAggArr) => tsLinesAggArr.Select(
                GetTsCodeLines).Aggregate(
                (list1, list2) => list1.ActWith(list => list.AddRange(list2)));

        private List<string> GetTsCodeLines(
            WorkArgs.TsLinesAgg tsLinesAgg)
        {
            var tsLines = tsLinesAgg.TsImportLines?.ToList() ?? [];

            if (tsLinesAgg.TsImportLines != null)
            {
                tsLines.Add("");
            }

            tsLines.Add(tsLinesAgg.TsIntfDeclrStartLine);
            tsLines.AddRange(tsLinesAgg.TsPropDeclrLines ?? []);
            tsLines.AddRange(tsLinesAgg.TsMethodDeclrLines ?? []);
            tsLines.Add("}");
            tsLines.Add("");

            return tsLines;
        }

        private List<string> GetTsImportLines(
            WorkArgs.DotNetTypeObj dotNetTypeObj,
            Dictionary<string, WorkArgs.DotNetTypeObj> dependenciesMap) => dependenciesMap.Select(
            kvp =>
            {
                string importedDep = kvp.Key;
                var dotNettypeData = kvp.Value.Type.Data as DotNetTypeData;

                if (kvp.Key != dotNettypeData.TypeName)
                {
                    importedDep = $"{dotNettypeData.TypeName} as {importedDep}";
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
            DotNetType<DotNetItemData> dotNetType,
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap)
        {
            string tsIntfName = GetTsIntfName(
                wka, section, asmb, dotNetType, true, typesMap);

            var baseTypesList = dotNetType.Interfaces.Select(
                intf => GetTsIntfName(wka, section, asmb, intf, false, typesMap)).ToList();

            dotNetType.BaseType?.ActWith(baseType =>
            {
                (baseType.Data as DotNetTypeData).ActWith(baseTypeData =>
                {
                    if (baseTypeData.IsPrimitive != true && baseTypeData.IsRootBaseType != true)
                    {
                        var baseTypeTsName = GetTsIntfName(
                            wka, section, asmb, baseType, false, typesMap);

                        baseTypesList.Insert(0, baseTypeTsName);
                    }
                });
            });

            if (baseTypesList.Any())
            {
                string baseTypesStr = baseTypesList.Aggregate(
                    (type1, type2) => $"{type1}, {type2}");

                tsIntfName = $"{tsIntfName} extends {baseTypesStr}";
            }

            string intfDeclrLine = $"export interface {tsIntfName} {{";
            return intfDeclrLine;
        }

        private string GetTsIntfName(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType<DotNetItemData> dotNetType,
            bool includeTypeParamConstraints,
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap)
        {
            var dotNetTypeData = dotNetType.Data as DotNetTypeData;
            string tsIntfName = dotNetTypeData!.TypeName;

            if (!includeTypeParamConstraints)
            {
                tsIntfName = GetMappedType(typesMap, dotNetType).Key ?? tsIntfName;
            }

            if (dotNetTypeData.IsPrimitive != true)
            {
                if (dotNetType.IsArrayType == true)
                {
                    tsIntfName = GetTsIntfName(
                        wka, section, asmb,
                        dotNetType.ArrayElementType,
                        false, typesMap);

                    tsIntfName += "[]";
                }
                else if (dotNetType.IsGenericType == true)
                {
                    if (dotNetType.IsNullableType == true)
                    {
                        tsIntfName = GetTsIntfName(
                            wka, section, asmb,
                            dotNetType.GenericTypeArgs.Single().TypeArg,
                            false, typesMap);

                        tsIntfName += "?";
                    }
                    else
                    {
                        var genericTypeArgsPart = GetTsIntfGenericTypeArgsPart(
                            wka, section, asmb, dotNetType,
                            includeTypeParamConstraints, typesMap);

                        if (tsIntfName.Contains('`'))
                        {
                            tsIntfName = tsIntfName.Split('`')[0];
                        }

                        tsIntfName = string.Concat(
                            tsIntfName,
                            genericTypeArgsPart);
                    }
                }
            }

            if (tsIntfName.Contains("Task1"))
            {

            }

            return tsIntfName;
        }

        private string? GetTsIntfGenericTypeArgsPart(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType<DotNetItemData> dotNetType,
            bool includeTypeParamConstraints,
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap) => GetTsIntfGenericTypeArgsPart(
                wka, section, asmb, dotNetType.GenericTypeArgs, includeTypeParamConstraints, typesMap);

        private string? GetTsIntfGenericTypeArgsPart(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            List<GenericTypeArg<DotNetItemData>>? genericTypeArgs,
            bool includeTypeParamConstraints,
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap)
        {
            string? retStr = null;

            var genericTypeArgsArr = genericTypeArgs?.Select(
                genericTypeArg => GetTsIntfGenericTypeArgValue(
                    wka, section, asmb, genericTypeArg,
                includeTypeParamConstraints, typesMap)).ToList();

            if ((genericTypeArgsArr?.Count ?? -1) > 0)
            {
                retStr = genericTypeArgsArr!.Aggregate(
                    (arg1, arg2) => $"{arg1}, {arg2}");

                retStr = $"<{retStr}>";
            }

            return retStr;
        }

        private string GetTsIntfGenericTypeArgValue(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            GenericTypeArg<DotNetItemData> genericTypeArg,
            bool includeTypeParamConstraints,
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap)
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
                        typeParam => GetTsIntfName(wka, section, asmb, typeParam, false, typesMap)).ToArray();

                    var typeParamConstraintsStr = typeParamConstraintsArr.Aggregate(
                        (arg1, arg2) => $"{arg1} | {arg2}");

                    retStr = $"{retStr} extends {typeParamConstraintsStr}";
                }
            }
            else
            {
                var genericTypeArgsPart = GetTsIntfGenericTypeArgsPart(
                    wka, section, asmb, typeArg, false, typesMap);

                retStr += genericTypeArgsPart;
            }

            return retStr;
        }

        private List<string> GetTsPropDeclarationLines(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType<DotNetItemData> dotNetType,
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap) => dotNetType.Properties.Select(
                prop => GetTsPropDeclarationLine(
                    wka, section, asmb, dotNetType, prop, typesMap)).ToList();

        private List<string> GetTsMethodDeclarationLines(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType<DotNetItemData> dotNetType,
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap) => dotNetType.Methods.Select(
                method => GetTsMethodDeclarationLine(
                    wka, section, asmb, dotNetType, method, typesMap)).ToList();

        private List<List<DotNetMethod<DotNetItemData>>> GroupMethods(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType<DotNetItemData> dotNetType)
        {
            var methodsGroup = dotNetType.Methods.GroupBy(
                method => method.Name).Select(
                group => Tuple.Create(
                    group.Key,
                    group.ToList())).ToList();

            var methodsMx = methodsGroup.Where(
                tuple => tuple.Item2.Count == 1).Select(
                tuple => tuple.Item2.Single()).ToList().Lst();

            methodsGroup.RemoveWhere(
                tuple => tuple.Item2.Count == 1);

            while (methodsGroup.Any())
            {
                methodsMx.Add(methodsGroup.Select(
                    tuple => tuple.Item2.First(
                        )).ToList());

                foreach (var tuple in methodsGroup)
                {
                    tuple.Item2.RemoveAt(0);
                }

                methodsGroup.RemoveWhere(
                    tuple => tuple.Item2.None());
            }

            return methodsMx;
        }

        private string GetTsPropDeclarationLine(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType<DotNetItemData> dotNetType,
            DotNetProperty<DotNetItemData> dotNetProp,
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap)
        {
            string propTypeStr = GetTsIntfName(
                wka, section, asmb, dotNetProp.PropType!, false, typesMap);

            string propName = string.Concat(
                wka.PgArgs.Profile.TsTabStr,
                dotNetProp.Name);

            string tsPropStr = $"{propName}: {propTypeStr};";
            return tsPropStr;
        }

        private string GetTsMethodDeclarationLine(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType<DotNetItemData> dotNetType,
            DotNetMethod<DotNetItemData> dotNetMethod,
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap)
        {
            string retTypeStr = dotNetMethod.ReturnType?.With(
                type => GetTsIntfName(
                    wka, section, asmb, type, false, typesMap)) ?? "void";

            var paramsArr = dotNetMethod.Parameters.Select(
                param => string.Join(": ", param.Name, GetTsIntfName(
                    wka, section, asmb, param.ParamType, false, typesMap)));

            var paramsStr = paramsArr.Any() ? paramsArr.Aggregate(
                (arg1, arg2) => $"{arg1}, {arg2}") : "";

            var genericArgsStr = GetTsIntfGenericTypeArgsPart(
                wka, section, asmb, dotNetMethod.GenericParameters, true, typesMap);

            string methodName = string.Concat(
                wka.PgArgs.Profile.TsTabStr,
                dotNetMethod.Name);

            string tsMethodStr = $"{methodName}: {genericArgsStr}({paramsStr}) => {retTypeStr};";
            return tsMethodStr;
        }

        private List<WorkArgs.DotNetTypeObj> GetDependenciesList(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType<DotNetItemData> dotNetType)
        {
            var allDependentTypesList = dotNetType.Interfaces!.SelectMany(
                ExpandDependency).ToList();

            dotNetType.BaseType?.ActWith(baseType =>
            {
                (baseType.Data as DotNetTypeData).ActWith(baseTypeData =>
                {
                    if (baseTypeData.IsPrimitive != true && baseTypeData.IsRootBaseType != true)
                    {
                        allDependentTypesList.AddRange(
                            ExpandDependency(baseType));
                    }
                });
            });

            allDependentTypesList.AddRange(
                dotNetType.GenericTypeArgs?.Where(
                    arg => arg.TypeArg != null).SelectMany(
                    arg => ExpandDependency(arg.TypeArg)) ?? []);

            allDependentTypesList.AddRange(
                dotNetType.Properties.SelectMany(
                    prop => ExpandDependency(prop.PropType)));

            allDependentTypesList.AddRange(
                dotNetType.Methods.SelectMany(
                    method => ExpandDependency(method.ReturnType).Concat(
                        method.Parameters.SelectMany(
                            @param => ExpandDependency(@param.ParamType)).ToArray())));

            allDependentTypesList = allDependentTypesList.NotNull().Where(
                ShouldExportType).SelectMany(ExpandDependency).ToList();

            var dependentTypesList = new List<DotNetType<DotNetItemData>>();

            foreach (var refType in allDependentTypesList.NotNull())
            {
                if (refType.FullName != null && !TypesAreEqual(
                    dotNetType, refType) && dependentTypesList.None(
                        type => TypesAreEqual(
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

        private DotNetType<DotNetItemData>[] ExpandDependency(
            DotNetType<DotNetItemData> type)
        {
            DotNetType<DotNetItemData>[] retArr = (type?.Data as DotNetTypeData)?.With(typeData =>
            {
                DotNetType<DotNetItemData>[] retArr;

                if (typeData.IsRootBaseType != true && typeData.IsPrimitive != true)
                {
                    if (type.IsArrayType == true)
                    {
                        retArr = ExpandDependency(
                            type.ArrayElementType);
                    }
                    else if (type.IsGenericType == true)
                    {
                        if (type.IsNullableType == true)
                        {
                            retArr = ExpandDependency(
                                type.GenericTypeArgs.Single().TypeArg);
                        }
                        else
                        {
                            retArr = type.Arr(type.GenericTypeArgs.Where(
                                type => type.TypeArg != null).SelectMany(
                                type => ExpandDependency(type.TypeArg)).ToArray());
                        }
                    }
                    else
                    {
                        retArr = [type];
                    }
                }
                else
                {
                    retArr = [];
                }

                return retArr;
            }) ?? [];

            return retArr;
        }

        private Dictionary<string, WorkArgs.DotNetTypeObj> MapDependencyNames(
            List<WorkArgs.DotNetTypeObj> typesList,
            DotNetType<DotNetItemData> dotNetType)
        {
            var typesMap = new Dictionary<string, WorkArgs.DotNetTypeObj>();
            var dotNetTypeData = dotNetType.Data as DotNetTypeData;

            foreach (var type in typesList)
            {
                var typeData = type.Type.Data as DotNetTypeData;

                if (typeData.TypeName == dotNetTypeData.TypeName || typesMap.Keys.Contains(
                    typeData.TypeName))
                {
                    int idx = 1;

                    string typeName = GetUniquifiedTypeName(
                        typesMap, typeData, ref idx);

                    typesMap.Add(typeName, type);
                }
                else
                {
                    typesMap.Add(typeData.TypeName, type);
                }
            }

            return typesMap;
        }

        private KeyValuePair<string, WorkArgs.DotNetTypeObj> GetMappedType(
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap,
            DotNetType<DotNetItemData> dotNetType) => typesMap.FirstOrDefault(
                kvp => kvp.Value.Type.With(type =>
                {
                    bool retVal = TypesAreEqual(
                        dotNetType, type);

                    return retVal;
                }));

        private bool TypesAreEqual(
            DotNetType<DotNetItemData> trgType,
            DotNetType<DotNetItemData> refType)
        {
            bool retVal = trgType.Name == refType.Name;

            retVal = retVal && trgType.FullName == refType.FullName;
            retVal = retVal && trgType.Namespace == refType.Namespace;

            return retVal;
        }

        private string GetUniquifiedTypeName(
            Dictionary<string, WorkArgs.DotNetTypeObj> typesMap,
            DotNetTypeData dotNetTypeData,
            ref int idx) => GetUniquifiedTypeName(
                typesMap, dotNetTypeData,
                (map, name) => map.Keys.Contains(name),
                ref idx);

        private string GetUniquifiedTypeName<TTypesMap>(
            TTypesMap typesMap,
            DotNetTypeData dotNetTypeData,
            Func<TTypesMap, string, bool> containsNamePredicate,
            ref int idx)
        {
            string typeName = GetUniquifiedTypeName(
                dotNetTypeData.TypeName, ref idx);

            while (typeName == dotNetTypeData.TypeName || containsNamePredicate(typesMap, typeName))
            {
                typeName = GetUniquifiedTypeName(
                    dotNetTypeData.TypeName, ref idx);
            }

            return typeName;
        }

        private string GetRelFilePath(
            WorkArgs.DotNetTypeObj dotNetTypeObj,
            WorkArgs.DotNetTypeObj dependencyTypeObj)
        {
            var typePathParts = dotNetTypeObj.DestnFilePath.Split(['/', '\\']).ToList();
            var dependencyTypePathParts = dependencyTypeObj.DestnFilePath.Split(['/', '\\']).ToList();

            int typePathPartsLen = typePathParts.Count;
            int dependantTypePathPartsLen = dependencyTypePathParts.Count;

            int maxCount = Math.Min(typePathPartsLen, dependantTypePathPartsLen);

            for (int i = 0; i < maxCount; i++)
            {
                if (typePathParts.First() == dependencyTypePathParts.First())
                {
                    typePathParts.RemoveAt(0);
                    dependencyTypePathParts.RemoveAt(0);
                }
                else
                {
                    break;
                }
            }

            string typePath = Path.Combine(
                typePathParts.Select(
                    (part, i) => i == 0 ? "." : "..").Concat(
                    dependencyTypePathParts).ToArray());

            return typePath;
        }

        private string GetUniquifiedTypeName(
            WorkArgs.DotNetTypeObj type,
            ref int uniqueIdx) => GetUniquifiedTypeName(
                type.Type.Name,
                ref uniqueIdx);

        private string GetUniquifiedTypeName(
            string typeName,
            ref int uniqueIdx) => string.Format(
                "{0}_{1}",
                typeName,
                uniqueIdx++);

        private AssemblyLoaderOpts<DotNetItemData>.TypeOpts GetTypeOpts(
            ProgramConfig.DotNetType type)
        {
            var typeOpts = new AssemblyLoaderOpts<DotNetItemData>.TypeOpts
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
            DotNetType<DotNetItemData> dotNetType) => new WorkArgs.DotNetTypeObj
            {
                Type = dotNetType,
                DestnFilePath = ShouldExportType(dotNetType) ? GetDestnFilePath(
                    wka, section, asmb, dotNetType) : null
            };

        private string GetDestnFilePath(
            WorkArgs wka,
            WorkArgs.Section section,
            WorkArgs.DotNetAssemblyObj asmb,
            DotNetType<DotNetItemData> dotNetType)
        {
            string destnDirPath = GetDestnAsmbDirPath(
                wka, section, dotNetType.Assembly);

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
            DotNetAssembly<DotNetItemData> asmb)
        {
            var assembliesDirName = GetAssembliesDirName(wka, asmb);

            string destnDirPath = Path.Combine(
                section.PfSection.DirPaths.DestnPath,
                assembliesDirName,
                asmb.Name ?? throw new InvalidOperationException(
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

            if (tsRelFilePathParts.Any())
            {
                tsRelFilePathParts = tsRelFilePathParts.Prepend(
                    args.Profile.TypesHcyNodeDirName);
            }
            else
            {
                tsRelFilePathParts = [args.Profile.TypesNodeDirName];
            }

            tsRelFilePathParts = tsRelFilePathParts.Concat(
                [$"{typeName}.ts"]);

            var tsRelFilePath = Path.Combine(
                tsRelFilePathParts.ToArray());

            return tsRelFilePath;
        }

        private string GetAssembliesDirName(
            WorkArgs wka,
            DotNetAssembly<DotNetItemData> asmb) => (asmb.Data as DotNetAssemblyData).IsTurmerikAssembly switch
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

                public List<AssemblyLoader<DotNetItemData>.WorkArgs> AsmbLoaderWkasList { get; set; }
            }

            public class DotNetAssemblyObj
            {
                public bool IsTurmerikAssembly { get; set; }
                public DotNetAssembly<DotNetItemData> Asmb { get; set; }
                public List<DotNetTypeObj> TypesList { get; set; }
            }

            public class DotNetTypeObj
            {
                public DotNetType<DotNetItemData> Type { get; set; }

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
