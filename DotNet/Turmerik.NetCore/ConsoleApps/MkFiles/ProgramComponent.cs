using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Jint.Behavior;
using Turmerik.NetCore.Utility;
using Turmerik.Core.Text;

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
        private readonly ITrmrkJintAdapterFactory trmrkJintAdapterFactory;
        private readonly ITrmrkJintOrchestrator trmrkJintOrchestrator;
        private readonly IJsonConversion jsonConversion;
        private readonly IDotNetServiceMethodsMapper dotNetServiceMethodsMapper;
        private readonly IDriveExplorerService driveExplorerService;
        private readonly IProcessLauncher processLauncher;
        private readonly IPowerShellAdapter powerShellAdapter;

        public ProgramComponent(
            IProgramArgsRetriever programArgsRetriever,
            IProgramArgsNormalizer programArgsNormalizer,
            ITrmrkJintAdapterFactory trmrkJintAdapterFactory,
            ITrmrkJintOrchestrator trmrkJintOrchestrator,
            IJsonConversion jsonConversion,
            IDotNetServiceMethodsMapper dotNetServiceMethodsMapper)
        {
            this.programArgsRetriever = programArgsRetriever ?? throw new ArgumentNullException(
                nameof(programArgsRetriever));

            this.programArgsNormalizer = programArgsNormalizer ?? throw new ArgumentNullException(
                nameof(programArgsNormalizer));

            this.trmrkJintAdapterFactory = trmrkJintAdapterFactory ?? throw new ArgumentNullException(
                nameof(trmrkJintAdapterFactory));

            this.trmrkJintOrchestrator = trmrkJintOrchestrator ?? throw new ArgumentNullException(
                nameof(trmrkJintOrchestrator));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.dotNetServiceMethodsMapper = dotNetServiceMethodsMapper ?? throw new ArgumentNullException(
                nameof(dotNetServiceMethodsMapper));
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

            string localDevicePathsMapPropName = nameof(
                args.LocalDevicePathsMap).DecapitalizeFirstLetter();

            string localDevicePathsMapJson = jsonConversion.Adapter.Serialize(
                args.LocalDevicePathsMap);

            await trmrkJintOrchestrator.ExecuteWhileAsync(new TrmrkJintOrchestratorOpts
            {
                DotNetMethods = dotNetServiceMethodsMapper.MapAndMergeAllDotNetServiceMethods(
                    [new ()
                    {
                        Service = driveExplorerService,
                        ServiceType = typeof(IDriveExplorerService)
                    },
                    new ()
                    {
                        Service = processLauncher,
                        ServiceType = typeof(IProcessLauncher)
                    },
                    new ()
                    {
                        Service = powerShellAdapter,
                        ServiceType = typeof(IPowerShellAdapter)
                    }]),
                JintAdapterOpts = new TrmrkJintAdapterOpts
                {
                    SetJsConsole = true,
                    JsScripts = string.Format(string.Join(Environment.NewLine,
                        "globalThis.turmerik = {{",
                        $"  \"{localDevicePathsMapPropName}\": {localDevicePathsMapJson}",
                        "}};")).Arr().RdnlC()
                },
                InitialJsCodesArr = [ jsCode ],
            });
        }
    }
}
