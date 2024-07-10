using Microsoft.PowerShell.Commands;
using System.Reflection;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using static Turmerik.NetCore.Utility.AssemblyLoading.AssemblyLoaderOpts;

namespace Turmerik.NetCore.Utility.AssemblyLoading
{
    public interface IAssemblyLoader
    {
        AssemblyLoaderConfig NormalizeConfig(
            AssemblyLoaderConfig config);

        Task<AssemblyLoaderOpts> NormalizeOptsAsync(
            AssemblyLoaderOpts opts);

        Task<List<string>> GetAllAssembliesFilePathsAsync(
            string assembliesBaseDirPath);

        Task<AssemblyLoader.WorkArgs> LoadAssembliesAsync(
            AssemblyLoaderOpts opts);

        DotNetAssembly ConvertAssembly(
            AssemblyLoader.WorkArgs wka,
            bool isReferencedAssembly = false);

        DotNetAssemblyName ConvertAssemblyName(
            AssemblyName asmbObjName);

        DotNetAssemblyVersion ConvertAssemblyVersion(
            Version asmbObjVersion);

        DotNetType ConvertAssemblyType(
            AssemblyLoader.WorkArgs wka,
            bool isReferencedType = false);

        DotNetProperty ConvertDotNetProperty(
            AssemblyLoader.WorkArgs wka,
            PropertyInfo propInfo);

        DotNetMethod ConvertDotNetMethod(
            AssemblyLoader.WorkArgs wka,
            MethodInfo methodInfo);

        DotNetConstructor ConvertDotNetConstructor(
            AssemblyLoader.WorkArgs wka,
            ConstructorInfo constructorInfo);

        DotNetMethodParameter ConvertDotNetParameter(
            AssemblyLoader.WorkArgs wka,
            ParameterInfo paramInfo);

        GenericTypeArg ConvertGenericTypeArg(
            AssemblyLoader.WorkArgs wka,
            Type genericTypeArg);

        Type GetTypeObj(
            AssemblyLoader.WorkArgs wka);

        TypeOpts GetTypeOpts(
            AssemblyLoader.WorkArgs wka);

        string GetAssemblyExtension(
            AssemblyOpts asmbOpts);

        string GetAssemblyFileName(
            AssemblyOpts asmbOpts);

        string GetAssemblyFilePath(
            AssemblyLoaderOpts opts,
            AssemblyOpts asmbOpts);
    }

    public class AssemblyLoader : IAssemblyLoader
    {
        public const string NET_STD_ASMB_FILE_NAME = "netstandard.dll";

        private readonly string coreLibLocation = typeof(object).Assembly.Location;
        private readonly string coreLibName = typeof(object).Assembly.GetName().Name;

        private readonly IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever;

        public AssemblyLoader(
            IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever)
        {
            this.filteredDriveEntriesRetriever = filteredDriveEntriesRetriever ?? throw new ArgumentNullException(
                nameof(filteredDriveEntriesRetriever));
        }

        public AssemblyLoaderConfig NormalizeConfig(
            AssemblyLoaderConfig cfg)
        {
            cfg = new AssemblyLoaderConfig
            {
                NetStandard2p1LibDirLocation = cfg.NetStandard2p1LibDirLocation,
                NetStandard2p1LibFileLocation = cfg.NetStandard2p1LibFileLocation,
                UseNetStandard2p1 = cfg.UseNetStandard2p1 ?? true
            };

            cfg.NetStandard2p1LibDirLocation ??= Path.GetDirectoryName(
                cfg.NetStandard2p1LibFileLocation ??= NET_STD_ASMB_FILE_NAME) ?? throw new ArgumentException(
                    nameof(cfg.NetStandard2p1LibDirLocation));

            cfg.NetStandard2p1LibFileLocation = NormPathH.AssurePathIsRooted(
                cfg.NetStandard2p1LibFileLocation,
                () => cfg.NetStandard2p1LibDirLocation);

            return cfg;
        }

        public async Task<AssemblyLoaderOpts> NormalizeOptsAsync(
            AssemblyLoaderOpts opts)
        {
            opts = new AssemblyLoaderOpts
            {
                Config = opts.Config.With(NormalizeConfig),
                AssembliesBaseDirPath = opts.AssembliesBaseDirPath,
                AllAssembliesFilePaths = opts.AllAssembliesFilePaths ?? await GetAllAssembliesFilePathsAsync(
                    opts.AssembliesBaseDirPath),
                AssembliesToLoad = opts.AssembliesToLoad,
                LoadAllTypes = opts.LoadAllTypes,
                LoadPubGetProps = opts.LoadPubGetProps,
                LoadPubInstnGetProps = opts.LoadPubInstnGetProps,
                LoadPubMethods = opts.LoadPubMethods,
                LoadPubInstnMethods = opts.LoadPubInstnMethods,
            };

            if (!opts.AllAssembliesFilePaths.Contains(coreLibLocation))
            {
                opts.AllAssembliesFilePaths.Add(coreLibLocation);
            }

            if (opts.Config.UseNetStandard2p1 == true)
            {
                opts.AllAssembliesFilePaths.AddRange(
                    await GetAllAssembliesFilePathsAsync(
                        opts.Config.NetStandard2p1LibDirLocation));
            }

            opts.AssembliesToLoad = opts.AssembliesToLoad.Select(
                asmb => new AssemblyOpts
                {
                    IsExecutable = asmb.IsExecutable,
                    AssemblyName = asmb.AssemblyName,
                    AssemblyFilePath = asmb.AssemblyFilePath ?? GetAssemblyFilePath(
                        opts, asmb),
                    LoadAllTypes = asmb.LoadAllTypes ?? opts.LoadAllTypes,
                    LoadPubGetProps = asmb.LoadPubGetProps ?? opts.LoadPubGetProps,
                    LoadPubInstnGetProps = asmb.LoadPubInstnGetProps ?? opts.LoadPubInstnGetProps,
                    LoadPubMethods = asmb.LoadPubMethods ?? opts.LoadPubMethods,
                    LoadPubInstnMethods = asmb.LoadPubInstnMethods ?? opts.LoadPubInstnMethods,
                    TypesToLoad = asmb.TypesToLoad?.Select(
                        type => new TypeOpts
                        {
                            FullTypeName = type.FullTypeName,
                            LoadPubGetProps = type.LoadPubGetProps ?? asmb.LoadPubGetProps,
                            LoadPubInstnGetProps = type.LoadPubInstnGetProps ?? asmb.LoadPubInstnGetProps,
                            LoadPubMethods = type.LoadPubMethods ?? asmb.LoadPubMethods,
                            LoadPubInstnMethods = type.LoadPubInstnMethods ?? asmb.LoadPubInstnMethods,
                        }).ToList()!,
                }).ToList();

            return opts;
        }

        public async Task<List<string>> GetAllAssembliesFilePathsAsync(
            string assembliesBaseDirPath)
        {
            var allAssembliesFilePathsList = (await filteredDriveEntriesRetriever.FindMatchingAsync(
                new FilteredDriveRetrieverMatcherOpts
                {
                    PrFolderIdnf = assembliesBaseDirPath,
                    FsEntriesSerializableFilter = new Core.FileSystem.DriveEntriesSerializableFilter
                    {
                        IncludedRelPathRegexes = ["\\/[^\\/]+\\.dll$"]
                    }
                })).ExtractItems().GetAllIdnfsRecursively();

            return allAssembliesFilePathsList;
        }

        public async Task<WorkArgs> LoadAssembliesAsync(
            AssemblyLoaderOpts opts)
        {
            opts = await NormalizeOptsAsync(opts);

            var wka = new WorkArgs
            {
                Opts = opts
            };

            var resolver = new PathAssemblyResolver(
                opts.AllAssembliesFilePaths);

            using var context = new MetadataLoadContext(
                resolver, coreAssemblyName: coreLibName);

            var retAssembliesList = opts.AssembliesToLoad.Select(
                asmb =>
                {
                    var asmbObj = context.LoadFromAssemblyPath(
                        asmb.AssemblyFilePath);

                    var dotNetAsmb = ConvertAssembly(new WorkArgs(wka)
                    {
                        AsmbOpts = asmb,
                        AsmbObj = asmbObj,
                    });

                    return dotNetAsmb;
                }).ToList();

            return wka;
        }

        public DotNetAssembly ConvertAssembly(
            WorkArgs wka,
            bool isReferencedAssembly = false)
        {
            string assemblyFilePath = wka.AsmbObj.Location;
            string fullName = wka.AsmbObj.FullName;

            var assembliesList = isReferencedAssembly ? wka.ReferencedAssemblies : wka.LoadedAssemblies;

            var asmb = assembliesList.FirstOrDefault(
                asmbInstn => asmbInstn.FullName == fullName);

            if (asmb == null)
            {
                asmb = new DotNetAssembly(wka.AsmbObj)
                {
                    BclAsmbName = ConvertAssemblyName(
                        wka.AsmbObj.GetName()),
                    FullName = fullName,
                    TypeNamesPfx = $"{fullName}.",
                    AssemblyFilePath = assemblyFilePath,
                    IsExecutable = Path.GetExtension(
                        assemblyFilePath).ToLower() != ".dll",
                };

                if (!isReferencedAssembly)
                {
                    asmb.ReferencedBclAsmbNames = wka.AsmbObj.GetReferencedAssemblies(
                        ).Select(ConvertAssemblyName).ToList();

                    if (wka.AsmbOpts.LoadAllTypes == true)
                    {
                        asmb.TypesList = wka.AsmbObj.GetExportedTypes(
                            ).Select(typeObj => ConvertAssemblyType(new WorkArgs(wka)
                            {
                                TypeObj = typeObj
                            })).ToList();
                    }
                    else
                    {
                        asmb.TypesList = wka.AsmbOpts.TypesToLoad.Select(
                            typeOpts => ConvertAssemblyType(new WorkArgs(wka)
                            {
                                TypeOpts = typeOpts,
                            })).ToList();
                    }
                }

                assembliesList.Add(asmb);
            }

            return asmb;
        }

        public DotNetAssemblyName ConvertAssemblyName(
            AssemblyName asmbObjName)
        {
            var asmbVersion = asmbObjName.Version;

            var retObj = new DotNetAssemblyName(
                asmbObjName)
            {
                Name = asmbObjName.Name,
                BclVersion = ConvertAssemblyVersion(asmbVersion),
                CultureInfo = asmbObjName.CultureInfo,
                CultureName = asmbObjName.CultureName,
                ContentType = asmbObjName.ContentType,
            };

            return retObj;
        }

        public DotNetAssemblyVersion ConvertAssemblyVersion(
            Version asmbObjVersion) => new DotNetAssemblyVersion(
                asmbObjVersion)
            {
                Major = asmbObjVersion.Major,
                Minor = asmbObjVersion.Minor,
                Build = asmbObjVersion.Build,
                Revision = asmbObjVersion.Revision,
                MajorRevision = asmbObjVersion.MajorRevision,
                MinorRevision = asmbObjVersion.MinorRevision,
            };

        public DotNetType ConvertAssemblyType(
            WorkArgs wka,
            bool isReferencedType = false)
        {
            var typeObj = wka.TypeObj ?? GetTypeObj(new WorkArgs(wka)
            {
                TypeOpts = wka.TypeOpts,
            });

            var typeOpts = wka.TypeOpts ?? GetTypeOpts(
                new WorkArgs(wka)
                {
                    TypeObj = typeObj
                });

            var typesList = isReferencedType ? wka.ReferencedTypes : wka.LoadedTypes;

            string fullName = typeObj.GetTypeFullDisplayName();

            var dotNetType = typesList.FirstOrDefault(
                type => type.FullName == fullName);

            if (dotNetType == null)
            {
                dotNetType = new DotNetType(typeObj)
                {
                    FullName = fullName,
                    Name = typeObj.Name,
                    Namespace = typeObj.Namespace,
                    IsGenericParam = typeObj.IsGenericParameter,
                    IsGenericTypeParam = typeObj.IsGenericTypeParameter,
                    IsGenericMethodParam = typeObj.IsGenericMethodParameter,
                    IsNested = typeObj.IsNested && !typeObj.IsGenericParameter,
                    IsGenericType = typeObj.IsGenericType,
                    IsGenericTypeDef = typeObj.IsGenericTypeDefinition,
                    IsConstructedGenericType = typeObj.IsConstructedGenericType,
                };

                dotNetType.Assembly = typeObj.Assembly.With(asmb => ConvertAssembly(
                    new WorkArgs(wka)
                    {
                        AsmbObj = asmb,
                        AsmbOpts = new AssemblyOpts()
                    }, true));

                if (dotNetType.IsGenericType == true)
                {
                    if (dotNetType.IsGenericTypeDef != true)
                    {
                        dotNetType.GenericTypeDef = typeObj.GetGenericTypeDefinition().With(
                            genericTypeDef => ConvertAssemblyType(
                                new WorkArgs(wka)
                                {
                                    TypeObj = genericTypeDef
                                }, true));
                    }

                    dotNetType.GenericTypeArgs = typeObj.GetGenericArguments().Select(
                        genericArg => ConvertGenericTypeArg(
                            new WorkArgs(wka)
                            {
                                TypeObj = genericArg,
                            }, genericArg)).ToList();
                }

                dotNetType.DeclaringType = dotNetType.IsNested == true ? typeObj.DeclaringType.With(
                    declaringType => ConvertAssemblyType(
                        new WorkArgs(wka)
                        {
                            TypeObj = declaringType
                        }, true)) : null;

                dotNetType.DeclaringType?.ActIfNotNull(declaringType =>
                {
                    dotNetType.RelNsPartsArr = declaringType.RelNsPartsArr?.PrependToArr(
                        declaringType.Name);
                },
                () =>
                {
                    if (dotNetType.Namespace?.StartsWith(
                        wka.Asmb.TypeNamesPfx) ?? false)
                    {
                        dotNetType.RelNsPartsArr = dotNetType.FullName.Substring(
                            wka.Asmb.TypeNamesPfx.Length).Split('.');
                    }
                });

                if (!isReferencedType)
                {
                    dotNetType.BaseType = typeObj.BaseType?.With(baseType => ConvertAssemblyType(
                        new WorkArgs(wka)
                        {
                            TypeObj = baseType
                        }, isReferencedType));

                    dotNetType.Interfaces = typeObj.GetInterfaces().Select(
                        intfType => ConvertAssemblyType(
                            new WorkArgs(wka)
                            {
                                TypeObj = intfType
                            }, true)).ToList();

                    if (typeOpts.LoadPubGetProps == true || typeOpts.LoadPubInstnGetProps == true)
                    {
                        var properties = typeObj.GetProperties();

                        if (typeOpts.LoadPubInstnGetProps == true)
                        {
                            properties = properties.Where(
                                prop => prop.GetGetMethod()?.IsStatic == false).ToArray();
                        }

                        dotNetType.Properties = properties.Select(
                            propInfo => ConvertDotNetProperty(
                                new WorkArgs(wka)
                                {
                                    TypeObj = typeObj
                                }, propInfo)).ToList();
                    }

                    if (typeOpts.LoadPubMethods == true || typeOpts.LoadPubInstnMethods == true)
                    {
                        var methodInfos = typeObj.GetMethods();

                        if (typeOpts.LoadPubInstnMethods == true)
                        {
                            methodInfos = methodInfos.Where(
                                method => !method.IsStatic).ToArray();
                        }

                        dotNetType.Methods = methodInfos.Select(
                            methodInfo => ConvertDotNetMethod(
                                new WorkArgs(wka)
                                {
                                    TypeObj = typeObj
                                }, methodInfo)).ToList();
                    }

                    if (typeOpts.LoadPubInstnConstructors == true)
                    {
                        var constructorInfos = typeObj.GetConstructors().Where(
                            constrInfo => !constrInfo.IsStatic);

                        dotNetType.Constructors = constructorInfos.Select(
                            constrInfo => ConvertDotNetConstructor(
                                new WorkArgs(wka)
                                {
                                    TypeObj = typeObj
                                }, constrInfo)).ToList();
                    }
                }

                typesList.Add(dotNetType);
            }
            else
            {

            }

            return dotNetType;
        }

        public DotNetProperty ConvertDotNetProperty(
            WorkArgs wka,
            PropertyInfo propInfo)
        {
            var dotNetProp = new DotNetProperty(propInfo)
            {
                Name = propInfo.Name,
                CanRead = propInfo.CanRead,
                CanWrite = propInfo.CanWrite,
                IsStatic = (propInfo.GetGetMethod() ?? propInfo.GetSetMethod()).IsStatic,
                PropType = ConvertAssemblyType(
                    new WorkArgs(wka)
                    {
                        TypeObj = propInfo.PropertyType
                    }, true),
            };

            return dotNetProp;
        }

        public DotNetMethod ConvertDotNetMethod(
            WorkArgs wka,
            MethodInfo methodInfo)
        {
            var returnType = methodInfo.ReturnType;
            var isVoidMethod = returnType == typeof(void);

            var dotNetMethod = new DotNetMethod(methodInfo)
            {
                Name = methodInfo.Name,
                IsVoidMethod = isVoidMethod,
                ReturnType = ConvertAssemblyType(
                    new WorkArgs(wka)
                    {
                        TypeObj = returnType
                    }, true),
                IsStatic = methodInfo.IsStatic,
                Parameters = methodInfo.GetParameters().Select(
                    @param => ConvertDotNetParameter(
                    new WorkArgs(wka)
                    {
                        TypeObj = wka.TypeObj
                    }, param)).ToList(),
            };

            return dotNetMethod;
        }

        public DotNetConstructor ConvertDotNetConstructor(
            WorkArgs wka,
            ConstructorInfo constructorInfo)
        {
            var dotNetConstructor = new DotNetConstructor(constructorInfo)
            {
                Name = constructorInfo.Name,
                IsStatic = constructorInfo.IsStatic,
                Parameters = constructorInfo.GetParameters().Select(
                    @param => ConvertDotNetParameter(
                    new WorkArgs(wka)
                    {
                        TypeObj = wka.TypeObj
                    }, param)).ToList(),
            };

            return dotNetConstructor;
        }

        public DotNetMethodParameter ConvertDotNetParameter(
            WorkArgs wka,
            ParameterInfo paramInfo)
        {
            var dotNetMethodParameter = new DotNetMethodParameter(paramInfo)
            {
                Name = paramInfo.Name,
                Position = paramInfo.Position,
                ParamType = ConvertAssemblyType(
                    new WorkArgs(wka)
                    {
                        TypeObj = paramInfo.ParameterType
                    }, true)
            };

            return dotNetMethodParameter;
        }

        public GenericTypeArg ConvertGenericTypeArg(
            WorkArgs wka,
            Type genericTypeArg)
        {
            var genericTypeArgObj = new GenericTypeArg
            {
                TypeArg = ConvertAssemblyType(
                    new WorkArgs(wka)
                    {
                        TypeObj = genericTypeArg,
                    }, true),
                TypeParamConstraints = genericTypeArg.IsGenericTypeParameter ? genericTypeArg.GetGenericParameterConstraints(
                    ).Select(param => ConvertAssemblyType(
                        new WorkArgs(wka)
                        {
                            TypeObj = param,
                        }, true)).ToList() : null
            };

            return genericTypeArgObj;
        }

        public Type GetTypeObj(
            WorkArgs wka) => wka.AsmbObj.GetType(
                wka.TypeOpts.FullTypeName)!;

        public TypeOpts GetTypeOpts(
            WorkArgs wka) => new TypeOpts
            {
                FullTypeName = wka.TypeObj.GetTypeFullDisplayName(),
                LoadPubGetProps = wka.AsmbOpts.LoadPubGetProps,
                LoadPubInstnGetProps = wka.AsmbOpts.LoadPubInstnGetProps,
                LoadPubMethods = wka.AsmbOpts.LoadPubMethods,
                LoadPubInstnMethods = wka.AsmbOpts.LoadPubInstnMethods,
            };

        public string GetAssemblyExtension(
            AssemblyOpts asmbOpts) => asmbOpts.IsExecutable switch
            {
                true => "exe",
                _ => "dll"
            };

        public string GetAssemblyFileName(
            AssemblyOpts asmbOpts) => string.Join(
                ".", asmbOpts.AssemblyName, GetAssemblyExtension(asmbOpts));

        public string GetAssemblyFilePath(
            AssemblyLoaderOpts opts,
            AssemblyOpts asmbOpts) => Path.Combine(
                opts.AssembliesBaseDirPath,
                GetAssemblyFileName(asmbOpts));

        public readonly struct WorkArgs
        {
            public WorkArgs()
            {
                LoadedAssemblies = [];
                ReferencedAssemblies = [];
                LoadedTypes = [];
                ReferencedTypes = [];
            }

            public WorkArgs(WorkArgs src)
            {
                LoadedAssemblies = src.LoadedAssemblies;
                ReferencedAssemblies = src.ReferencedAssemblies;
                LoadedTypes = src.LoadedTypes;
                ReferencedTypes = src.ReferencedTypes;

                this.Opts = src.Opts;
                this.AsmbOpts = src.AsmbOpts;
                this.Asmb = src.Asmb;
                this.AsmbObj = src.AsmbObj;
            }

            public List<DotNetAssembly> LoadedAssemblies { get; }
            public List<DotNetAssembly> ReferencedAssemblies { get; }

            public List<DotNetType> LoadedTypes { get; }
            public List<DotNetType> ReferencedTypes { get; }

            public AssemblyLoaderOpts? Opts { get; init; }
            public AssemblyOpts? AsmbOpts { get; init; }
            public DotNetAssembly? Asmb { get; init; }
            public Assembly? AsmbObj { get; init; }
            public Type? TypeObj { get; init; }
            public TypeOpts? TypeOpts { get; init; }
        }
    }
}
