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
            SectionWorkArgs wka,
            AssemblyItem asmbItem) => Path.Combine(
                GetAsmbDestnDirBasePath(
                    wka,
                    wka.PgArgs.Profile.IsTurmerikAssemblyPredicate(
                        asmbItem.BclItem)),
                asmbItem.Name);

        private string GetAsmbDestnDirBasePath(
            SectionWorkArgs wka,
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
            SectionWorkArgs wka,
            string trgFilePath,
            TypeItemBase depTypeItem)
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
                trgPathPartsArr.Length - firstDiffKvp.Key).Select(
                idx => "..").ToList();

            retPathPartsList.AddRange(
                depPathPartsArr.Skip(
                    firstDiffKvp.Key));

            string retPath = Path.Combine(
                retPathPartsList.ToArray());

            return retPath;
        }

        private string GetTypeDestnFilePath(
            SectionWorkArgs wka,
            TypeItemBase typeItem,
            out string shortTypeName)
        {
            var asmbItem = typeItem.GetAssemblyItem(
                ) ?? throw new InvalidOperationException(
                    $"Need to receive a type with an assembly but received {typeItem.FullIdnfName} that has no assembly attached");

            var asmbDirName = typeItem.NsStartsWithAsmbPfx.Value switch
            {
                true => wka.PgArgs.Profile.AssemblyDfNsTypesDirName,
                false => wka.PgArgs.Profile.AssemblyNonDfNsTypesDirName
            };

            string asmbDirPath = GetAsmbDestnDirPath(
                wka, asmbItem);

            asmbDirPath = Path.Combine(
                asmbDirPath, asmbDirName);

            string idnfName = typeItem.IdnfName;

            if (typeItem.NsStartsWithAsmbPfx.Value)
            {
                idnfName = idnfName.Substring(
                    asmbItem.TypeNamesPfx.Length);
            }

            string relDirPath = GetTypeDestnRelDirPath(
                wka, idnfName, out shortTypeName);

            string dirPath = Path.Combine(
                asmbDirPath, relDirPath);

            Directory.CreateDirectory(dirPath);

            string filePath = Path.Combine(
                dirPath,
                wka.PgArgs.Profile.TypeDefFileName);

            return filePath;
        }

        private string GetTypeDestnRelDirPath(
            SectionWorkArgs wka,
            string fullTypeName,
            out string shortTypeName)
        {
            var relNsPartsArr = fullTypeName.Split('.');
            shortTypeName = relNsPartsArr.Last();

            var pathPartsArr = relNsPartsArr.Select(
                part => Path.Combine(
                    wka.PgArgs.Profile.TypesNodeDirName,
                    part)).ToArray();

            shortTypeName = ReflH.GetTypeDisplayName(
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

        private string GetUniqueTypeShortName(
            SectionWorkArgs wka,
            Dictionary<string, DotNetTypeDepData> typeNamesMap,
            string shortTypeName,
            TypeItemBase typeItem,
            string tsFileRelPath)
        {
            string retShortName = shortTypeName;
            int idx = 1;

            while (typeNamesMap.Keys.Contains(retShortName))
            {
                retShortName = shortTypeName + idx++;
            }

            typeNamesMap.Add(
                retShortName,
                new DotNetTypeDepData
                {
                    TypeItem = typeItem,
                    TsFileRelPath = tsFileRelPath,
                });

            return retShortName;
        }

        private string GetUniqueTypeShortName(
            SectionWorkArgs wka,
            Dictionary<string, DotNetTypeDepData> typeNamesMap,
            string shortTypeName,
            List<string> tempTypeNames)
        {
            string retShortName = shortTypeName;
            int idx = 1;

            while (typeNamesMap.Keys.Contains(
                retShortName) || tempTypeNames.Contains(
                    retShortName))
            {
                retShortName = shortTypeName + idx++;
            }

            tempTypeNames.Add(
                retShortName);

            return retShortName;
        }

        private string GetUniqueIdentifier(
            TsCodeWorkArgs wka,
            string idnf)
        {
            string retIdnf = idnf;
            int idx = 1;

            while (wka.TypeKvp.Value.DepTypesMap!.Keys.Contains(
                retIdnf) || wka.IdentifierNamesStack!.Any(
                    list => list.Contains(retIdnf)))
            {
                retIdnf = idnf + idx++;
            }

            List<string> currentList = wka.IdentifierNamesStack!.Peek();
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
