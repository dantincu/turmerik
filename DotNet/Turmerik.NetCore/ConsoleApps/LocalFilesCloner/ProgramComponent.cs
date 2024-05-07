using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps.TempDir;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
{
    public interface IProgramComponent
    {
        Task RunAsync(
            string[] rawArgs);

        Task RunAsync(
            ProgramArgs args);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly ITempDirConsoleApp tempDirConsoleApp;
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly IFileCloneComponent fileCloneComponent;
        private readonly ICloningProfileComponent cloningProfileComponent;

        public ProgramComponent(
            ITempDirConsoleApp tempDirConsoleApp,
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            IFileCloneComponent fileCloneComponent,
            ICloningProfileComponent cloningProfileComponent)
        {
            this.tempDirConsoleApp = tempDirConsoleApp ?? throw new ArgumentNullException(
                nameof(tempDirConsoleApp));

            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.fileCloneComponent = fileCloneComponent ?? throw new ArgumentNullException(
                nameof(fileCloneComponent));

            this.cloningProfileComponent = cloningProfileComponent ?? throw new ArgumentNullException(
                nameof(cloningProfileComponent));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            await tempDirConsoleApp.RunAsync(new TempDirAsyncConsoleAppOpts
            {
                Action = async (tempDir) =>
                {
                    var args = programArgsRetriever.GetArgs(rawArgs);
                    args.TempDir = tempDir;

                    if (args.PrintHelpMessage != true)
                    {
                        programArgsNormalizer.NormalizeArgs(args);
                        await RunAsync(args);
                    }
                },
                RemoveTempDirAfterAction = true,
                RemoveExistingTempDirsBeforeAction = true,
                TempDirOpts = new Core.Utility.TrmrkUniqueDirOpts
                {
                    DirNameType = GetType(),
                    PathPartsArr = ["temp"]
                }
            });
        }

        public async Task RunAsync(
            ProgramArgs args)
        {
            if (args.SingleFileArgs != null)
            {
                fileCloneComponent.Run(
                    args.SingleFileArgs);
            }
            else
            {
                await cloningProfileComponent.RunAsync(
                    args, args.Profile);
            }
        }
    }
}
