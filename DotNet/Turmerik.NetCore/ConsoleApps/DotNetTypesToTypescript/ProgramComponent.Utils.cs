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
            CsProjAsmbWorkArgs wka)
        {
            string retPath;

            bool isTurmerikAssembly = wka.PgArgs.Profile.IsTurmerikAssemblyPredicate(
                wka.AsmbKvp.Value.BclItem);

            ProgramConfig.DotNetCsProject? csProj = isTurmerikAssembly switch
            {
                true => wka.Section.CsProjectsArr.SingleOrDefault(
                    csProj => csProj.Name == wka.AsmbKvp.Key)
            };

            if (csProj != null)
            {
                retPath = csProj.CsProjectAssembly.Paths.DestnPath;
            }
            else
            {
                string dirName = isTurmerikAssembly switch
                {
                    true => wka.PgArgs.Profile.DestnCsProjectAssembliesDirName,
                    false => wka.PgArgs.Profile.DestnExternalAssemblliesDirName
                };

                retPath = Path.Combine(wka.PgArgs.Profile.DirPaths.DestnPath, dirName);
            }

            return retPath;
        }

        private string GetTypeDestnRelDirPath(
            TypeWorkArgs wka,
            out string shortTypeName)
        {
            var relNsPartsArr = wka.TypeKvp.Key.Split('.');
            shortTypeName = relNsPartsArr.Last();

            var pathPartsArr = relNsPartsArr.Select(
                part => Path.Combine(
                    wka.PgArgs.Profile.TypesHcyNodeDirName,
                    part)).ToArray();

            shortTypeName = ReflH.GetTypeDisplayName(shortTypeName, '`');

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
                LoadPubInstnGetProps = true,
                LoadPubInstnMethods = true,
                DeclaringTypeOpts = type.DeclaringType?.With(GetTypeOpts)
            };

            return typeOpts;
        }

        private Dictionary<string, TypeItemCoreBase?>? GetTypeDepNames(
            TypeWorkArgs wka)
        {
            Dictionary<string, TypeItemCoreBase?>? retMap = null;

            var allDeps = wka.TypeKvp.Value.GetData(
                )?.Value.AllTypeDependencies.Value;

            var typeNamesList = allDeps.Select(
                depType => depType.Value.IdnfName).ToList().Distinct().ToList();

            var typeNamesMap = typeNamesList?.ToDictionary(
                name => name, name => allDeps.First(
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
