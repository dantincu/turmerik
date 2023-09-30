using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Text;
using Turmerik.Utility;

namespace Turmerik.MkNoteDirsPair.ConsoleApp
{
    public class DirNamesPairGenerator : DirsPairInfoGeneratorBase, IDirsPairInfoGenerator
    {
        private const string DIR_NAME_REGEX = @"[1-9]+[0-9]*";

        private readonly IServiceProvider svcProv;
        private readonly IJsonConversion jsonConversion;
        private readonly AppSettings appSettings;
        private readonly AppSettings.TrmrkT trmrk;
        private readonly AppSettings.TrmrkT.DirNamesT dirNames;
        private readonly AppSettings.TrmrkT.FileNamesT fileNames;
        private readonly AppSettings.TrmrkT.FileContentsT fileContents;

        private readonly string keepFileContentsTemplate;

        private readonly string joinStrRegexEncoded;
        private readonly string noteInternalsPfx;
        private readonly string noteItemsPfx;
        private readonly ReadOnlyDictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>> dirNameRegexMap;

        public DirNamesPairGenerator()
        {
            svcProv = ServiceProviderContainer.Instance.Value.Data;
            jsonConversion = svcProv.GetRequiredService<IJsonConversion>();

            appSettings = jsonConversion.LoadConfig<AppSettings>();
            trmrk = appSettings.Trmrk;
            dirNames = trmrk.DirNames;
            fileNames = trmrk.FileNames;
            fileContents = trmrk.FileContents;

            keepFileContentsTemplate = string.Format(
                fileContents.KeepFileContentsTemplate,
                Trmrk.TrmrkGuidStrNoDash);

            joinStrRegexEncoded = RegexH.EncodeForRegex(
                dirNames.JoinStr);

            noteInternalsPfx = RegexH.EncodeForRegex(
                dirNames.NoteInternalsPfx);

            noteItemsPfx = RegexH.EncodeForRegex(
                dirNames.NoteItemsPfx);

            dirNameRegexMap = GetDirNameRegexMap();
        }

        public DirsPairInfo Generate(string[] args)
        {
            var wka = GetWorkArgs(args);
            var dirsPairInfo = GetDirsPairInfo(wka);

            return dirsPairInfo;
        }

        private WorkArgs GetWorkArgs(
            string[] args)
        {
            var wka = GetWorkArgsCore(args);
            GetEntryNamesCore(wka);

            PrintDataWithColors(
                "Short dir name: ",
                wka.ShortDirName);

            return wka;
        }

        private DirsPairInfo GetDirsPairInfo(
            WorkArgs wka)
        {
            DirsPairInfo info;

            if (wka.ProgArgs.CreateNote)
            {
                info = GetNoteDirsPairInfo(wka);
            }
            else
            {
                info = GetInternalDirsPairInfoCore(wka);
            }

            return info;
        }

        private DirsPairInfo GetNoteDirsPairInfo(
            WorkArgs wka)
        {
            var noteDirChildren = GetNoteDirChildren(wka);

            string docFilePath = Path.Combine(
                wka.WorkDir,
                wka.ShortDirName,
                wka.DocFileName);

            var dirsPairInfo = new DirsPairInfo(
                wka.WorkDir,
                wka.ExistingEntriesArr,
                new List<DataTreeNode<FsEntryOpts>>
                {
                    Folder(wka.ShortDirName,
                        noteDirChildren),
                    FullNameDir(wka.FullDirName)
                },
                docFilePath);

            return dirsPairInfo;
        }

        private DirsPairInfo GetInternalDirsPairInfoCore(
            WorkArgs wka) => new DirsPairInfo(
                wka.WorkDir,
                wka.ExistingEntriesArr,
                new List<DataTreeNode<FsEntryOpts>>
                {
                    Folder(wka.ShortDirName),
                    FullNameDir(wka.FullDirName)
                },
                null);

        private DataTreeNode<FsEntryOpts>[] GetNoteDirChildren(
            WorkArgs wka)
        {
            wka.DocFileName += ".md";

            wka.DocFileContents = string.Format(
                fileContents.NoteFileContentsTemplate,
                wka.DocTitle);

            List<DataTreeNode<FsEntryOpts>> list = new()
            {
                TextFile(
                    wka.DocFileName,
                    wka.DocFileContents)
            };

            var fullDirNamePartsList = GetInternalDirNamesList(
                wka.ProgArgs);

            int dirsCount = fullDirNamePartsList.Count;
            var dirNames = appSettings.Trmrk.DirNames;

            for (int i = 0; i < dirsCount; i++)
            {
                string fullDirNamePart = fullDirNamePartsList[i];
                string shortDirName = $"{noteInternalsPfx}{i + 1}";

                string fullDirName = string.Join(
                    dirNames.JoinStr,
                    shortDirName,
                    fullDirNamePart);

                list.Add(Folder(shortDirName));
                list.Add(FullNameDir(fullDirName));
            }

            return list.ToArray();
        }

        private List<string> GetInternalDirNamesList(
            ProgramArgs pga)
        {
            List<string> fullDirNamesList = new();

            if (pga.CreateNoteBook)
            {
                fullDirNamesList.Add(
                    dirNames.NoteBook);
            }

            if (pga.CreateNoteFiles)
            {
                fullDirNamesList.Add(
                    dirNames.NoteFiles);
            }

            if (pga.CreateNoteInternals)
            {
                fullDirNamesList.Add(
                    dirNames.NoteInternals);
            }

            return fullDirNamesList;
        }

        private WorkArgs GetWorkArgsCore(
            string[] args)
        {
            var pga = new ProgramArgsRetriever(
                ).Retrieve(args, appSettings);

            string workDir = Environment.CurrentDirectory;

            string fullDirNamePart = GetFullDirNamePartCore(
                pga, out string docTitle);

            var wka = new WorkArgs
            {
                ProgArgs = pga,
                WorkDir = workDir,
                ExistingEntriesArr = Directory.EnumerateFileSystemEntries(
                    workDir).Select(entry => Path.GetFileName(entry)).ToArray(),
                DocTitle = docTitle,
                FullDirNamePart = fullDirNamePart,
            };

            return wka;
        }

        private string GetFullDirNamePartCore(
            ProgramArgs pga,
            out string docTitle)
        {
            docTitle = null;
            
            string? fullDirNamePart = pga.CreateNote switch
            {
                false => GetInternalDirName(pga),
                true => NormalizeFileName(
                    pga.NoteName, out docTitle,
                    true, trmrk.FileNameMaxLength)
            };

            return fullDirNamePart;
        }

        private string GetInternalDirName(ProgramArgs pga)
        {
            string internalDirName;

            var internalDirNamesList = GetInternalDirNamesList(pga);
            int internalDirNamesCount = internalDirNamesList.Count;

            if (internalDirNamesCount == 1)
            {
                internalDirName = internalDirNamesList.Single();
            }
            else if (internalDirNamesCount == 0)
            {
                throw new ArgumentException(
                    "Either the note name or an internal note dir flag must be specified");
            }
            else
            {
                throw new ArgumentException(
                    "You can only specify multiple note internal dir flags along with the note name");
            }

            return internalDirName;
        }

        private void GetEntryNamesCore(WorkArgs wka)
        {
            var dirCat = wka.ProgArgs.CreateNote switch
            {
                false => DirCategory.TrmrkInternals,
                true => DirCategory.TrmrkNote,
            };

            wka.ShortDirName = GetShortDirName(
                wka.ExistingEntriesArr, dirCat);

            wka.FullDirName = string.Join(
                dirNames.JoinStr,
                wka.ShortDirName,
                wka.FullDirNamePart);

            wka.DocFileName = dirCat switch
            {
                DirCategory.TrmrkNote => appSettings.Trmrk.FileNames.NoteFileName,
                DirCategory.TrmrkInternals => null
            };
        }

        private string GetShortDirName(
            string[] existingEntriesArr,
            DirCategory dirCat)
        {
            var idxesSet = GetExistingIdxes(
                existingEntriesArr,
                dirCat);

            int nextIdx = DirPairsH.GetNextIdx(idxesSet);
            string dirNamePfx = GetDirNamePfx(dirCat);

            string shortDirName = string.Concat(
                dirNamePfx, nextIdx);

            return shortDirName;
        }

        private string GetDirNamePfx(
            DirCategory dirCat) => dirCat switch
            {
                DirCategory.TrmrkNote => noteItemsPfx,
                DirCategory.TrmrkInternals => noteInternalsPfx
            };

        private HashSet<int> GetExistingIdxes(
            string[] existingEntriesArr,
            DirCategory dirCat) => DirPairsH.GetExistingIdxes(
                existingEntriesArr,
                dirNameRegexMap[dirCat],
                dirNames.JoinStr);

        private DataTreeNode<FsEntryOpts> TextFile(
            string fileName,
            string contents) => new FsEntryOpts(
                fileName,
                contents).File();

        private DataTreeNode<FsEntryOpts> KeepFile(
            ) => TextFile(
                fileNames.KeepFileName,
                keepFileContentsTemplate);

        private DataTreeNode<FsEntryOpts> FullNameDir(
            string dirName) => new FsEntryOpts(
                dirName).Folder(KeepFile());

        private DataTreeNode<FsEntryOpts> Folder(
            string folderName,
            params DataTreeNode<FsEntryOpts>[] childItems) => new FsEntryOpts(
                folderName).Folder(childItems);

        private void PrintDataWithColors(
            string title,
            string content)
        {
            Console.Out.WithColors(
                wr => wr.Write(
                    title),
                ConsoleColor.DarkGreen);

            Console.Out.WithColors(
                wr => wr.WriteLine(
                    content),
                ConsoleColor.Cyan);
        }

        private ReadOnlyDictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>> GetDirNameRegexMap(
            ) => new Dictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>>
            {
                {
                    DirCategory.TrmrkNote,
                    new Dictionary<DirType, Regex>
                    {
                        { DirType.ShortName, new Regex($"^{noteItemsPfx}{DIR_NAME_REGEX}$") },
                        { DirType.FullName, new Regex($"^{noteItemsPfx}{DIR_NAME_REGEX}{joinStrRegexEncoded}") }
                    }.RdnlD()
                },
                {
                    DirCategory.TrmrkInternals,
                    new Dictionary<DirType, Regex>
                    {
                        { DirType.ShortName, new Regex($"^{noteInternalsPfx}{DIR_NAME_REGEX}$") },
                        { DirType.FullName, new Regex($"^{noteInternalsPfx}{DIR_NAME_REGEX}{joinStrRegexEncoded}") }
                    }.RdnlD()
                },
            }.RdnlD();

        private class WorkArgs
        {
            public ProgramArgs ProgArgs { get; set; }
            public string WorkDir { get; set; }
            public string[] ExistingEntriesArr { get; set; }
            public string DocTitle { get; set; }
            public string ShortDirName { get; set; }
            public string FullDirNamePart { get; set; }
            public string FullDirName { get; set; }
            public string? DocFileName { get; set; }
            public string? DocFileContents { get; set; }
            public string KeepFileContents { get; set; }
        }
    }
}
