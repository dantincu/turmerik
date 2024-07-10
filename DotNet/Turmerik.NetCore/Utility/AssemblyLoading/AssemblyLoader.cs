using System.Reflection;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;

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

        Task<List<DotNetAssembly>> LoadAssembliesAsync(
            AssemblyLoaderOpts opts);

        DotNetAssembly ConvertAssembly(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            Assembly asmbObj);

        DotNetAssemblyName ConvertAssemblyName(
            AssemblyName asmbObjName);

        DotNetAssemblyVersion ConvertAssemblyVersion(
            Version asmbObjVersion);

        DotNetType ConvertAssemblyType(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            bool noMembers = false);

        DotNetProperty ConvertDotNetProperty(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            PropertyInfo propInfo);

        DotNetMethod ConvertDotNetMethod(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            MethodInfo methodInfo);

        DotNetConstructor ConvertDotNetConstructor(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            ConstructorInfo constructorInfo);

        DotNetMethodParameter ConvertDotNetParameter(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            ParameterInfo paramInfo);

        GenericTypeArg ConvertGenericTypeArg(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            Type genericTypeArg);

        GenericTypeParam ConvertGenericTypeParam(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            Type genericTypeParam);

        Type GetTypeObj(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            Assembly asmbObj);

        AssemblyLoaderOpts.TypeOpts GetTypeOpts(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            Assembly asmbObj,
            Type typeObj);

        string GetAssemblyExtension(
            AssemblyLoaderOpts.AssemblyOpts asmbOpts);

        string GetAssemblyFileName(
            AssemblyLoaderOpts.AssemblyOpts asmbOpts);

        string GetAssemblyFilePath(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts);
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
                asmb => new AssemblyLoaderOpts.AssemblyOpts
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
                        type => new AssemblyLoaderOpts.TypeOpts
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

        public async Task<List<DotNetAssembly>> LoadAssembliesAsync(
            AssemblyLoaderOpts opts)
        {
            opts = await NormalizeOptsAsync(opts);

            var resolver = new PathAssemblyResolver(
                opts.AllAssembliesFilePaths);

            using var context = new MetadataLoadContext(
                resolver, coreAssemblyName: coreLibName);

            var retAssembliesList = opts.AssembliesToLoad.Select(
                asmb =>
                {
                    var asmbObj = context.LoadFromAssemblyPath(
                        asmb.AssemblyFilePath);

                    var dotNetAsmb = ConvertAssembly(
                        opts, asmb, asmbObj);

                    return dotNetAsmb;
                }).ToList();

            return retAssembliesList;
        }

        public DotNetAssembly ConvertAssembly(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            Assembly asmbObj)
        {
            string assemblyFilePath = asmbObj.Location;

            var asmb = new DotNetAssembly(asmbObj)
            {
                BclAsmbName = ConvertAssemblyName(
                    asmbObj.GetName()),
                ReferencedBclAsmbNames = asmbObj.GetReferencedAssemblies(
                    ).Select(ConvertAssemblyName).ToList(),
                FullName = asmbObj.FullName,
                TypeNamesPfx = $"{asmbObj.FullName}.",
                AssemblyFilePath = assemblyFilePath,
                IsExecutable = Path.GetExtension(
                    assemblyFilePath).ToLower() != ".dll",
            };

            if (asmbOpts.LoadAllTypes == true)
            {
                asmb.TypesList = asmbObj.GetExportedTypes(
                    ).Select(typeObj => ConvertAssemblyType(
                        opts, asmbOpts, null, asmb, asmbObj, typeObj)).ToList();
            }
            else
            {
                asmb.TypesList = asmbOpts.TypesToLoad.Select(
                    typeOpts => ConvertAssemblyType(
                        opts, asmbOpts, typeOpts, asmb, asmbObj, null)).ToList();
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
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts? typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type? typeObj,
            bool noMembers = false)
        {
            typeObj ??= GetTypeObj(opts, asmbOpts, typeOpts, asmbObj);
            typeOpts ??= GetTypeOpts(opts, asmbOpts, asmbObj, typeObj);

            var dotNetType = new DotNetType(typeObj)
            {
                FullName = typeObj.GetTypeFullDisplayName(),
                Name = typeObj.Name,
                Namespace = typeObj.Namespace,
                IsGenericParam = typeObj.IsGenericParameter,
                IsGenericTypeParam = typeObj.IsGenericTypeParameter,
                IsGenericMethodParam = typeObj.IsGenericMethodParameter,
                IsNested = typeObj.IsNested,
                IsGenericType = typeObj.IsGenericType,
                IsGenericTypeDef = typeObj.IsGenericTypeDefinition,
                IsConstructedGenericType = typeObj.IsConstructedGenericType,
            };

            dotNetType.BaseType = typeObj.BaseType?.With(baseType => ConvertAssemblyType(
                opts, asmbOpts, null, asmb, asmbObj, baseType, noMembers));

            dotNetType.DeclaringType = typeObj.IsNested ? typeObj.DeclaringType.With(
                declaringType => ConvertAssemblyType(
                    opts, asmbOpts, null, asmb, asmbObj, declaringType, true)) : null;

            dotNetType.Interfaces = typeObj.GetInterfaces().Select(
                intfType => ConvertAssemblyType(
                    opts, asmbOpts, null, asmb, asmbObj, intfType, true)).ToList();

            dotNetType.DeclaringType?.ActIfNotNull(declaringType =>
            {
                dotNetType.RelNsPartsArr = declaringType.RelNsPartsArr?.PrependToArr(
                    declaringType.Name);
            },
            () =>
            {
                if (dotNetType.Namespace?.StartsWith(
                    asmb.TypeNamesPfx) ?? false)
                {
                    dotNetType.RelNsPartsArr = dotNetType.FullName.Substring(
                        asmb.TypeNamesPfx.Length).Split('.');
                }
            });

            if (dotNetType.IsGenericTypeDef == true)
            {
                if (dotNetType.IsGenericTypeDef == true)
                {
                    dotNetType.GenericTypeDef = typeObj.GetGenericTypeDefinition().With(
                        genericTypeDef => ConvertAssemblyType(
                            opts, asmbOpts, null, asmb, asmbObj, genericTypeDef, true));
                }
                else
                {
                    if (dotNetType.IsConstructedGenericType != true)
                    {
                        dotNetType.GenericTypeParams = typeObj.GetGenericParameterConstraints().Select(
                            genericParam => ConvertGenericTypeParam(
                                opts, asmbOpts, typeOpts, asmb, asmbObj, typeObj, genericParam)).ToList();
                    }

                    dotNetType.GenericTypeArgs = typeObj.GetGenericArguments().Select(
                        genericArg => ConvertGenericTypeArg(
                            opts, asmbOpts, typeOpts, asmb, asmbObj, typeObj, genericArg)).ToList();
                }
            }

            if (!noMembers)
            {
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
                            opts, asmbOpts, typeOpts, asmb, asmbObj, typeObj, propInfo)).ToList();
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
                            opts, asmbOpts, typeOpts, asmb, asmbObj, typeObj, methodInfo)).ToList();
                }

                if (typeOpts.LoadPubInstnConstructors == true)
                {
                    var constructorInfos = typeObj.GetConstructors().Where(
                        constrInfo => !constrInfo.IsStatic);

                    dotNetType.Constructors = constructorInfos.Select(
                        constrInfo => ConvertDotNetConstructor(
                            opts, asmbOpts, typeOpts, asmb, asmbObj, typeObj, constrInfo)).ToList();
                }
            }

            return dotNetType;
        }

        public DotNetProperty ConvertDotNetProperty(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            PropertyInfo propInfo)
        {
            var dotNetProp = new DotNetProperty(propInfo)
            {
                Name = propInfo.Name,
                CanRead = propInfo.CanRead,
                CanWrite = propInfo.CanWrite,
                IsStatic = (propInfo.GetGetMethod() ?? propInfo.GetSetMethod()).IsStatic,
                PropType = ConvertAssemblyType(
                    opts, asmbOpts, null, asmb, asmbObj, propInfo.PropertyType, true),
            };

            return dotNetProp;
        }

        public DotNetMethod ConvertDotNetMethod(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            MethodInfo methodInfo)
        {
            var returnType = methodInfo.ReturnType;
            var isVoidMethod = returnType == typeof(void);

            var dotNetMethod = new DotNetMethod(methodInfo)
            {
                Name = methodInfo.Name,
                IsVoidMethod = isVoidMethod,
                ReturnType = ConvertAssemblyType(
                    opts, asmbOpts, null, asmb, asmbObj, returnType, true),
                IsStatic = methodInfo.IsStatic,
                Parameters = methodInfo.GetParameters().Select(
                    @param => ConvertDotNetParameter(
                        opts, asmbOpts, typeOpts, asmb, asmbObj, typeObj, param)).ToList(),
            };

            return dotNetMethod;
        }

        public DotNetConstructor ConvertDotNetConstructor(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            ConstructorInfo constructorInfo)
        {
            var dotNetConstructor = new DotNetConstructor(constructorInfo)
            {
                Name = constructorInfo.Name,
                IsStatic = constructorInfo.IsStatic,
                Parameters = constructorInfo.GetParameters().Select(
                    @param => ConvertDotNetParameter(
                        opts, asmbOpts, typeOpts, asmb, asmbObj, typeObj, param)).ToList(),
            };

            return dotNetConstructor;
        }

        public DotNetMethodParameter ConvertDotNetParameter(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            ParameterInfo paramInfo)
        {
            var dotNetMethodParameter = new DotNetMethodParameter(paramInfo)
            {
                Name = paramInfo.Name,
                Position = paramInfo.Position,
                ParamType = ConvertAssemblyType(
                    opts, asmbOpts, typeOpts, asmb, asmbObj, paramInfo.ParameterType, true)
            };

            return dotNetMethodParameter;
        }

        public GenericTypeArg ConvertGenericTypeArg(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            Type genericTypeArg)
        {
            var genericTypeArgObj = new GenericTypeArg
            {
                TypeArg = ConvertAssemblyType(
                    opts, asmbOpts, null, asmb, asmbObj, genericTypeArg, true),
            };

            return genericTypeArgObj;
        }

        public GenericTypeParam ConvertGenericTypeParam(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            DotNetAssembly asmb,
            Assembly asmbObj,
            Type typeObj,
            Type genericTypeParam)
        {
            var genericTypeParamObj = new GenericTypeParam
            {
                TypeParam = ConvertAssemblyType(
                    opts, asmbOpts, null, asmb, asmbObj, genericTypeParam, true),
            };

            return genericTypeParamObj;
        }

        public Type GetTypeObj(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            Assembly asmbObj) => asmbObj.GetType(
                typeOpts.FullTypeName)!;

        public AssemblyLoaderOpts.TypeOpts GetTypeOpts(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            Assembly asmbObj,
            Type typeObj) => new AssemblyLoaderOpts.TypeOpts
            {
                FullTypeName = typeObj.GetTypeFullDisplayName(),
                LoadPubGetProps = asmbOpts.LoadPubGetProps,
                LoadPubInstnGetProps = asmbOpts.LoadPubInstnGetProps,
                LoadPubMethods = asmbOpts.LoadPubMethods,
                LoadPubInstnMethods = asmbOpts.LoadPubInstnMethods,
            };

        public string GetAssemblyExtension(
            AssemblyLoaderOpts.AssemblyOpts asmbOpts) => asmbOpts.IsExecutable switch
            {
                true => "exe",
                _ => "dll"
            };

        public string GetAssemblyFileName(
            AssemblyLoaderOpts.AssemblyOpts asmbOpts) => string.Join(
                ".", asmbOpts.AssemblyName, GetAssemblyExtension(asmbOpts));

        public string GetAssemblyFilePath(
            AssemblyLoaderOpts opts,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts) => Path.Combine(
                opts.AssembliesBaseDirPath,
                GetAssemblyFileName(asmbOpts));
    }
}
