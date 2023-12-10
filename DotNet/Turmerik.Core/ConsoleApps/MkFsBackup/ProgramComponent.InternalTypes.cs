using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.ConsoleApps.MkFsBackup
{
    public partial class ProgramComponent
    {
        public class WorkArgs
        {
            public bool ExitProgram { get; set; }
            public ProgramArgs PgArgs { get; set; }
            public string SrcProjectsBaseDirPath { get; set; }
            public string DestnBinDirBasePath { get; set; }
            public string DestnConfigDirBasePath { get; set; }
            public string DestnDataDirBasePath { get; set; }
            public string DestnArchiveFilePath { get; set; }

            public List<FsEntriesRetrieverNodeData[]> ArchiveEntryRelPaths { get; set; }

            public List<BckpDirsSection> Sections { get; set; }

            public class BckpDirsSection
            {
                public DirsBackupConfig.BckpDirsSection Config { get; set; }
                public List<BckpDirsGroup> Groups { get; set; }
            }

            public class BckpDirsGroup
            {
                public DirsBackupConfig.BckpDirsGroup Config { get; set; }
                public List<BckpDir> BckpDirs { get; set; }
            }

            public class BckpDir
            {
                public DirsBackupConfig.BckpDir Config { get; set; }

                public DirPathTuple SrcBinDirPath { get; set; }
                public DirPathTuple DestnBinDirPath { get; set; }

                public BckFsEntriesRetrieverResult DirFsEntries { get; set; }
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

        private readonly struct PrintEntriesOpts
        {
            public PrintEntriesOpts(
                Stack<string> parentSegments,
                List<FsEntriesRetrieverNodeData[]> paths,
                ConsoleColorsTuple nameColors,
                ConsoleColorsTuple dirSepColors,
                ConsoleColorsTuple headingColors,
                string startHeading,
                string endHeading)
            {
                ParentSegments = parentSegments ?? throw new ArgumentNullException(nameof(parentSegments));
                Paths = paths ?? throw new ArgumentNullException(nameof(paths));
                NameColors = nameColors;
                DirSepColors = dirSepColors;
                HeadingColors = headingColors;
                StartHeading = startHeading;
                EndHeading = endHeading;
            }

            public Stack<string> ParentSegments { get; init; }
            public List<FsEntriesRetrieverNodeData[]> Paths { get; init; }
            public ConsoleColorsTuple NameColors { get; init; }
            public ConsoleColorsTuple DirSepColors { get; init; }
            public ConsoleColorsTuple HeadingColors { get; init; }
            public string StartHeading { get; init; }
            public string EndHeading { get; init; }
        }

        private readonly struct PrintEntryOpts
        {
            public PrintEntryOpts(
                FsEntriesRetrieverNodeData[] path,
                ConsoleColorsTuple nameColors,
                ConsoleColorsTuple dirSepColors)
            {
                Path = path ?? throw new ArgumentNullException(nameof(path));
                NameColors = nameColors;
                DirSepColors = dirSepColors;
            }

            public FsEntriesRetrieverNodeData[] Path { get; init; }
            public ConsoleColorsTuple NameColors { get; init; }
            public ConsoleColorsTuple DirSepColors { get; init; }
        }

        private readonly struct PrintHcyEntriesOpts
        {
            public PrintHcyEntriesOpts(
                Stack<string> parentSegments,
                List<DataTreeNode<FsEntriesRetrieverNode>> rootNode,
                ConsoleColorsTuple nameColors,
                ConsoleColorsTuple dirSepColors,
                ConsoleColorsTuple headingColors,
                string startHeading,
                string endHeading)
            {
                ParentSegments = parentSegments ?? throw new ArgumentNullException(nameof(parentSegments));
                NodesList = rootNode ?? throw new ArgumentNullException(nameof(rootNode));
                NameColors = nameColors;
                DirSepColors = dirSepColors;
                HeadingColors = headingColors;
                StartHeading = startHeading;
                EndHeading = endHeading;
            }

            public Stack<string> ParentSegments { get; init; }
            public List<DataTreeNode<FsEntriesRetrieverNode>> NodesList { get; init; }
            public ConsoleColorsTuple NameColors { get; init; }
            public ConsoleColorsTuple DirSepColors { get; init; }
            public ConsoleColorsTuple HeadingColors { get; init; }
            public string StartHeading { get; init; }
            public string EndHeading { get; init; }
        }

        private readonly struct PrintHcyEntryOpts
        {
            public PrintHcyEntryOpts(
                Stack<string> parentSegments,
                DataTreeNode<FsEntriesRetrieverNode> node,
                ConsoleColorsTuple nameColors,
                ConsoleColorsTuple dirSepColors)
            {
                ParentSegments = parentSegments ?? throw new ArgumentNullException(nameof(parentSegments));
                Node = node ?? throw new ArgumentNullException(nameof(node));
                NameColors = nameColors;
                DirSepColors = dirSepColors;
            }

            public Stack<string> ParentSegments { get; init; }
            public DataTreeNode<FsEntriesRetrieverNode> Node { get; init; }
            public ConsoleColorsTuple NameColors { get; init; }
            public ConsoleColorsTuple DirSepColors { get; init; }
        }
    }
}
