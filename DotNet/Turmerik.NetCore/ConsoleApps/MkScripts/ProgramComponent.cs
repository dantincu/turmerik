using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;
using Turmerik.NetCore.ConsoleApps.LocalFilesCloner;

namespace Turmerik.NetCore.ConsoleApps.MkScripts
{
    public interface IProgramComponent
    {
        void Run(string[] rawArgs);
        void Run(ProgramArgs args);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly IFilteredItemsRetriever filteredItemsRetriever;

        public ProgramComponent(
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            IFilteredItemsRetriever filteredItemsRetriever)
        {
            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.filteredItemsRetriever = filteredItemsRetriever ?? throw new ArgumentNullException(
                nameof(filteredItemsRetriever));
        }

        public void Run(string[] rawArgs)
        {
            var args = programArgsRetriever.GetArgs(rawArgs);
            programArgsNormalizer.NormalizeArgs(args);

            Run(args);
        }

        public void Run(ProgramArgs args)
        {
            foreach (var filesGroup in args.Section.FileGroups)
            {
                foreach (var file in filesGroup.Files)
                {
                    var dirPathsArr = filteredItemsRetriever.GetFilteredItemsIfReq(
                        new FilteredItemsRetrieverOpts<string>
                        {
                            ItemsArr = file.RelDirPaths.DirPathsArr,
                            FiltersMap = file.RelDirPaths.FiltersMap,
                            FilterName = args.RelDirPathsFilterName,
                            ToStringSerializer = item => item
                        });

                    foreach (var dirPath in dirPathsArr)
                    {
                        string fileRelPath = file.FileRelPath;

                        if (args.ContentArgsFilterName != null)
                        {
                            fileRelPath = file.FileRelPathsMap[args.ContentArgsFilterName];
                        }

                        string filePath = Path.Combine(
                            file.RelDirPaths.DirPath,
                            dirPath,
                            fileRelPath);

                        FsH.CreateParentDirPath(filePath);

                        Action action = args.Command switch
                        {
                            ProgramCommand.Create => () => File.WriteAllText(
                                filePath, file.TextContent),
                            ProgramCommand.Remove => () => FsH.DeleteFileIfExists(filePath),
                            _ => throw new ArgumentException(nameof(args.Command))
                        };

                        action();
                    }
                }
            }
        }
    }
}
