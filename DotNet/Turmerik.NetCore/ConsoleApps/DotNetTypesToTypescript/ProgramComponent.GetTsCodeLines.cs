﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.NetCore.Reflection.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public partial class ProgramComponent
    {
        private List<string> GetTsCodeLines(
            TsCodeWorkArgs wka)
        {
            List<string> retList = [];

            if (wka.TypeKvp.Value is EnumTypeItem enumTypeItem)
            {
                AddEnumTypeTsCodeLines(retList, wka, enumTypeItem);
            }
            else if (wka.TypeKvp.Value is TypeItem typeItem)
            {
                AddRegularTypeTsCodeLines(retList, wka, typeItem);
            }
            else if (wka.TypeKvp.Value is GenericTypeItem genericTypeItem)
            {
                AddGenericTypeTsCodeLines(
                    retList, wka, genericTypeItem,
                    GetGenericTsTypeNamePart(wka, genericTypeItem, false),
                    GetGenericTsTypeNamePart(wka, genericTypeItem, true));
            }
            else
            {
                throw new NotSupportedException();
            }

            return retList;
        }

        private void AddEnumTypeTsCodeLines(
            List<string> retList,
            TsCodeWorkArgs wka,
            EnumTypeItem enumTypeItem)
        {
            retList.AddRange([
                $"export enum {enumTypeItem.ShortName} {{",
                    ..AllEnumMembers(wka, enumTypeItem),
                "}"]);
        }

        private void AddRegularTypeTsCodeLines(
            List<string> retList,
            TsCodeWorkArgs wka,
            TypeItem typeItem)
        {
            AddTsIntfCodeLines(
                retList, wka, typeItem);
        }

        private void AddGenericTypeTsCodeLines(
            List<string> retList,
            TsCodeWorkArgs wka,
            GenericTypeItem genericTypeItem,
            string genericTypeNamePart,
            string genericTypeDeclrNamePart)
        {
            AddTsIntfCodeLines(
                retList, wka, genericTypeItem,
                genericTypeNamePart,
                genericTypeDeclrNamePart);
        }

        private void AddTsIntfCodeLines<TTypeItem>(
            List<string> codeLines,
            TsCodeWorkArgs wka,
            TTypeItem typeItem,
            string? genericTypeIdnfNamePart = null,
            string? genericTypeDeclrNamePart = null)
            where TTypeItem : TypeItem<TTypeItem>
        {
            var data = typeItem.Data.Value;

            var propsMap = data.PubInstnProps.GroupBy(
                prop => prop.Name).ToDictionary(
                g => g.Key, g => g.ToList().ActWith(
                    propsList => propsList.Sort(CompareProps))).ToArray();

            var methodsMap = data.PubInstnMethods.GroupBy(
                prop => prop.Name).ToDictionary(
                g => g.Key, g => g.ToList().ActWith(
                    propsList => propsList.Sort(CompareMethods))).ToArray();

            var propsMapLen = propsMap.Length;
            var methodsLen = methodsMap.Length;

            var intfNamesArr = Enumerable.Range(
                1, Math.Max(
                    propsMapLen,
                    methodsLen)).Select(
                idx => GetUniqueTypeShortName(
                    wka.TypeNamesMap!,
                    wka.ShortTypeName,
                    null)).ToArray();

            var intfDeclrNamesArr = (genericTypeIdnfNamePart != null) switch
            {
                true => intfNamesArr.Select(name => string.Concat(
                    name, genericTypeDeclrNamePart)).ToArray(),
                false => intfNamesArr
            };

            for (int i = 0; i < intfNamesArr.Length; i++)
            {
                var propsList = (i < propsMapLen) switch
                {
                    true => propsMap[i].Value
                };

                var methodsList = (i < methodsLen) switch
                {
                    true => methodsMap[i].Value
                };

                string intfName = intfDeclrNamesArr[i];

                codeLines.Add($"export interface {intfName} {{");

                AddTsIntfCodeLines(
                    new TsIntfCodeWorkArgs(
                        wka,
                        codeLines,
                        propsList,
                        methodsList),
                        typeItem);

                codeLines.Add("}");
                codeLines.Add("");
            }

            var intfIdnfNamesList = (genericTypeIdnfNamePart != null) switch
            {
                true => intfNamesArr.Select(name => string.Concat(
                    name, genericTypeIdnfNamePart)).ToList(),
                false => intfNamesArr.ToList()
            };

            typeItem.Data.Value.BaseType?.Value.IfNotNull(baseType => (
                baseType.Kind >= TypeItemKind.Regular).ActIf(
                    () => intfIdnfNamesList.Add(
                        GetTsTypeName(wka, baseType))));

            intfIdnfNamesList.AddRange(
                typeItem.Data.Value.InterfaceTypes.Select(
                    type => GetTsTypeName(wka, type.Value)));

            codeLines.Add(GetMainTsIntfDeclrLine(
                wka, genericTypeDeclrNamePart,
                intfIdnfNamesList));
        }

        private void AddTsIntfCodeLines<TTypeItem>(
            TsIntfCodeWorkArgs wka,
            TTypeItem typeItem)
            where TTypeItem : TypeItem<TTypeItem>
        {
            wka.Props?.ActWith(
                propsList => wka.CodeLines.AddRange(
                    propsList.Select(prop => GetPropTsCodeLine(
                        wka, prop))));

            wka.Methods?.ActWith(
                methodsList => wka.CodeLines.AddRange(
                    methodsList.Select(method => GetMethodTsCodeLine(
                        wka, method))));
        }

        private string GetPropTsCodeLine(
            TsCodeWorkArgs wka,
            PropertyItem prop) => GetTypeItemFromMap(
                wka, prop.PropertyType.Value).Key.With(
                    propTypeStr => IntfMember(wka, prop.Name, propTypeStr));

        private string GetMethodTsCodeLine(
            TsCodeWorkArgs wka,
            MethodItem method)
        {
            var retStrPartsList = new List<string>
            {
                wka.PgArgs.Config.TsTabStr,
                method.Name,
                ": ("
            };

            wka.PushIdentifierNames();

            var paramsStr = string.Join(",",
                method.Params.Select(
                    param => GetUniqueIdentifier(
                    wka, param.Key).With(paramName => string.Join(
                        ": ", paramName, GetTypeItemFromMap(
                            wka, param.Value.Value).Key))));

            wka.PopIdentifierNames();
            paramsStr = $"({paramsStr})";

            var returnTypeStr = method.ReturnType.Value.With(
                returnType => returnType.Kind switch
                {
                    TypeItemKind.VoidType => "void",
                    _ => GetTypeItemFromMap(wka, returnType).Key
                });

            string retStr = IntfMember(wka, method.Name,
                $"({paramsStr}) => {returnTypeStr}");

            return retStr;
        }

        private string GetMainTsIntfDeclrLine(
            TsCodeWorkArgs wka,
            string? genericTypeDeclrNamePart,
            List<string> intfIdnfNamesList) => string.Join(" ",
                "export interface",
                string.Join(
                    " extends ",
                    string.Concat(
                        wka.TypeNamesMap!.First().Key,
                        genericTypeDeclrNamePart),
                    string.Join(
                        ", ",
                        intfIdnfNamesList)), "{ }");

        private string GetGenericTsTypeNamePart(
            TsCodeWorkArgs wka,
            GenericTypeItem genericTypeItem,
            bool isForDeclr) => string.Concat(
                "<", string.Join(",", genericTypeItem.GenericTypeArgs.Select(
                    arg => GetGenericTsTypeArgNamePart(
                        wka, arg.Value, isForDeclr))), ">");

        private string GetGenericTsTypeArgNamePart(
            TsCodeWorkArgs wka,
            GenericTypeArg genericTypeArg,
            bool isForDeclr) => genericTypeArg.TypeArg?.With(
                typeArg => GetTypeItemFromMap(wka, typeArg).Key) ?? isForDeclr switch
                    {
                        true => GetGenericTsTypeParamNamePart(wka, genericTypeArg.Param!),
                        false => genericTypeArg.Param!.Name
                    };

        private string GetGenericTsTypeParamNamePart(
            TsCodeWorkArgs wka,
            GenericTypeParameter genericParam) => GetGenericTsTypeParamConstrTypes(
                wka, genericParam.ParamConstraints).With(
                    typesList => typesList.Any() switch
                    {
                        true => string.Join(
                            " extends ",
                            genericParam.Name,
                            string.Join(
                                ", ",
                                typesList.Select(
                                    type => GetTsTypeName(wka, type)))),
                        false => genericParam.Name
                    });

        private List<TypeItemCoreBase> GetGenericTsTypeParamConstrTypes(
            TsCodeWorkArgs wka,
            GenericTypeParamConstraints constr) => (
            constr.BaseClass?.Value.Lst() ?? []).ActWith(
                typesList => typesList.AddRange(
                    constr.RestOfTypes.Select(
                        lazy => lazy.Value))).With(list => list.Where(
                            type => type.Kind >= TypeItemKind.Regular).ToList());

        private string GetTsTypeName(
            TsCodeWorkArgs wka,
            TypeItemCoreBase typeItem,
            bool isForNullable = false)
        {
            string retStr;

            if (typeItem is TypeItemCore typeItemCore)
            {
                retStr = PrimitiveNamesMap[isForNullable][typeItemCore.Kind];
            }
            else if (typeItem is EnumTypeItem enumTypeItem)
            {
                retStr = GetTypeItemFromMap(wka, enumTypeItem).Key;
            }
            else if (typeItem is GenericInteropTypeItem genericInteropTypeItem)
            {
                var genericArgsArr = GetGenericTypeArgsArr(
                    wka, genericInteropTypeItem,
                    item => item.GenericTypeArgs,
                    genericInteropTypeItem.Kind == TypeItemKind.Nullable);

                switch (genericInteropTypeItem.Kind)
                {
                    case TypeItemKind.Nullable:
                        retStr = genericArgsArr.Single();
                        break;
                    case TypeItemKind.Array:
                    case TypeItemKind.Enumerable:
                        retStr = genericArgsArr.Single() + "[]";
                        break;
                    case TypeItemKind.Dictionary:
                        wka.PushIdentifierNames();
                        string keyIdnfName = GetUniqueIdentifier(wka, "key");
                        wka.PopIdentifierNames();
                        retStr = $"{{ [{keyIdnfName}: {genericArgsArr[0]}]: {genericArgsArr[1]} }}";
                        break;
                    default:
                        throw new InvalidOperationException(
                            $"Type {typeItem.FullIdnfName} should not be of kind {genericInteropTypeItem.Kind}");
                }
            }
            else if (typeItem is TypeItem regularTypeItem)
            {
                retStr = GetTypeItemFromMap(wka, regularTypeItem).Key;
            }
            else if (typeItem is GenericTypeItem genericTypeItem)
            {
                var genericTypeArgsStr = GetGenericTsTypeNamePart(
                    wka, genericTypeItem, false);

                retStr = GetTypeItemFromMap(wka, genericTypeItem).Key;
                retStr += genericTypeArgsStr;
            }
            else
            {
                throw new NotSupportedException(
                    typeItem.GetType().FullName);
            }

            return retStr;
        }

        private string[] GetGenericTypeArgsArr<TTypeItem>(
            TsCodeWorkArgs wka,
            TTypeItem typeItem,
            Func<TTypeItem, ReadOnlyCollection<Lazy<GenericTypeArg>>> genericTypeArgsFactory,
            bool isNullable)
            where TTypeItem : TypeItemCoreBase => genericTypeArgsFactory(typeItem).With(
                genericTypeArgs => genericTypeArgs.Select(arg => arg.Value.TypeArg?.With(
                    typeArg => GetTsTypeName(
                        wka, typeArg, isNullable)) ?? arg.Value.Param!.Name)).ToArray();

        private KeyValuePair<string, TypeItemCoreBase?> GetTypeItemFromMap(
            TsCodeWorkArgs wka,
            TypeItemCoreBase typeItem) => wka.TypeNamesMap!.Skip(1).FirstOrDefault(
                kvp => kvp.Value?.IdnfName == typeItem.IdnfName).With(
                kvp => kvp.Key.IfNotNull(str => kvp,
                    () => new KeyValuePair<string, TypeItemCoreBase?>("any", null)));

        private string IntfMember(
            TsCodeWorkArgs wka,
            string memberName,
            string memberValue) => MemberCore(wka,
                $"{memberName}: {memberValue};");

        private IEnumerable<string> AllEnumMembers(
            TsCodeWorkArgs wka,
            EnumTypeItem enumTypeItem) => enumTypeItem.DefinedValuesMap.Select(
                kvp => EnumMember(wka, kvp.Key, kvp.Value));

        private string EnumMember(
            TsCodeWorkArgs wka,
            string memberName,
            object memberValue) => MemberCore(wka,
                $"{memberName} = {memberValue},");

        private string MemberCore(
            TsCodeWorkArgs wka,
            string memberStr) => string.Concat(
                wka.PgArgs.Config.TsTabStr,
                memberStr);
    }
}