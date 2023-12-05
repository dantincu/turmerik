using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;

namespace Turmerik.MkFsDirsBackup.ConsoleApp
{
    public class ProgramComponent
    {
        public const string CFG_FILE_NAME = "trmrk-dirsbackup-config.json";

        private readonly IJsonConversion jsonConversion;
        private readonly IFsEntriesRetriever fsEntriesRetriever;
        private readonly DirsBackupConfig config;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IFsEntriesRetriever fsEntriesRetriever)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.fsEntriesRetriever = fsEntriesRetriever ?? throw new ArgumentNullException(
                nameof(fsEntriesRetriever));

            config = jsonConversion.Adapter.Deserialize<DirsBackupConfig>(
                File.ReadAllText(Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                CFG_FILE_NAME)));
        }

        public void Run(string[] args)
        {
            var wka = GetWorkArgs(args);

            Run(wka);
            CreateArchive(wka);
        }

        private void Run(
            WorkArgs wka)
        {
            foreach (var srcDir in config.SrcBinDirs)
            {
                var srcDirWka = GetSrcDirWorkArgs(
                    wka, srcDir);

                Run(wka, srcDirWka);
            }
        }

        private void Run(
            WorkArgs wka,
            WorkArgs.SrcBinDir srcDir)
        {
            Directory.CreateDirectory(
                srcDir.DestnBinDirPath.DirPath);

            FillSrcRelPaths(wka, srcDir);
            FillDestnRelPaths(wka, srcDir);
            FillMissingRelPaths(wka, srcDir);
        }

        private void FillSrcRelPaths(
            WorkArgs wka,
            WorkArgs.SrcBinDir srcBinDir)
        {
            var path = new List<string>();

            /* fsEntriesRetriever.Retrieve(new FsEntriesRetrieverOpts
            {
                RootDirPath = wka.SrcProjectsBaseDirPath,
                NextStepPredicate = args =>
                {
                    var opts = args.Opts;
                    string entryName = args.Current.Data.Name;

                    path.Add(entryName);
                    throw new NotImplementedException();
                }
            }); */
        }

        private void FillDestnRelPaths(
            WorkArgs wka,
            WorkArgs.SrcBinDir srcBinDir)
        {

        }

        private void FillMissingRelPaths(
            WorkArgs wka,
            WorkArgs.SrcBinDir srcBinDir)
        {

        }

        private bool EntryMatches(
            string trgEntryName,
            string[] refEntryName)
        {
            throw new NotImplementedException();
        }

        private string[][] ExpandConfigPath(
            string configPath) => configPath.Split(
                '/', '\\').Select(part => part.Split(
                    '*').ToArray()).ToArray();

        private List<string[][]> ExpandConfigPaths(
            List<string> configPaths) => configPaths.Select(
                ExpandConfigPath).ToList();

        private void CreateArchive(
            WorkArgs wka)
        {

        }

        private WorkArgs GetWorkArgs(string[] args) => new WorkArgs
        {
            SrcProjectsBaseDirPath = Path.Combine(
                config.SrcRepoDirPath, config.SrcProjectsBaseDirRelPath),
            DestnBinDirBasePath = Path.Combine(
                config.DestnDirBasePath, config.DestnBinDirRelPath),
            DestnConfigDirBasePath = Path.Combine(
                config.DestnDirBasePath, config.DestnConfigDirRelPath),
            DestnDataDirBasePath = Path.Combine(
                config.DestnDirBasePath, config.DestnDataDirRelPath),
            DestnArchiveFilePath = Path.Combine(
                config.DestnArchivesDirPath, config.DestnArchiveFileName),
            ArchiveEntryRelPaths = new List<string[]>(),
            IncludedConfigDirRelPaths = ExpandConfigPaths(
                config.IncludedConfigDirRelPaths),
            IncludedDataDirRelPaths = ExpandConfigPaths(
                config.IncludedDataDirRelPaths)
        };

        private WorkArgs.SrcBinDir GetSrcDirWorkArgs(
            WorkArgs wka, DirsBackupConfig.SrcBinDir cfg) => new WorkArgs.SrcBinDir
            {
                Config = cfg,
                ProjectBinsPath = Path.Combine(
                    wka.SrcProjectsBaseDirPath, cfg.ProjectBinsDirRelPath),
                DestnBinDirPath = GetDirPathTuple(
                    [ wka.DestnBinDirBasePath, cfg.ProjectDirName, cfg.ProjectBinsDirRelPath ]),
                DestnConfigDirPath = GetDirPathTuple(
                    [ wka.DestnConfigDirBasePath, cfg.ProjectDirName ]),
                DestnDataDirPath = GetDirPathTuple(
                    [ wka.DestnDataDirBasePath, cfg.ProjectDirName ]),
                DestnRelPaths = new List<string[]>(),
                SrcRelPaths = new List<string[]>(),
                RelPathsMissingFromSrc = new List<string[]>(),
                RelPathsMissingFromDestn = new List<string[]>()
            };

        private WorkArgs.DirPathTuple GetDirPathTuple(
            string[] dirPathParts) => GetDirPathTuple(
                Path.Combine(dirPathParts));

        private WorkArgs.DirPathTuple GetDirPathTuple(
            string dirPath) => new WorkArgs.DirPathTuple(
                dirPath, Directory.Exists(dirPath));

        public class WorkArgs
        {
            public string SrcProjectsBaseDirPath { get; set; }
            public string DestnBinDirBasePath { get; set; }
            public string DestnConfigDirBasePath { get; set; }
            public string DestnDataDirBasePath { get; set; }
            public string DestnArchiveFilePath { get; set; }

            public List<string[][]> IncludedConfigDirRelPaths { get; set; }
            public List<string[][]> IncludedDataDirRelPaths { get; set; }

            public List<string[]> ArchiveEntryRelPaths { get; set; }

            public class SrcBinDir
            {
                public DirsBackupConfig.SrcBinDir Config { get; set; }
                public string ProjectBinsPath { get; set; }

                public DirPathTuple DestnBinDirPath { get; set; }
                public DirPathTuple DestnConfigDirPath { get; set; }
                public DirPathTuple DestnDataDirPath { get; set; }

                public List<string[]> SrcRelPaths { get; set; }
                public List<string[]> DestnRelPaths { get; set; }

                public List<string[]> RelPathsMissingFromSrc { get; set; }
                public List<string[]> RelPathsMissingFromDestn { get; set; }
            }

            public readonly struct DirPathTuple
            {
                public DirPathTuple(
                    string dirPath,
                    bool dirPathExists)
                {
                    DirPath = dirPath ?? throw new ArgumentNullException(
                        nameof(dirPath));

                    DirPathExists = dirPathExists;
                }

                public string DirPath { get; }
                public bool DirPathExists { get; }
            }
        }
    }
}
