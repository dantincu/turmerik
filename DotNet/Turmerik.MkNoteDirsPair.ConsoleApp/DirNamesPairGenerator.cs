using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.MkFsDirsPair.Lib;

namespace Turmerik.MkNoteDirsPair.ConsoleApp
{
    public class DirNamesPairGenerator : DirsPairInfoGeneratorBase, IDirsPairInfoGenerator
    {
        private const string DIR_NAME_REGEX = @"[1-9]+[0-9]*";

        private readonly AppSettings appSettings;
        private readonly string joinStrRegexEncoded;
        private readonly ReadOnlyDictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>> dirNameRegexMap;

        public DirNamesPairGenerator()
        {
            appSettings = EnvH.LoadConfig<AppSettings>();

            joinStrRegexEncoded = RegexH.EncodeForRegex(
                appSettings.Trmrk.DirNames.JoinStr);

            dirNameRegexMap = GetDirNameRegexMap();
        }

        public DirsPairInfo Generate(string[] args)
        {
            GetArgs(
                args,
                out ProgramArgs pga,
                out string workDir,
                out string[] existingEntriesArr,
                out string docTitle);

            var dirCat = pga.CreateNote switch
            {
                false => DirCategory.TrmrkInternals,
                true => DirCategory.TrmrkNote,
            };

            string docFileName = GetArgs(
                pga,
                existingEntriesArr,
                dirCat,
                out string shortDirName,
                out string fullDirName);

            PrintWithGreenColors(
                "Short dir name: ",
                shortDirName);

            var dirsPairInfo = GetDirsPairInfo(
                workDir,
                existingEntriesArr,
                docTitle,
                shortDirName,
                docFileName,
                fullDirName);

            return dirsPairInfo;
        }

        private void GetArgs(
            string[] args,
            out ProgramArgs pga,
            out string workDir,
            out string[] existingEntriesArr,
            out string docTitle)
        {
            pga = new ProgramArgsRetriever(
                ).Retrieve(args, appSettings);

            string fullDirNamePart = NormalizeFileName(
                pga.NoteName, out docTitle,
                true, appSettings.Trmrk.FileNameMaxLength);

            workDir = Environment.CurrentDirectory;

            existingEntriesArr = Directory.EnumerateFileSystemEntries(
                workDir).Select(
                entry => Path.GetFileName(entry)).ToArray();
        }

        private string GetArgs(
            ProgramArgs pga,
            string[] existingEntriesArr,
            DirCategory dirCat,
            out string shortDirName,
            out string fullDirName)
        {
            var idxesSet = GetExistingIdxes(
                existingEntriesArr,
                dirCat);

            int nextIdx = GetNextIdx(idxesSet);

            throw new NotImplementedException();
        }

        private int GetNextIdx(
            HashSet<int> idxesSet)
        {
            int nextIdx = 1;

            if (idxesSet.Any())
            {
                var idxesList = idxesSet.ToList();
                idxesList.Sort();

                int prevIdx = 0;

                for (int i = 0; i < idxesList.Count; i++)
                {
                    var idx = idxesList[i] - 1;

                    if (idx > prevIdx)
                    {
                        nextIdx = idx;
                    }
                    else
                    {
                        prevIdx = idx;
                    }
                }
            }

            return nextIdx;
        }

        private HashSet<int> GetExistingIdxes(
            string[] existingEntriesArr,
            DirCategory dirCat)
        {
            var joinChar = appSettings.Trmrk.DirNames.JoinStr;
            var idxes = new HashSet<int>();
            var regexMap = dirNameRegexMap[dirCat];

            foreach (var entry in existingEntriesArr)
            {
                foreach (var kvp in regexMap)
                {
                    if (kvp.Value.IsMatch(entry))
                    {
                        string idxStr = entry;

                        if (kvp.Key == DirType.FullName)
                        {
                            idxStr = idxStr.Split(joinChar)[0];
                        }

                        int idx = int.Parse(idxStr);

                        if (idx > 0)
                        {
                            idxes.Add(idx);
                        }

                        break;
                    }
                }
            }

            return idxes;
        }

        private void PrintWithGreenColors(
            string title,
            string content)
        {
            Console.Out.WithColors(
                wr => wr.WriteLine(
                    title),
                ConsoleColor.DarkGreen);

            Console.Out.WithColors(
                wr => wr.WriteLine(
                    content),
                ConsoleColor.Green);
        }

        private enum DirType
        {
            ShortName,
            FullName
        }

        private enum DirCategory
        {
            TrmrkNote,
            TrmrkInternals
        }

        private ReadOnlyDictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>> GetDirNameRegexMap(
            ) => new Dictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>>
            {
                {
                    DirCategory.TrmrkNote,
                    new Dictionary<DirType, Regex>
                    {
                        { DirType.ShortName, new Regex($"^{DIR_NAME_REGEX}$") },
                        { DirType.FullName, new Regex($"^{DIR_NAME_REGEX}{joinStrRegexEncoded}") }
                    }.RdnlD()
                },
                {
                    DirCategory.TrmrkInternals,
                    new Dictionary<DirType, Regex>
                    {
                        { DirType.ShortName, new Regex($"^0{DIR_NAME_REGEX}$") },
                        { DirType.FullName, new Regex($"^0{DIR_NAME_REGEX}{joinStrRegexEncoded}") }
                    }.RdnlD()
                },
            }.RdnlD();
    }
}
