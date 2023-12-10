using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;

namespace Turmerik.Core.ConsoleApps.MkFsBackup
{
    public partial class ProgramComponent
    {
        public const string BASE_CFG_FILE_NAME = "trmrk-dirsbackup-config.base.json";
        public const string CFG_FILE_NAME = "trmrk-dirsbackup-config.json";

        private static readonly string dirSeparator = Path.DirectorySeparatorChar.ToString();

        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly IFilteredFsEntriesRetriever filteredFsEntriesRetriever;
        private readonly IBckFsEntriesRetriever bckFsEntriesRetriever;
        private readonly DirsBackupConfig config;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            IFilteredFsEntriesRetriever filteredFsEntriesRetriever,
            IBckFsEntriesRetriever bckFsEntriesRetriever)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.filteredFsEntriesRetriever = filteredFsEntriesRetriever ?? throw new ArgumentNullException(
                nameof(filteredFsEntriesRetriever));

            this.bckFsEntriesRetriever = bckFsEntriesRetriever ?? throw new ArgumentNullException(
                nameof(bckFsEntriesRetriever));

            config = jsonConversion.Adapter.Deserialize<DirsBackupConfig>(
                File.ReadAllText(Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                CFG_FILE_NAME)));
        }

        public void Run(string[] args)
        {
            var pgArgs = GetProgramArgs(args);
            /* var wka = GetWorkArgs(pgArgs);

            if (!wka.ExitProgram)
            {
                Run(wka);

                if (pgArgs.CreateArchive != false)
                {
                    CreateArchive(wka);
                }
            } */
        }

        private ProgramArgs GetProgramArgs(
            string[] args) => consoleArgsParser.Parse(new ConsoleArgsParserOpts<ProgramArgs>(args)
            {
                ArgsBuilder = data => consoleArgsParser.HandleArgs(
                    new ConsoleArgsParseHandlerOpts<ProgramArgs>
                    {
                        Data = data,
                        ThrowOnTooManyArgs = true,
                        ThrowOnUnknownFlag = true,
                        FlagHandlersArr = [
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.PrintAllEntries.ToStrArr(),
                                data => data.Args.PrintAllEntries = true, true)]
                    })
            }).Args.ActWith(pgArgs =>
            {
                if (pgArgs.PrintAllEntries == true)
                {
                    pgArgs.CreateArchive = false;
                }
            });

        /* private void Run(
            WorkArgs wka)
        {
            foreach (var srcDirWka in wka.BckpDirs)
            {
                Run(wka, srcDirWka);
            }
        }

        private void Run(
            WorkArgs wka,
            WorkArgs.SrcBinDir srcDir)
        {
            Directory.CreateDirectory(
                srcDir.DestnBinDirPath.DirPath);

            
        }

        private void CreateArchive(
            WorkArgs wka)
        {

        }

        private WorkArgs GetWorkArgs(
            ProgramArgs pgArgs)
        {
            var wka = new WorkArgs
            {
                PgArgs = pgArgs,
                SrcProjectsBaseDirPath = Path.Combine(
                    config.RootSrcPath, config.SrcProjectsBaseDirRelPath),
                DestnBinDirBasePath = Path.Combine(
                    config.DestnDirBasePath, config.DestnBinDirRelPath),
                DestnConfigDirBasePath = Path.Combine(
                    config.DestnDirBasePath, config.DestnConfigDirRelPath),
                DestnDataDirBasePath = Path.Combine(
                    config.DestnDirBasePath, config.DestnDataDirRelPath),
                DestnArchiveFilePath = Path.Combine(
                    config.DestnArchivesDirPath, config.DestnArchiveFileName),
                ArchiveEntryRelPaths = new List<FsEntriesRetrieverNodeData[]>(),
            };

            wka.ConfigDestnDirRelPaths = filteredFsEntriesRetriever.Retrieve(
                MkFsBckpH.ToFsRetrieverOpts(
                    config.ConfigDirRelPathFilters,
                    wka.DestnConfigDirBasePath)).RootNodes;

            wka.DataDestnDirRelPaths = filteredFsEntriesRetriever.Retrieve(
                MkFsBckpH.ToFsRetrieverOpts(
                    config.DataDirRelPathFilters,
                    wka.DestnDataDirBasePath)).RootNodes;

            if (wka.PgArgs.PrintAllEntries == true)
            {

            }

            wka.BckpDirs = config.BckpDirs.Select(
                cfg => GetSrcDirWorkArgs(wka, cfg)).ToList();

            return wka;
        }

        private WorkArgs.SrcBinDir GetSrcDirWorkArgs(
            WorkArgs wka, DirsBackupConfig.BckpDir cfg)
        {
            string projectsBinPath = Path.Combine(
                wka.SrcProjectsBaseDirPath, cfg.DirRelPath);

            var srcBinDir = new WorkArgs.SrcBinDir
            {
                Config = cfg,
                ProjectBinsPath = projectsBinPath,
                SrcBinDirPath = GetDirPathTuple(
                    [projectsBinPath, cfg.DirName, cfg.DirRelPath]),
                DestnBinDirPath = GetDirPathTuple(
                    [wka.DestnBinDirBasePath, cfg.DirName, cfg.DirRelPath]),
            };

            var destnBinDirPath = srcBinDir.DestnBinDirPath;

            if (!destnBinDirPath.DirPathExists)
            {
                new ConsoleMessage("Destination folder doesn't exist: ", 1, 1, ConsoleColor.DarkRed.Tuple()).Arr(
                    new ConsoleMessage(destnBinDirPath.DirPath, 1, 1, ConsoleColor.Red.Tuple()),
                    new ConsoleMessage("Do you want to create it and create its first backup, or exit the program?", 2, 1, ConsoleColor.Magenta.Tuple()),
                    new ConsoleMessage("Type Y or N (or just press ENTER for No)", 2, 1)).Print();

                string answer = Console.ReadLine();
                wka.ExitProgram = answer.ToUpper() != "Y";

                if (!wka.ExitProgram)
                {
                    Directory.CreateDirectory(
                        destnBinDirPath.DirPath);
                }
            }

            if (!wka.ExitProgram)
            {
                srcBinDir.DirFsEntries = bckFsEntriesRetriever.Retrieve(
                    new BckFsEntriesRetrieverOpts
                    {
                        DestnDirPath = destnBinDirPath.DirPath,
                        SrcDirPath = srcBinDir.SrcBinDirPath.DirPath,
                        SrcDirPathFilters = cfg.DirRelPathFilters.SrcDirPathFilters,
                        DestnDirPathFilters = cfg.DirRelPathFilters.DestnDirPathFilters,
                        PrintAllEntries = wka.PgArgs.PrintAllEntries
                    });
             }
            
            return srcBinDir;
        } */

            private WorkArgs.DirPathTuple GetDirPathTuple(
            string[] dirPathParts) => GetDirPathTuple(
                Path.Combine(dirPathParts));

        private WorkArgs.DirPathTuple GetDirPathTuple(
            string dirPath) => new WorkArgs.DirPathTuple(
                dirPath, Directory.Exists(dirPath));

        private void PrintEntries(
            PrintHcyEntriesOpts opts)
        {
            new ConsoleMessage(opts.StartHeading, 1, 2,
                opts.HeadingColors).Print();

            foreach (var node in opts.NodesList)
            {
                PrintEntry(new PrintHcyEntryOpts(
                    opts.ParentSegments ?? new Stack<string>(),
                    node, opts.NameColors, opts.DirSepColors));
            }

            new ConsoleMessage(opts.EndHeading, 1, 2,
                opts.HeadingColors).Print();
        }

        private void PrintEntries(
            PrintEntriesOpts opts)
        {
            new ConsoleMessage(opts.StartHeading, 1, 2,
                opts.HeadingColors).Print();

            foreach (var path in opts.Paths)
            {
                PrintEntry(new PrintEntryOpts(path,
                    opts.NameColors, opts.DirSepColors));
            }

            new ConsoleMessage(opts.EndHeading, 1, 2,
                opts.HeadingColors).Print();
        }

        private void PrintEntry(
            PrintEntryOpts opts)
        {
            int maxIdx = opts.Path.Length - 1;

            for (int i = 0; i < maxIdx; i++)
            {
                var segment = opts.Path[i];

                var message = new ConsoleMessage(
                    segment.Name, 0, 0,
                    opts.NameColors);

                if (i < maxIdx)
                {
                    message.Arr(new ConsoleMessage(
                        dirSeparator, 0, 0,
                        opts.DirSepColors)).Print();
                }
                else
                {
                    message.Print();
                }
            }
        }

        private void PrintEntry(
            PrintHcyEntryOpts opts)
        {
            var data = opts.Node.Data.Value;

            if (data.IsFolder == true)
            {
                opts.ParentSegments.Push(data.Name);

                foreach (var folder in opts.Node.ChildNodes)
                {
                    PrintEntry(new PrintHcyEntryOpts(
                        opts.ParentSegments, folder,
                        opts.NameColors, opts.DirSepColors));
                }

                opts.ParentSegments.Pop();
            }
            else
            {
                foreach (var segment in opts.ParentSegments)
                {
                    new ConsoleMessage(segment, 0, 0, opts.NameColors).Arr(
                        new ConsoleMessage(dirSeparator, 0, 0, opts.DirSepColors)).Print();
                }

                new ConsoleMessage(data.Name, 0, 1, opts.NameColors).Print();
            }
        }
    }
}
