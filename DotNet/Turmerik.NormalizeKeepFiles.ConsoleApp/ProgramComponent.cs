using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;

namespace Turmerik.NormalizeKeepFiles.ConsoleApp
{
    public class ProgramComponent
    {
        private const string W = "w";

        private readonly DirsPairConfig config;
        private readonly IConsoleArgsParser parser;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly IDirsPairConfigLoader dirsPairConfigLoader;
        private readonly LocalDevicePathMacrosMapMtbl localDevicePathMacrosMapMtbl;

        public ProgramComponent(
            IConsoleArgsParser parser,
            IConsoleMsgPrinter consoleMsgPrinter,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            ITextMacrosReplacer textMacrosReplacer,
            IDirsPairConfigLoader dirsPairConfigLoader)
        {
            this.parser = parser ?? throw new ArgumentNullException(
                nameof(parser));

            this.consoleMsgPrinter = consoleMsgPrinter ?? throw new ArgumentNullException(
                nameof(consoleMsgPrinter));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.localDevicePathMacrosMapMtbl = localDevicePathMacrosRetriever.LoadFromConfigFile();

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.dirsPairConfigLoader = dirsPairConfigLoader ?? throw new ArgumentNullException(
                nameof(dirsPairConfigLoader));

            config = dirsPairConfigLoader.LoadConfig();
        }

        public async Task RunAsync(
            string[] rawArgs)
        {
            var pgArgs = ParseArgs(rawArgs);
            await RunAsync(pgArgs, pgArgs.WorkDir);
        }

        public async Task RunAsync(
            ProgramArgs pgArgs,
            string prIdnf)
        {
            var filesArr = Directory.GetFiles(prIdnf);
            var dirsArr = Directory.GetDirectories(prIdnf);

            if (dirsArr.Length == 0)
            {
                bool dumpKeepFile;

                if (dumpKeepFile = filesArr.Length == 0)
                {
                    consoleMsgPrinter.Print([
                        [ "Directory is empty: ", ConsoleColor.Blue, prIdnf ], [ 1 ]]);
                }
                else
                {
                    if (dumpKeepFile = filesArr.None(file => !string.IsNullOrWhiteSpace(File.ReadAllText(file))))
                    {
                        consoleMsgPrinter.Print([
                            [ "Directory only contains empty files: ", ConsoleColor.Blue, prIdnf ], [ 1 ]]);
                    }
                }

                if (dumpKeepFile)
                {
                    File.WriteAllText(
                        Path.Combine(
                            prIdnf,
                            config.FileNames.KeepFileName),
                        config.FileContents.KeepFileContentsTemplate);
                }
            }
            else
            {
                foreach (var idnf in dirsArr)
                {
                    await RunAsync(pgArgs, idnf);
                }
            }
        }

        public ProgramArgs ParseArgs(
            string[] rawArgs)
        {
            var pgArgs = parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsBuilder = data => parser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<ProgramArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = [],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data,
                                    [W], data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                            ]
                        })
                }).Args;

            pgArgs.WorkDir ??= string.Empty;
            pgArgs.LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile();

            pgArgs.WorkDir = textMacrosReplacer.NormalizePath(
                pgArgs.LocalDevicePathsMap,
                pgArgs.WorkDir, Environment.CurrentDirectory);

            return pgArgs;
        }
    }
}
