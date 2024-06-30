using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Jint.Behavior;

namespace Turmerik.NetCore.ConsoleApps.MkFiles
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);
        Task RunAsync(ProgramArgs args);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IProgramArgsRetriever programArgsRetriever;
        private readonly IProgramArgsNormalizer programArgsNormalizer;
        private readonly ITrmrkJintOrchestrator trmrkJintOrchestrator;

        public ProgramComponent(
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            ITrmrkJintOrchestrator trmrkJintOrchestrator)
        {
            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.trmrkJintOrchestrator = trmrkJintOrchestrator ?? throw new ArgumentNullException(
                nameof(trmrkJintOrchestrator));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = programArgsRetriever.GetArgs(rawArgs);

            if (args.PrintHelpMessage != true)
            {
                programArgsNormalizer.NormalizeArgs(args);
                await RunAsync(args);
            }
        }

        public async Task RunAsync(ProgramArgs args)
        {
            string jsCode = File.ReadAllText(
                args.Profile.JsFilePath);

            await trmrkJintOrchestrator.ExecuteWhileAsync(new TrmrkJintOrchestratorOpts
            {
                DotNetMethods = new Dictionary<string, Func<object[], object>>(),
                InitialJsCodesArr = [ jsCode ],
            });
        }
    }
}
