using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.NetCore.Reflection.AssemblyLoading;

namespace Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript
{
    public partial class ProgramComponent
    {
        private string GetAsmbDestnDirPath(
            TypeWorkArgs wka,
            AssemblyItem asmbItem) => GetAsmbDestnDirBasePath(
                wka,
                wka.PgArgs.Profile.IsTurmerikAssemblyPredicate(
                    asmbItem.BclItem));

        private string GetAsmbDestnDirBasePath(
            TypeWorkArgs wka,
            bool isTurmerikAssembly)
        {
            string dirName = isTurmerikAssembly switch
            {
                true => wka.PgArgs.Profile.DestnCsProjectAssembliesDirName,
                false => wka.PgArgs.Profile.DestnExternalAssemblliesDirName
            };

            string retPath = Path.Combine(
                wka.Section.DirPaths.DestnPath, dirName);

            return retPath;
        }

        private string GetTypeDestnRelFilePath(
            TypeWorkArgs wka,
            string trgFilePath,
            TypeItemCoreBase depTypeItem)
        {
            string depFilePath = GetTypeDestnFilePath(
                wka, depTypeItem, out _);

            string typeDestnRelFilePath = GetTypeDestnRelFilePath(
                trgFilePath, depFilePath);

            return typeDestnRelFilePath;
        }

        private string GetTypeDestnRelFilePath(
            string trgFilePath,
            string depFilePath)
        {
            var trgPathPartsArr = trgFilePath.Split(
                ['/', '\\']);

            var depPathPartsArr = depFilePath.Split(
                ['/', '\\']);

            var firstDiffKvp = trgPathPartsArr.FirstKvp(
                (str, idx) => str != depPathPartsArr[idx]);

            if (firstDiffKvp.Key < 0)
            {
                throw new InvalidOperationException(
                    $"File paths should not be identical: {trgFilePath}");
            }

            var retPathPartsList = Enumerable.Range(0,
                trgPathPartsArr.Length - firstDiffKvp.Key - 1).Select(
                idx => "..").ToList();

            retPathPartsList.AddRange(
                depPathPartsArr.Skip(
                    firstDiffKvp.Key + 1));

            string retPath = Path.Combine(
                retPathPartsList.ToArray());

            return retPath;
        }

        private string GetTypeDestnFilePath(
            TypeWorkArgs wka,
            TypeItemCoreBase typeItem,
            out string shortTypeName)
        {
            var idnfItem = typeItem.GetIdnf().Value;
            var asmbItem = idnfItem.AssemblyItem;

            string asmbDirPath = GetAsmbDestnDirPath(
                wka, asmbItem);

            string relDirPath = GetTypeDestnRelDirPath(
                wka, idnfItem.IdnfName,
                out shortTypeName);

            string dirPath = Path.Combine(
                asmbDirPath, relDirPath);

            Directory.CreateDirectory(dirPath);

            string filePath = Path.Combine(
                dirPath,
                wka.PgArgs.Profile.TypeDefFileName);

            return filePath;
        }

        private string GetTypeDestnRelDirPath(
            TypeWorkArgs wka,
            string fullTypeName,
            out string shortTypeName)
        {
            var relNsPartsArr = fullTypeName.Split('.');
            shortTypeName = relNsPartsArr.Last();

            var pathPartsArr = relNsPartsArr.Select(
                part => Path.Combine(
                    wka.PgArgs.Profile.TypesHcyNodeDirName,
                    part)).ToArray();

            shortTypeName = ReflH.GetTypeShortDisplayName(
                shortTypeName);

            string relDirPath = Path.Combine(
                pathPartsArr);

            return relDirPath;
        }

        private AssemblyLoaderOpts.TypeOpts GetTypeOpts(
            ProgramConfig.DotNetType type)
        {
            var typeOpts = new AssemblyLoaderOpts.TypeOpts
            {
                TypeName = type.Name,
                FullTypeName = type.FullName,
                GenericTypeParamsCount = type.GenericTypeParamsCount,
                DeclaringTypeOpts = type.DeclaringType?.With(GetTypeOpts)
            };

            return typeOpts;
        }

        private Dictionary<string, TypeItemCoreBase?>? GetTypeDepNames(
            TypeWorkArgs wka)
        {
            Dictionary<string, TypeItemCoreBase?>? retMap = null;

            var allDeps = wka.TypeKvp.Value.GetData(
                )?.Value.AllTypeDependencies.Value.Where(
                    type => type.Value.Kind >= TypeItemKind.Regular);

            var typeNamesList = allDeps?.Select(
                depType => depType.Value.IdnfName).ToList().Distinct().ToList();

            var typeNamesMap = typeNamesList?.ToDictionary(
                name => name, name => allDeps!.First(
                    dep => dep.Value.IdnfName == name).Value);

            if (typeNamesMap != null)
            {
                retMap = new() { { wka.TypeKvp.Key, wka.TypeKvp.Value } };

                foreach (var kvp in typeNamesMap)
                {
                    string shortName = kvp.Value.ShortName;

                    string uniqueShortName = GetUniqueTypeShortName(
                        retMap, shortName, kvp.Value);
                }
            }

            return retMap;
        }

        private string GetUniqueTypeShortName(
            Dictionary<string, TypeItemCoreBase?> typeNamesMap,
            string shortTypeName,
            TypeItemCoreBase? typeItem)
        {
            string retShortName = shortTypeName;
            int idx = 1;

            while (typeNamesMap.Keys.Contains(retShortName))
            {
                retShortName = shortTypeName + idx++;
            }

            typeNamesMap.Add(
                retShortName,
                typeItem);

            return retShortName;
        }

        private string GetUniqueIdentifier(
            TsCodeWorkArgs wka,
            string idnf)
        {
            string retIdnf = idnf;
            int idx = 1;

            while (wka.TypeNamesMap!.Keys.Contains(
                retIdnf) || wka.IdentifierNamesStack.Any(
                    list => list.Contains(retIdnf)))
            {
                retIdnf = idnf + idx++;
            }

            List<string> currentList = wka.IdentifierNamesStack.Peek();
            currentList.Add(retIdnf);
            return retIdnf;
        }

        private Dictionary<TypeItemKind, string> GetPrimitiveNamesMapCore() => new()
        {
            { TypeItemKind.RootObject, "any" },
            { TypeItemKind.RootValueType, "any" },
            { TypeItemKind.VoidType, "void" },
            { TypeItemKind.String, "string" },
            { TypeItemKind.Boolean, "boolean" },
            { TypeItemKind.Number, "number" },
            { TypeItemKind.Date, "Date" },
        };

        private Dictionary<bool, Dictionary<TypeItemKind, string>> GetPrimitiveNamesMap()
        {
            var mapCore = GetPrimitiveNamesMapCore();
            var nllblMapCore = mapCore.ToDictionary();

            var dateTypesArr = TypeItemKind.Date.Arr(
                TypeItemKind.String,
                TypeItemKind.Number);

            var dateTypeStrArr = dateTypesArr.Select(
                kind => mapCore[kind]).ToArray();

            var nllblDateTypesArr = dateTypeStrArr.Select(
                str => $"{str}?").ToArray();

            mapCore[TypeItemKind.Date] = string.Join(
                " | ", dateTypeStrArr);

            nllblMapCore[TypeItemKind.Date] = string.Join(
                " | ", nllblDateTypesArr);

            return new Dictionary<bool, Dictionary<TypeItemKind, string>>
            {
                { false, mapCore }, { true, nllblMapCore }
            };
        }

        private ReadOnlyDictionary<bool, ReadOnlyDictionary<TypeItemKind, string>> GetRdnlPrimitiveNamesMap(
            ) => GetPrimitiveNamesMap().AsEnumerable().ToDictionary(
                kvp => kvp.Key, kvp => kvp.Value.RdnlD()).RdnlD();
    }
}
