using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;

namespace Turmerik.NetCore.ConsoleApps.FilesCloner
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
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly IFileCloneComponent fileCloneComponent;
        private readonly ICloningProfileComponent cloningProfileComponent;

        public ProgramComponent(
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            IFileCloneComponent fileCloneComponent,
            ICloningProfileComponent cloningProfileComponent)
        {
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
            var args = programArgsRetriever.GetArgs(rawArgs);
            programArgsNormalizer.NormalizeArgs(args);

            await RunAsync(args);
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
