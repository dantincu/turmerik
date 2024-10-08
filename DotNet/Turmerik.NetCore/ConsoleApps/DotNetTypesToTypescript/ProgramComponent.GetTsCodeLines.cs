using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.NetCore.Reflection.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public partial class ProgramComponent
    {
        private List<string> GetTsCodeLines(
            TsCodeWorkArgs wka)
        {
            List<string> retList = GetDependencyImportTsCodeList(wka);

            var typeItemValue = wka.TypeKvp.Value.TypeItem;

            if (typeItemValue is EnumTypeItem enumTypeItem)
            {
                AddEnumTypeTsCodeLines(retList, wka, enumTypeItem);
            }
            else if (typeItemValue is RegularTypeItem typeItem)
            {
                AddRegularTypeTsCodeLines(retList, wka, typeItem);
            }
            else if (typeItemValue is DelegateTypeItem delegateTypeItem)
            {
                AddDelegateTypeTsCodeLines(retList, wka, delegateTypeItem);
            }
            else if (typeItemValue is GenericDelegateTypeItem genericDelegateTypeItem)
            {
                AddGenericDelegateTypeTsCodeLines(retList, wka, genericDelegateTypeItem);
            }
            else if (typeItemValue is GenericTypeItem genericTypeItem)
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

        private List<string> GetDependencyImportTsCodeList(
            TsCodeWorkArgs wka)
        {
            var retList = new List<string>();

            foreach (var kvp in wka.TypesMap!.Skip(1))
            {
                if (kvp.Value.TypeItem.Kind >= TypeItemKind.Regular)
                {
                    string idnf = kvp.Key;
                    string shortName = kvp.Value.TypeItem.Name;

                    if (idnf != shortName)
                    {
                        idnf = $"{shortName} as {idnf}";
                    }

                    string filePath = GetTypeDestnRelFilePath(
                        wka, wka.TypeKvp.Value.TsFilePath, kvp.Value.TypeItem);

                    filePath = filePath.Replace("\\", "\\\\");

                    string tsCodeLine = $"import {{ {idnf} }} from \"{filePath}\";";
                    retList.Add(tsCodeLine);
                }
            }

            if (retList.Any())
            {
                retList.Add("");
            }

            return retList;
        }

        private void AddEnumTypeTsCodeLines(
            List<string> retList,
            TsCodeWorkArgs wka,
            EnumTypeItem enumTypeItem)
        {
            retList.AddRange([
                $"export enum {enumTypeItem.Name} {{",
                    ..AllEnumMembers(wka, enumTypeItem),
                "}"]);
        }

        private void AddRegularTypeTsCodeLines(
            List<string> retList,
            TsCodeWorkArgs wka,
            RegularTypeItem typeItem)
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

        private void AddGenericDelegateTypeTsCodeLines(
            List<string> retList,
            TsCodeWorkArgs wka,
            GenericDelegateTypeItem typeItem) => AddDelegateTypeTsCodeLinesCore(
                retList, wka, typeItem, typeItem.GenericArgs);

        private void AddDelegateTypeTsCodeLines(
            List<string> retList,
            TsCodeWorkArgs wka,
            DelegateTypeItem typeItem) => AddDelegateTypeTsCodeLinesCore(
                retList, wka, typeItem, null);

        private void AddDelegateTypeTsCodeLinesCore<TDelegateTypeItem>(
            List<string> retList,
            TsCodeWorkArgs wka,
            TDelegateTypeItem typeItem,
            ReadOnlyCollection<Lazy<GenericTypeArg>>? genericMethodArgs)
            where TDelegateTypeItem : DelegateTypeItem
        {
            var methodTsCode = GetMethodDefTsCode(
                wka, typeItem.ReturnType,
                typeItem.Params,
                genericMethodArgs);

            methodTsCode = $"export type {typeItem.Name} = {methodTsCode};";
            retList.Add(methodTsCode);
        }

        private void AddTsIntfCodeLines<TTypeItem>(
            List<string> codeLines,
            TsCodeWorkArgs wka,
            TTypeItem typeItem,
            string? genericTypeIdnfNamePart = null,
            string? genericTypeDeclrNamePart = null)
            where TTypeItem : RegularTypeItemBase
        {
            var data = typeItem.TypeData.Value;

            var propsMap = data.PubInstnProps!.GroupBy(
                prop => prop.Name).ToDictionary(
                g => g.Key, g => g.ToList()).ToArray();

            var methodsMap = data.PubInstnMethods!.GroupBy(
                prop => prop.Name).ToDictionary(
                g => g.Key, g => g.ToList()).ToArray();

            var propsMapLen = propsMap.Length;
            var methodsLen = methodsMap.Length;

            var intfNamesArr = Enumerable.Range(
                1, Math.Max(
                    propsMapLen,
                    methodsLen)).Select(
                idx => GetUniqueTypeShortName(wka,
                    wka.TypeKvp.Value.DepTypesMap,
                    typeItem.Name,
                    wka.TempTypeNames)).ToArray();

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
                    true => propsMap[i].Value,
                    _ => null
                };

                var methodsList = (i < methodsLen) switch
                {
                    true => methodsMap[i].Value,
                    _ => null
                };

                string intfName = intfDeclrNamesArr[i];

                codeLines.Add($"export interface {intfName} {{");

                AddTsIntfCodeLines(
                    new TsIntfCodeWorkArgs(
                        wka,
                        codeLines),
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

            typeItem.TypeData.Value.BaseType?.Value.IfNotNull(baseType => (
                baseType.Kind >= TypeItemKind.Regular).ActIf(
                    () => intfIdnfNamesList.Add(
                        GetTsTypeName(wka, baseType))));

            intfIdnfNamesList.AddRange(
                typeItem.TypeData.Value.InterfaceTypes.Select(
                    type => GetTsTypeName(wka, type.Value)));

            codeLines.Add(GetMainTsIntfDeclrLine(
                wka, genericTypeDeclrNamePart,
                intfIdnfNamesList));
        }

        private void AddTsIntfCodeLines<TTypeItem>(
            TsIntfCodeWorkArgs wka,
            TTypeItem typeItem)
            where TTypeItem : RegularTypeItemBase
        {
            typeItem.TypeData.Value.PubInstnProps?.ActWith(
                propsList => wka.CodeLines.AddRange(
                    propsList.Select(prop => GetPropTsCodeLine(
                        wka, prop))));

            typeItem.TypeData.Value.PubInstnMethods?.ActWith(
                methodsList => wka.CodeLines.AddRange(
                    methodsList.Select(method => GetMethodTsCodeLine(
                        wka, method))));
        }

        private string GetPropTsCodeLine(
            TsCodeWorkArgs wka,
            PropertyItem prop) => GetTsTypeName(
                wka, prop.PropertyType.Value).With(
                    propTypeName => IntfMember(wka, prop.Name, propTypeName));

        private string GetMethodTsCodeLine(
            TsCodeWorkArgs wka,
            MethodItem method) => IntfMember(
                wka, method.Name, GetMethodDefTsCode(
                wka, method.ReturnType, method.Params,
                (method as GenericMethodItem)?.GenericArgs));

        private string GetMethodDefTsCode(
            TsCodeWorkArgs wka,
            Lazy<TypeItemCoreBase> returnType,
            ReadOnlyDictionary<string, Lazy<TypeItemCoreBase>> @params,
            ReadOnlyCollection<Lazy<GenericTypeArg>>? genericMethodArgs)
        {
            var genericMethodArgsStr = genericMethodArgs?.With(
                args => GetGenericArgsTsNamePart(wka, args, true));

            wka.PushIdentifierNames();

            var paramsStr = string.Join(", ",
                @params.Select(
                    param => GetUniqueIdentifier(
                    wka, param.Key).With(paramName => string.Join(
                        ": ", paramName, GetTsTypeName(
                    wka, param.Value.Value)))));

            wka.PopIdentifierNames();
            paramsStr = $"{genericMethodArgsStr}({paramsStr})";

            var returnTypeStr = returnType.Value.With(
                returnType => returnType.Kind switch
                {
                    TypeItemKind.VoidType => "void",
                    TypeItemKind.DelegateRoot => "Function",
                    _ => GetTsTypeName(
                        wka, returnType)
                });

            string retStr = $"{paramsStr} => {returnTypeStr}";
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
                        wka.TypesMap!.First().Value!.TypeItem.Name,
                        genericTypeDeclrNamePart),
                    string.Join(
                        ", ",
                        intfIdnfNamesList)), "{ }");

        private string GetGenericTsTypeNamePart(
            TsCodeWorkArgs wka,
            GenericTypeItem genericTypeItem,
            bool isForDeclr) => GetGenericArgsTsNamePart(
                wka, genericTypeItem.GenericArgs, isForDeclr);

        private string GetGenericTsTypeNamePart(
            TsCodeWorkArgs wka,
            GenericDelegateTypeItem genericDelegateTypeItem,
            bool isForDeclr) => GetGenericArgsTsNamePart(
                wka, genericDelegateTypeItem.GenericArgs, isForDeclr);

        private string GetGenericTsTypeNamePart(
            TsCodeWorkArgs wka,
            GenericMethodItem genericMethodItem,
            bool isForDeclr) => GetGenericArgsTsNamePart(
                wka, genericMethodItem.GenericArgs, isForDeclr);

        private string GetGenericArgsTsNamePart(
            TsCodeWorkArgs wka,
            ReadOnlyCollection<Lazy<GenericTypeArg>> genericArgs,
            bool isForDeclr) => string.Concat(
                "<", string.Join(", ", genericArgs.Select(
                    arg => GetGenericTsTypeArgNamePart(
                        wka, arg.Value, isForDeclr))), ">");

        private string GetGenericTsTypeArgNamePart(
            TsCodeWorkArgs wka,
            GenericTypeArg genericTypeArg,
            bool isForDeclr) => genericTypeArg.TypeArg?.With(
                typeArg => GetTsTypeName(wka, typeArg)) ?? isForDeclr switch
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

            if (typeItem is EnumTypeItem enumTypeItem)
            {
                retStr = GetDotTypeDataFromMap(wka, enumTypeItem).Key;
            }
            else if (typeItem is ElementTypeItem elementTypeItem)
            {
                var elementTypeStr = GetTsTypeName(
                    wka, elementTypeItem.ElementType,
                    elementTypeItem.Kind == TypeItemKind.Nullable);

                switch (elementTypeItem.Kind)
                {
                    case TypeItemKind.Array:
                        retStr = elementTypeStr + "[]";
                        break;
                    default:
                        var elemType = wka.PgArgs.Profile.TsElementTypesMap[
                            elementTypeItem.Kind];

                        retStr = $"{elemType.TypeName}<{elementTypeStr}>";
                        break;
                }
            }
            else if (typeItem is CommonTypeItem typeItemCore)
            {
                retStr = PrimitiveNamesMap[isForNullable][typeItemCore.Kind];
            }
            else if (typeItem is GenericInteropTypeItem genericInteropTypeItem)
            {
                var genericArgsArr = genericInteropTypeItem.SelectGenericTypeArgs().ToArray();

                switch (genericInteropTypeItem.Kind)
                {
                    case TypeItemKind.Nullable:
                        retStr = genericArgsArr.Single();
                        break;
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
            else if (typeItem is RegularTypeItem regularTypeItem)
            {
                retStr = GetDotTypeDataFromMap(wka, regularTypeItem).Key;
            }
            else if (typeItem is DelegateTypeItem delegateTypeItem)
            {
                retStr = GetDotTypeDataFromMap(wka, delegateTypeItem).Key;
            }
            else if (typeItem is GenericTypeItem genericTypeItem)
            {
                var genericTypeArgsStr = GetGenericTsTypeNamePart(
                    wka, genericTypeItem, false);

                retStr = GetDotTypeDataFromMap(wka, genericTypeItem).Key;
                retStr += genericTypeArgsStr;
            }
            else if (typeItem is GenericDelegateTypeItem genericDelegateTypeItem)
            {
                var genericTypeArgsStr = GetGenericTsTypeNamePart(
                    wka, genericDelegateTypeItem, false);

                retStr = GetDotTypeDataFromMap(wka, genericDelegateTypeItem).Key;
                retStr += genericTypeArgsStr;
            }
            else if (typeItem is GenericTypeParameter)
            {
                retStr = typeItem.IdnfName;
            }
            else
            {
                throw new NotSupportedException(
                    typeItem.GetType().FullName);
            }

            return retStr;
        }

        private KeyValuePair<string, DotNetTypeData> GetDotTypeDataFromMap(
            TsCodeWorkArgs wka,
            TypeItemBase typeItem) => wka.TypesMap.First(
                kvp => kvp.Key == typeItem.IdnfName);

        private string[] GetGenericTypeArgsArr<TTypeItem>(
            TsCodeWorkArgs wka,
            TTypeItem typeItem,
            Func<TTypeItem, ReadOnlyCollection<Lazy<GenericTypeArg>>> genericTypeArgsFactory,
            bool isNullable)
            where TTypeItem : TypeItemCoreBase => genericTypeArgsFactory(typeItem).With(
                genericTypeArgs => genericTypeArgs.Select(arg => arg.Value.TypeArg?.With(
                    typeArg => GetTsTypeName(
                        wka, typeArg, isNullable)) ?? arg.Value.Param!.Name)).ToArray();

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
