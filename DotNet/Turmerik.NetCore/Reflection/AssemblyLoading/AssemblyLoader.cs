﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.NetCore.Reflection.AssemblyLoading
{
    public class AssemblyLoader : AssemblyLoaderBase
    {
        public AssemblyLoader(
            IFilteredDriveEntriesRetriever filteredDriveEntriesRetriever) : base(
                filteredDriveEntriesRetriever)
        {
        }

        protected override TypeItemCoreBase LoadType(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts)
        {
            var asmbItem = GetAssemblyItem(
                wka, asmbOpts);

            var type = GetTypeObj(wka, asmbItem, typeOpts);
            var typeItem = LoadType(wka, type);

            return typeItem;
        }

        protected override TypeItemCoreBase LoadType(
            WorkArgs wka,
            Type type)
        {
            TypeItemCoreBase retItem = null;
            string idnfName = GetTypeIdnfName(type);

            if (type.IsByRef)
            {
                retItem = LoadElementType(
                    wka, type, TypeItemKind.ByRefValue);
            }
            else if (type.IsPointer)
            {
                retItem = LoadElementType(
                    wka, type, TypeItemKind.PointerValue);
            }
            else if (type.IsArray)
            {
                retItem = LoadElementType(
                    wka, type, TypeItemKind.Array);
            }
            else if (type.IsEnum)
            {
                retItem = LoadEnumType(wka, type);
            }
            else if (type.IsGenericParameter)
            {
                retItem = LoadGenericParamType(wka, type);
            }
            else if (type.IsGenericType && !type.IsGenericTypeDefinition)
            {
                if (!TryLoadGenericInteropType(
                    wka, type, out retItem))
                {
                    retItem = LoadRegularType(wka, type);
                }
            }
            else
            {
                bool loaded = false;

                if (!type.IsGenericType && (type.Namespace?.StartsWith(
                    ReflH.BaseObjectType.Type.Namespace!) ?? false))
                {
                    loaded = TryLoadPrimitiveType(
                        wka, type, out retItem);
                }

                if (!loaded)
                {
                    var asmbItem = GetAssemblyItem(
                        wka, type.Assembly);

                    retItem = asmbItem.TypesMap.GetOrAdd(
                        idnfName, name => LoadRegularType(wka, type));
                }
            }

            return retItem;
        }

        private TypeItemCoreBase LoadElementType(
            WorkArgs wka,
            Type type,
            TypeItemKind typeItemKind)
        {
            var elementType = LoadType(wka, type.GetElementType());

            var retItem = new ElementTypeItem(
                    typeItemKind,
                    elementType.ShortName + "[]",
                    elementType.IdnfName + "[]")
                {
                    ElementType = elementType
                };

            return retItem;
        }

        private TypeItemCoreBase LoadEnumType(
            WorkArgs wka,
            Type type)
        {
            var retItem = GetIdnfNameFactories(
                null as EnumTypeItem,
                type,
                out var idnfNameFactory,
                out var fullIdnfNamefactory);

            retItem = new (
                TypeItemKind.Enum,
                item => type.GetTypeShortDisplayName(),
                idnfNameFactory,
                fullIdnfNamefactory)
            {
                DeclaringType = type.DeclaringType?.With(
                        declaringType => new Lazy<TypeItemCoreBase>(
                            () => LoadType(wka, declaringType))),
                DefinedValuesMap = Enum.GetNames(type).With(namesArr =>
                {
                    var valuesArr = Enum.GetValuesAsUnderlyingType(type);

                    var retMap = namesArr.Select((name, idx) => new KeyValuePair<string, object>(
                        name, valuesArr.GetValue(idx))).Dictnr().RdnlD();

                    return retMap;
                })
            };

            return retItem;
        }

        private DelegateTypeItem LoadDelegateType(
            WorkArgs wka,
            Type type)
        {
            (var retType, var @params) = LoadDelegateTypeCore(
                wka, type, out var declaringType, out var isVoid);

            var retItem = GetIdnfNameFactories(
                null as DelegateTypeItem,
                type,
                out var idnfNameFactory,
                out var fullIdnfNamefactory);

            retItem = new(
                TypeItemKind.Delegate,
                item => type.GetTypeDisplayName(),
                idnfNameFactory,
                fullIdnfNamefactory)
            {
                Params = @params,
                ReturnType = retType,
                IsVoidDelegate = isVoid,
                DeclaringType = declaringType,
                Idnf = GetTypeIdnfLazy(wka, () => retItem, declaringType, type),
                AllTypeDependencies = new Lazy<ReadOnlyCollection<Lazy<TypeItemCoreBase>>>(() =>
                    GetAllDependencies(retItem).RdnlC())
            };

            return retItem;
        }

        private GenericDelegateTypeItem LoadGenericDelegateType(
            WorkArgs wka,
            Type type)
        {
            (var retType, var @params) = LoadDelegateTypeCore(
                wka, type, out var declaringType, out var isVoid);

            GenericDelegateTypeItem? retItem = null;

            retItem = GetIdnfNameFactories(
                null as GenericDelegateTypeItem,
                type,
                out var idnfNameFactory,
                out var fullIdnfNamefactory,
                () => string.Concat("[", string.Join(", ",
                    retItem.GenericTypeArgs.Select(
                        arg => arg.Value.TypeArg?.FullIdnfName ?? arg.Value.Param!.Name)), "]"));

            retItem = new (
                TypeItemKind.GenericDelegate,
                item => type.Name,
                idnfNameFactory,
                fullIdnfNamefactory)
            {
                Params = @params,
                ReturnType = retType,
                IsVoidDelegate = isVoid,
                DeclaringType = declaringType,
                Idnf = GetTypeIdnfLazy(wka, () => retItem, declaringType, type),
                GenericTypeArgs = GetGenericTypeArgs(
                    wka, type.GetGenericArguments(),
                    type, t => t, null),
                AllTypeDependencies = new Lazy<ReadOnlyCollection<Lazy<TypeItemCoreBase>>>(() =>
                    GetAllDependencies(retItem).RdnlC())
            };

            return retItem;
        }

        private Tuple<Lazy<TypeItemCoreBase>, ReadOnlyDictionary<string, Lazy<TypeItemCoreBase>>> LoadDelegateTypeCore(
            WorkArgs wka,
            Type type,
            out Lazy<TypeItemCoreBase>? declaringType,
            out bool isVoidMethod)
        {
            declaringType = null;

            if (type.IsNested)
            {
                declaringType = new (() => LoadType(wka, type.DeclaringType!));
            }

            var invokeMethod = type.GetMethod("Invoke") ?? throw new InvalidOperationException(
                $"If type {type} were a delegate type, it would contain a method called 'Invoke'");

            var retTypeItem = new Lazy<TypeItemCoreBase>(() => LoadType(wka,
                invokeMethod!.ReturnType));

            isVoidMethod = type.GetTypeFullDisplayName(
                null) == ReflH.VoidType.FullName;

            var @params = invokeMethod.GetParameters().ToDictionary(
                param => param.Name,
                param => new Lazy<TypeItemCoreBase>(
                    () => LoadType(wka, param.ParameterType))).RdnlD();

            return Tuple.Create(retTypeItem, @params)!;
        }

        private TypeItemCoreBase LoadGenericParamType(
            WorkArgs wka,
            Type typeParam)
        {
            var retItem = new GenericTypeParameter(
                    TypeItemKind.GenericParam)
            {
                Name = typeParam.Name,
                GenericParamPosition = typeParam.GenericParameterPosition,
                ParamConstraints = typeParam.GetGenericParameterConstraints().With(
                    constraintsArr => GetGenericTypeParamConstraints(
                        wka, typeParam, constraintsArr))
            };

            return retItem;
        }

        private bool TryLoadGenericInteropType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem)
        {
            bool retVal = TryLoadNullableType(
                wka, type, out retItem);

            retVal = retVal || TryLoadDictionaryType(
                wka, type, out retItem);

            retVal = retVal || TryLoadEnumerableType(
                wka, type, out retItem);

            return retVal;
        }

        private bool TryLoadNullableType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem) => TryLoadGenericInteropTypeCore(
                wka, type, out retItem,
                [ReflH.NullableGenericTypeDef.FullName],
                TypeItemKind.Nullable);

        private bool TryLoadDictionaryType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem) => TryLoadGenericInteropTypeCore(
                wka, type, out retItem,
                NetCoreCommonTypes.Instn.Value.DictionaryTypes.TypeNames,
                TypeItemKind.Dictionary);

        private bool TryLoadEnumerableType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem) => TryLoadGenericInteropTypeCore(
                wka, type, out retItem,
                NetCoreCommonTypes.Instn.Value.EnumerableTypes.TypeNames,
                TypeItemKind.Enumerable);

        private bool TryLoadPrimitiveType(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem) => TryLoadKnownType(
                wka, type, out retItem,
                fullName => PrimitiveTypeNamesMap.FirstKvp(
                    kvp => kvp.Value.TypeNames.Contains(fullName)),
                match => match.Key >= 0,
                match => match.Value.Key);

        private bool TryLoadGenericInteropTypeCore(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem,
            IEnumerable<string> typeNamesNmrbl,
            TypeItemKind kind) => TryLoadKnownType(
                wka, type, out retItem,
                fullName => fullName,
                fullName => typeNamesNmrbl.Contains(fullName) && type.GetGenericArguments().With(
                    genericArgs => genericArgs.Count() switch
                    {
                        2 => genericArgs[0].FullName?.With(
                            firstArgFullName => PrimitiveTypeNamesMap.Any(
                                kvp => kvp.Value.TypeNames.Contains(firstArgFullName))) ?? false,
                        _ => true
                    }),
                fullName => kind);

        private bool TryLoadKnownType<TTempData>(
            WorkArgs wka,
            Type type,
            out TypeItemCoreBase retItem,
            Func<string, TTempData> tempDataFactory,
            Func<TTempData, bool> isMatchPredicate,
            Func<TTempData, TypeItemKind> typeItemKindFactory)
        {
            retItem = null;
            string idnfName = type.FullName!;

            var tempData = tempDataFactory(idnfName);
            bool foundMatch = isMatchPredicate(tempData);

            if (foundMatch)
            {
                var typeItemKind = typeItemKindFactory(
                    tempData);

                retItem = new TypeItemCore(
                    typeItemKind,
                    idnfName.Split('.').Last(),
                    idnfName);
            }

            return foundMatch;
        }

        private TypeItemCoreBase LoadRegularType(
            WorkArgs wka,
            Type type)
        {
            TypeItemCoreBase retItem = null;

            if (IsDelegateType(wka, type))
            {
                if (type.IsGenericType)
                {
                    retItem = LoadDelegateType(wka, type);
                }
                else
                {
                    retItem = LoadGenericDelegateType(wka, type);
                }
            }
            else
            {
                var declaringTypeItem = type.DeclaringType?.With(
                    declaringType => new Lazy<TypeItemCoreBase>(() => LoadType(
                        wka, declaringType)));

                var idnfLazy = GetTypeIdnfLazy(
                wka, () => retItem,
                declaringTypeItem, type);

                var dataLazy = GetTypeDataLazy(
                    wka, () => retItem,
                    declaringTypeItem, type);

                if (type.IsGenericType)
                {
                    GenericTypeItem genericTypeItem = null;

                    genericTypeItem = new GenericTypeItem(
                        TypeItemKind.GenericRegular,
                        item => item.Idnf.Value.ShortName,
                        item => item.Idnf.Value.IdnfName,
                        item => item.Idnf.Value.FullIdnfName)
                    {
                        Idnf = idnfLazy,
                        Data = dataLazy,
                        DeclaringType = declaringTypeItem,
                        GenericTypeArgs = GetGenericTypeArgs(
                            wka, type.GetGenericArguments(),
                            type, t => t,
                            genericTypeItem)
                    };

                    retItem = genericTypeItem;
                }
                else
                {
                    retItem = new TypeItem(
                        TypeItemKind.Regular,
                        item => item.Idnf.Value.ShortName,
                        item => item.Idnf.Value.IdnfName,
                        item => item.Idnf.Value.FullIdnfName)
                    {
                        Idnf = idnfLazy,
                        Data = dataLazy,
                        DeclaringType = declaringTypeItem
                    };
                }
            }

            return retItem;
        }

        private ReadOnlyCollection<Lazy<GenericTypeArg>> GetGenericTypeArgs<TItemInfo>(
            WorkArgs wka,
            Type[] genericArgs,
            TItemInfo itemInfo,
            Func<TItemInfo, Type> declaringTypeFactory,
            TypeItemCoreBase? declaringType) => genericArgs.Select(
                arg => new Lazy<GenericTypeArg>(() => arg.IsGenericTypeParameter switch
                {
                    true => new GenericTypeArg
                    {
                        Param = new GenericTypeParameter(
                            TypeItemKind.GenericParam)
                        {
                            GenericParamPosition = arg.GenericParameterPosition,
                            Name = arg.Name,
                            ParamConstraints = arg.GetGenericParameterConstraints().With(
                                constraintsArr => GetGenericTypeParamConstraints(
                                    wka, arg, constraintsArr)),
                        },
                        DeclaringType = declaringType ?? LoadType(wka, arg.DeclaringType!),
                        BelongsToDeclaringType = declaringTypeFactory(itemInfo) == arg.DeclaringType
                    },
                    false => new GenericTypeArg
                    {
                        TypeArg = arg.IsGenericTypeParameter switch
                        {
                            false => LoadType(wka, arg),
                            _ => null
                        }
                    }
                })).RdnlC();

        private GenericTypeParamConstraints GetGenericTypeParamConstraints(
            WorkArgs wka,
            Type typeParam,
            Type[] constraintsArr)
        {
            bool isStruct = typeParam.IsValueType;
            Lazy<TypeItemCoreBase>? baseClass = null;
            var genericParameterAttributes = typeParam.GenericParameterAttributes;

            if (!isStruct)
            {
                if (typeParam.BaseType?.IsValueType == false &&
                typeParam.BaseType.FullName != wka.RootObject.IdnfName)
                {
                    baseClass = new Lazy<TypeItemCoreBase>(
                        () => LoadType(wka, typeParam.BaseType));
                }
            }

            var retObj = new GenericTypeParamConstraints
            {
                GenericParameterAttributes = genericParameterAttributes,
                IsStruct = isStruct,
                IsClass = genericParameterAttributes.HasFlag(
                    GenericParameterAttributes.ReferenceTypeConstraint),
                HasDefaultConstructor = genericParameterAttributes.HasFlag(
                    GenericParameterAttributes.DefaultConstructorConstraint),
                IsNotNullableValueType = genericParameterAttributes.HasFlag(
                    GenericParameterAttributes.NotNullableValueTypeConstraint),
                BaseClass = baseClass,
                RestOfTypes = constraintsArr.Where(
                    intf => !intf.IsValueType).Select(
                    intf => new Lazy<TypeItemCoreBase>(
                        () => LoadType(wka, intf))).RdnlC()
            };

            return retObj;
        }

        private Type GetTypeObj(
            WorkArgs wka,
            AssemblyItem asmb,
            AssemblyLoaderOpts.TypeOpts? typeOpts) => GetTypeObjCore(
                wka, asmb, typeOpts, typeOpts.DeclaringTypeOpts?.With(
                    declaringTypeOpts => GetTypeObj(
                        wka, asmb, declaringTypeOpts)));

        private Type GetTypeObjCore(
            WorkArgs wka,
            AssemblyItem asmb,
            AssemblyLoaderOpts.TypeOpts typeOpts,
            Type? declaringType)
        {
            var typePredicate = typeOpts!.GenericTypeParamsCount.WithNllbl<Func<Type, bool>, int>(
                genericTypeParamsCount => type => type.IsGenericType && type.GetGenericArguments(
                    ).Length == genericTypeParamsCount,
                () => type => true);

            var typeObj = declaringType.IfNotNull(
                dclringType => dclringType!.GetNestedTypes(
                    ReflH.MatchAllFlatHcyBindingFlags).First(
                        nestedType => nestedType.Name == typeOpts.TypeName && typePredicate(nestedType)),
                () => typeOpts!.GenericTypeParamsCount.HasValue switch
                {
                    true => asmb.BclItem.GetTypes().First(
                        type => type.GetTypeFullDisplayName() == typeOpts.FullTypeName && typePredicate(type)),
                    _ => asmb.BclItem!.GetType(
                        typeOpts.FullTypeName)
                });

            return typeObj;
        }

        private Lazy<TypeIdnf> GetTypeIdnfLazy(
            WorkArgs wka,
            Func<TypeItemCoreBase> retItemFactory,
            Lazy<TypeItemCoreBase>? declaringTypeItem,
            Type type)
        {
            var idnfLazy = new Lazy<TypeIdnf>(() =>
            {
                string fullIdnfName, idnfName = type.Name;

                if (retItemFactory() is GenericTypeItem genericItem)
                {
                    fullIdnfName = string.Join("`",
                        type.GetTypeShortDisplayName(),
                        string.Join(",", genericItem.GenericTypeArgs.Where(arg => arg.Value.With(
                            argVal => argVal.TypeArg != null || argVal.BelongsToDeclaringType)).Select(
                                arg => arg.Value.FullIdnfName)));
                }
                else
                {
                    fullIdnfName = type.Name;
                }

                if (declaringTypeItem != null)
                {
                    fullIdnfName = string.Join("+",
                        declaringTypeItem.Value.FullIdnfName,
                        fullIdnfName);

                    idnfName = string.Join(".",
                        declaringTypeItem.Value.IdnfName,
                        idnfName);
                }
                else
                {
                    fullIdnfName = string.Join(".",
                        type.Namespace, fullIdnfName);

                    idnfName = string.Join(".",
                        type.Namespace, idnfName);
                }

                var asmbItem = GetAssemblyItem(wka, type.Assembly);

                bool nsStartsWithAsmbPfx = idnfName.StartsWith(
                    asmbItem.TypeNamesPfx);

                var relNsParts = (nsStartsWithAsmbPfx switch
                {
                    true => idnfName.Substring(
                        asmbItem.TypeNamesPfx.Length),
                    false => idnfName
                }).Split(".").RdnlC();

                return new TypeIdnf(type, asmbItem, type.Name,
                    type.GetTypeShortDisplayName(),
                    idnfName, fullIdnfName)
                {
                    Namespace = type.Namespace,
                    NsStartsWithAsmbPfx = idnfName.StartsWith(
                        asmbItem.DefaultNamespace),
                    RelNsParts = relNsParts
                };
            });

            return idnfLazy;
        }

        private Lazy<TypeData> GetTypeDataLazy(
            WorkArgs wka,
            Func<TypeItemCoreBase> retItemFactory,
            Lazy<TypeItemCoreBase>? declaringTypeItem,
            Type type)
        {
            var dataLazy = new Lazy<TypeData>(() =>
            {
                TypeData typeData = null;

                typeData = new TypeData
                {
                    BaseType = type.BaseType?.With(baseType => new Lazy<TypeItemCoreBase>(
                        () => LoadType(wka, baseType))),
                    GenericTypeDefinition = type.IsGenericType ? new Lazy<TypeItemCoreBase>(
                        () => LoadType(wka, type.GetGenericTypeDefinition())) : null,
                    InterfaceTypes = type.GetDistinctInterfaces().SelectTypes().Select(
                        intf => new Lazy<TypeItemCoreBase>(
                            () => LoadType(wka, intf))).RdnlC(),
                    IsConstructedGenericType = type.IsConstructedGenericType,
                    IsGenericMethodParameter = type.IsGenericMethodParameter,
                    IsGenericParameter = type.IsGenericParameter,
                    IsGenericTypeDefinition = type.IsGenericTypeDefinition,
                    IsGenericTypeParameter = type.IsGenericTypeParameter,
                    IsInterface = type.IsInterface,
                    IsValueType = type.IsValueType,
                    PubInstnProps = wka.Opts.LoadPubInstnGetProps switch
                    {
                        true => type.GetProperties(
                            BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public).Select(
                            prop => new PropertyItem(prop, prop.Name)
                            {
                                CanRead = prop.CanRead,
                                CanWrite = prop.CanWrite,
                                IsStatic = false,
                                PropertyType = new Lazy<TypeItemCoreBase>(
                                    () => LoadType(wka, prop.PropertyType))
                            }).RdnlC(),
                        _ => null
                    },
                    PubInstnMethods = wka.Opts.LoadPubInstnMethods switch
                    {
                        true => type.GetMethods(
                            BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public).Where(
                                method => !method.IsSpecialName).Select(
                                method =>
                                {
                                    var isVoidMethod = type.GetTypeFullDisplayName(
                                        null) == ReflH.VoidType.FullName;

                                    var returnType = new Lazy<TypeItemCoreBase>(
                                        () => LoadType(wka, method.ReturnType));

                                    var @params = method.GetParameters().Where(
                                        param => param.Name != null).ToDictionary(
                                        param => param.Name!, param => new Lazy<TypeItemCoreBase>(
                                            () => LoadType(wka, param.ParameterType))).RdnlD();

                                    var retObj = method.IsGenericMethod switch
                                    {
                                        true => new GenericMethodItem(method, method.Name)
                                        {
                                            IsStatic = false,
                                            IsVoidMethod = isVoidMethod,
                                            ReturnType = returnType,
                                            Params = @params,
                                            GenericMethodArgs = GetGenericTypeArgs(
                                                wka, method.GetGenericArguments(),
                                                method, m => m.DeclaringType, null)
                                        },
                                        false => new MethodItem(method, method.Name)
                                        {
                                            IsStatic = false,
                                            IsVoidMethod = isVoidMethod,
                                            ReturnType = returnType,
                                            Params = @params
                                        }
                                    };

                                    return retObj;
                                }).RdnlC(),
                        _ => null
                    },
                    AllTypeDependencies = new Lazy<ReadOnlyCollection<Lazy<TypeItemCoreBase>>>(
                        () =>
                        {
                            var retItem = retItemFactory();
                            var retList = typeData!.InterfaceTypes.ToList();
                            AddDependencies(retList, [typeData.BaseType]);
                            AddDependencies(retList, [typeData.GenericTypeDefinition]);

                            AddDependencies(retList, typeData.PubInstnProps?.Select(
                                prop => prop.PropertyType) ?? []);

                            AddDependencies(retList, typeData.PubInstnMethods?.SelectMany(
                                method => method.ReturnType.Arr(
                                    method.Params.Select(
                                        param => param.Value).ToArray())) ?? []);

                            if (retItem is GenericTypeItem genericTypeItem)
                            {
                                AddDependencies(retList, genericTypeItem.GenericTypeArgs);
                            }
                            else if (retItem is GenericInteropTypeItem genericInteropTypeItem)
                            {
                                AddDependencies(retList, genericInteropTypeItem.GenericTypeArgs);
                            }
                            else if (retItem is DelegateTypeItem delegateTypeItem)
                            {
                                AddDependencies(retList, delegateTypeItem.ReturnType?.Arr(
                                    delegateTypeItem.Params.Select(
                                        param => param.Value).ToArray()) ?? []);
                            }
                            else if (retItem is GenericDelegateTypeItem genericDelegateTypeItem)
                            {
                                AddDependencies(retList, genericDelegateTypeItem.ReturnType?.Arr(
                                    genericDelegateTypeItem.Params.Select(
                                        param => param.Value).ToArray()) ?? []);

                                AddDependencies(retList, genericDelegateTypeItem.GenericTypeArgs);
                            }

                            return retList.RdnlC();
                        })
                };

                return typeData;
            });

            return dataLazy;
        }

        private string GetTypeIdnfName(
            Type type)
        {
            string idnfName;

            if (type.IsNested)
            {
                var nestedIdnfName = GetTypeIdnfName(
                    type.DeclaringType);

                idnfName = string.Join(".",
                    nestedIdnfName,
                    type.GetTypeDisplayName());
            }
            else
            {
                idnfName = string.Join(".",
                    type.Namespace,
                    type.GetTypeDisplayName());
            }

            return idnfName;
        }

        private TTypeItem? GetIdnfNameFactories<TTypeItem>(
            TTypeItem? typeItem,
            Type type,
            out Func<TTypeItem, string> idnfNameFactory,
            out Func<TTypeItem, string> fullIdnfNameFactory,
            Func<string> genericTypeParamsStrFactory = null)
            where TTypeItem : TypeItemCore<TTypeItem>
        {
            idnfNameFactory = item => (item.DeclaringType != null) switch
            {
                true => string.Join(".",
                    item.DeclaringType.Value.IdnfName,
                    type.GetTypeDisplayName()),
                false => string.Join(".", type.Namespace,
                    type.GetTypeDisplayName())
            };

            fullIdnfNameFactory = item => (item.DeclaringType != null) switch
            {
                true => string.Join("+",
                    item.DeclaringType.Value.FullIdnfName,
                    type.GetTypeShortDisplayName() + genericTypeParamsStrFactory?.Invoke()),
                false => string.Join(".", type.Namespace,
                    type.GetTypeShortDisplayName() + genericTypeParamsStrFactory?.Invoke())
            };

            return typeItem;
        }

        private List<Lazy<TypeItemCoreBase>>? GetAllDependencies(
            TypeItemCoreBase? typeItem)
        {
            var retList = new List<Lazy<TypeItemCoreBase>>();

            typeItem.GetData()?.Value.ActIfNotNull(data =>
            {
                retList.AddRange(data.AllTypeDependencies.Value);
            },
            () =>
            {
                if (typeItem is GenericInteropTypeItem genericInteropTypeItem)
                {
                    AddDependencies(retList, genericInteropTypeItem.GenericTypeArgs.Select(
                        arg => arg.Value.TypeArg).NotNull());
                }
                else if (typeItem is ElementTypeItem elementTypeItem)
                {
                    AddDependencies(retList, [ elementTypeItem.ElementType ]);
                }
                else if (typeItem is DelegateTypeItem delegateTypeItem)
                {
                    AddDependencies(retList, [delegateTypeItem.ReturnType]);

                    AddDependencies(retList, delegateTypeItem.Params.Select(
                        param => param.Value.Value));
                }
                else if (typeItem is GenericDelegateTypeItem genericDelegateTypeItem)
                {
                    AddDependencies(retList, [genericDelegateTypeItem.ReturnType]);

                    AddDependencies(retList, genericDelegateTypeItem.Params.Select(
                        param => param.Value.Value));

                    AddDependencies(retList, genericDelegateTypeItem.GenericTypeArgs.Select(
                        arg => arg.Value.TypeArg).NotNull());
                }
            });

            return retList;
        }

        private void AddDependencies(
            List<Lazy<TypeItemCoreBase?>> list,
            IEnumerable<Lazy<GenericTypeArg>?> itemsToAdd) => AddDependencies(
                list, itemsToAdd.SelectMany(arg => new Lazy<TypeItemCoreBase>(
                    arg.Value.TypeArg!).Arr(arg.Value.Param?.ParamConstraints?.With(
                        paramConstraints => paramConstraints.BaseClass.Arr(
                            paramConstraints.RestOfTypes.ToArray())) ?? [])));

        private void AddDependencies(
            List<Lazy<TypeItemCoreBase?>> list,
            IEnumerable<TypeItemCoreBase?> itemsToAdd) => AddDependencies(
                list, itemsToAdd?.Select(item => new Lazy<TypeItemCoreBase>(item)));

        private void AddDependencies(
            List<Lazy<TypeItemCoreBase?>> list,
            IEnumerable<Lazy<TypeItemCoreBase>?>? itemsToAdd)
        {
            if (itemsToAdd != null)
            {
                foreach (var lazy in itemsToAdd)
                {
                    if (IsDependency(lazy?.Value))
                    {
                        list.Add(lazy);
                    }
                }
            }
        }

        private bool IsDependency(
            TypeItemCoreBase? typeItem) => typeItem?.Kind == TypeItemKind.Regular;

        private bool IsDelegateType(
            WorkArgs wka,
            Type type)
        {
            bool retVal = type.BaseType?.FullName == wka.MulticastDelegateType.FullIdnfName;
            return retVal;
        }
    }
}
