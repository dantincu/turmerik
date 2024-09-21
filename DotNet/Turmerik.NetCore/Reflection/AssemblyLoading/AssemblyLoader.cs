using System;
using System.Collections.Generic;
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
            Type type)
        {
            TypeItemCoreBase retItem;
            string idnfName = GetTypeIdnfName(type);

            if (!type.IsGenericParameter && type.IsGenericType && !type.IsGenericTypeDefinition)
            {
                if (!TryLoadGenericInteropType(
                    wka, type, out retItem))
                {
                    var genericTypeDef = LoadType(
                        wka, type.GetGenericTypeDefinition());

                    retItem = LoadTypeCore(wka, type,
                        genericTypeDef as GenericTypeItem);
                }
            }
            else
            {
                var asmbItem = GetAssemblyItem(
                    wka, type.Assembly);

                retItem = asmbItem.TypesMap.GetOrAdd(
                    idnfName, name => LoadTypeCore(wka, type));
            }

            return retItem;
        }

        protected override TypeItemCoreBase LoadType(
            WorkArgs wka,
            AssemblyLoaderOpts.AssemblyOpts asmbOpts,
            AssemblyLoaderOpts.TypeOpts typeOpts)
        {
            throw new NotImplementedException();
        }

        private TypeItemCoreBase LoadTypeCore(
            WorkArgs wka,
            Type type,
            GenericTypeItem? genericTypeDef = null)
        {
            TypeItemCoreBase retItem = null;

            if (type.IsArray)
            {
                retItem = LoadArrayType(wka, type);
            }
            else if (type.IsEnum)
            {
                retItem = LoadEnumType(wka, type);
            }
            else if (type.IsGenericParameter)
            {
                retItem = LoadGenericParamType(wka, type);
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
                    retItem = LoadRegularType(
                        wka, type, genericTypeDef);
                }
            }

            return retItem;
        }

        private TypeItemCoreBase LoadArrayType(
            WorkArgs wka,
            Type type)
        {
            var retItem = new GenericInteropTypeItem(
                    TypeItemKind.Array,
                    item => item.GenericTypeArgs.Single().Value.IdnfName + "[]")
                {
                    GenericTypeArgs = new Lazy<GenericTypeArg>(
                        () =>
                        {
                            var elemType = type.GetElementType();
                            var typeArg = LoadType(wka, elemType);

                            var genericTypeArg = new GenericTypeArg
                            {
                                TypeArg = typeArg
                            };

                            return genericTypeArg;
                        }).Arr().RdnlC()
                };

            return retItem;
        }

        private TypeItemCoreBase LoadEnumType(
            WorkArgs wka,
            Type type)
        {
            var retItem = new EnumTypeItem(
                    TypeItemKind.Enum,
                    item => (item.DeclaringType != null) switch
                    {
                        true => string.Join("+",
                            item.DeclaringType.Value.IdnfName,
                            type.Name),
                        false => type.FullName!
                    })
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

        private TypeItemCoreBase LoadGenericParamType(
            WorkArgs wka,
            Type type)
        {
            var retItem = new GenericTypeParameter(
                    TypeItemKind.GenericParam)
            {
                Name = type.Name,
                GenericParamPosition = type.GenericParameterPosition,
                ParamConstraints = type.GetGenericParameterConstraints().With(
                        constraints =>
                        {
                            bool isStruct = type.IsValueType;
                            Lazy<TypeItemCoreBase>? baseClass = null;
                            var genericParameterAttributes = type.GenericParameterAttributes;

                            if (!isStruct)
                            {
                                if (type.BaseType?.IsValueType == false &&
                                type.BaseType.FullName != wka.RootObject.IdnfName)
                                {
                                    baseClass = new Lazy<TypeItemCoreBase>(
                                        () => LoadType(wka, type.BaseType));
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
                                RestOfTypes = constraints.Where(
                                    intf => !intf.IsValueType).Select(
                                    intf => new Lazy<TypeItemCoreBase>(
                                        () => LoadType(wka, intf))).RdnlC()
                            };

                            return retObj;
                        })
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
                fullName => typeNamesNmrbl.Contains(fullName),
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
            string fullName = type.FullName!;

            var tempData = tempDataFactory(fullName);
            bool foundMatch = isMatchPredicate(tempData);

            if (foundMatch)
            {
                var typeItemKind = typeItemKindFactory(
                    tempData);

                retItem = new TypeItemCore(
                    typeItemKind, fullName);
            }

            return foundMatch;
        }

        private TypeItemCoreBase LoadRegularType(
            WorkArgs wka,
            Type type,
            GenericTypeItem? genericTypeDef = null)
        {
            throw new NotImplementedException();
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
                    type.Name);
            }
            else
            {
                idnfName = string.Join(".",
                    type.Namespace,
                    type.Name);
            }

            return idnfName;
        }
    }
}
