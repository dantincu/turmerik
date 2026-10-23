using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;

namespace Turmerik.NetCore.ConsoleApps.FlatLocalDevicePathsToFiles
{
    public interface IProgramComponent
    {
        void Run(string[] args);
        void Run(ProgramArgs args);
        ProgramArgs ParseArgs(string[] args);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;

        public ProgramComponent(
            IConsoleArgsParser consoleArgsParser,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            ITextMacrosReplacer textMacrosReplacer)
        {
            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));
        }

        public void Run(string[] args)
        {
            var pgArgs = ParseArgs(args);
            Run(pgArgs);
        }

        public void Run(ProgramArgs args)
        {
            var existingFileEntriesArr = Directory.GetFiles(args.DestnDirPath);

            foreach (var existingFileEntry in existingFileEntriesArr)
            {
                if (Path.GetExtension(existingFileEntry) == ".txt")
                {
                    File.Delete(existingFileEntry);
                }
            }

            foreach (var kvp in args.LocalDevicePathMacrosMap.PathsMap)
            {
                var macroName = kvp.Key;
                var macroValue = kvp.Value;
                string outFileNameCore = macroName.Substring(2, macroName.Length - 3);
                var destnFilePath = Path.Combine(args.DestnDirPath, $"{outFileNameCore}.txt");
                var normPath = textMacrosReplacer.NormalizePath(args.LocalDevicePathMacrosMap, macroValue, null);
                File.WriteAllText(destnFilePath, normPath);
            }
        }

        public ProgramArgs ParseArgs(string[] args) => consoleArgsParser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(args)
                {
                    ArgsBuilder = data => consoleArgsParser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<ProgramArgs>
                        {
                            ItemHandlersArr = [],
                            FlagHandlersArr = [
                                consoleArgsParser.ArgsFlagOpts(data, ["d"],
                                    data => data.Args.DestnDirPath = data.ArgFlagValue!.Single(), true),
                                ]
                        })
                }).Args.ActWith(pgArgs =>
                {
                    pgArgs.LocalDevicePathMacrosMap = localDevicePathMacrosRetriever.LoadFromConfigFile();

                    pgArgs.DestnDirPath = textMacrosReplacer.NormalizePath(
                        pgArgs.LocalDevicePathMacrosMap,
                        pgArgs.DestnDirPath, null);
                });
    }
}
