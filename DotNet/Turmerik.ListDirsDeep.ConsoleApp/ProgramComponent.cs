using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.Utility;
using Turmerik.Core.Helpers;

namespace Turmerik.ListDirsDeep.ConsoleApp
{
    public class ProgramComponent
    {
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly IClipboardService clipboardService;

        public ProgramComponent(
            IConsoleArgsParser consoleArgsParser,
            IClipboardService clipboardService)
        {
            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.clipboardService = clipboardService ?? throw new ArgumentNullException(
                nameof(clipboardService));
        }

        public async Task RunAsync(string[] args)
        {
            var pga = GetProgramArgs(args);
            await RunAsyncCore(pga, pga.WorkDir);
        }

        public ProgramArgs GetProgramArgs(string[] rawArgs)
        {
            var pga = consoleArgsParser.Parse<ProgramArgs>(new(rawArgs)
            {
                ArgsBuilder = data => consoleArgsParser.HandleArgs(
                    new ConsoleArgsParseHandlerOpts<ProgramArgs>
                    {
                        Data = data,
                        ThrowOnTooManyArgs = true,
                        ThrowOnUnknownFlag = true,
                        ItemHandlersArr = [
                            consoleArgsParser.ArgsItemOpts(data, data => data.Args.DirNameMatchPatternStr = data.ArgItem),
                            consoleArgsParser.ArgsItemOpts(data, data => data.Args.ChildDirNameMatchPatternStr = data.ArgItem)
                        ],
                        FlagHandlersArr = [
                            consoleArgsParser.ArgsFlagOpts(data, ["w"], data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                            consoleArgsParser.ArgsFlagOpts(data, ["i"], data => data.Args.IsInteractive = true, true)
                        ]
                    }),
            }).Args;

            pga.WorkDir ??= ".";

            if (!Path.IsPathRooted(pga.WorkDir))
            {
                pga.WorkDir = Path.GetFullPath(pga.WorkDir);
            }

            pga.DirNameMatchPatternStr ??= ".*";
            pga.ChildDirNameMatchPatternStr ??= ".*";

            pga.DirNameMatchPattern ??= new(pga.DirNameMatchPatternStr);
            pga.ChildDirNameMatchPattern ??= new(pga.ChildDirNameMatchPatternStr);

            return pga;
        }

        private async Task RunAsyncCore(
            ProgramArgs pga,
            string prDirPath)
        {
            var allDirNamesArr = Directory.GetDirectories(
                prDirPath).Select(dir => Path.GetFileName(dir)).ToArray();

            var matchingDirsNamesArr = allDirNamesArr.Where(
                dirName => pga.DirNameMatchPattern.IsMatch(dirName)).ToArray();

            var childMatchingDirNamesArr = allDirNamesArr.Where(
                dirName => pga.ChildDirNameMatchPattern.IsMatch(dirName)).ToArray();

            bool skipRest = false;
            
            foreach (var dirName in matchingDirsNamesArr)
            {
                string dirPath = Path.Combine(prDirPath, dirName);
                Console.ForegroundColor = ConsoleColor.DarkCyan;
                Console.WriteLine(dirPath);
                Console.ResetColor();

                if (pga.IsInteractive)
                {
                    Console.WriteLine();
                    Console.WriteLine("Type a command or press the ENTER key to continue");
                    string answer = Console.ReadLine();

                    while (!string.IsNullOrEmpty(answer))
                    {
                        switch (answer)
                        {
                            case "cmd":
                                Process.Start(new ProcessStartInfo
                                {
                                    FileName = "cmd",
                                    WorkingDirectory = dirPath,
                                    UseShellExecute = true,
                                }.ActWith(info =>
                                {
                                }));

                                Console.ForegroundColor = ConsoleColor.DarkGreen;
                                Console.WriteLine("Command prompt launched");
                                Console.ResetColor();
                                break;
                            case "cb":
                                await clipboardService.SetTextAsync(dirPath);
                                Console.ForegroundColor = ConsoleColor.DarkGreen;
                                Console.WriteLine("Path set to clipboard");
                                Console.ResetColor();
                                break;
                            case "skr":
                                skipRest = true;
                                Console.ForegroundColor = ConsoleColor.DarkGreen;
                                Console.WriteLine("Skipping the rest of subdirs of the parent dir");
                                Console.ResetColor();
                                break;
                            default:
                                Console.ForegroundColor = ConsoleColor.DarkRed;
                                Console.WriteLine("Unknown command");
                                Console.ResetColor();
                                break;
                        }

                        if (skipRest)
                        {
                            break;
                        }

                        Console.WriteLine();
                        Console.WriteLine("Type a command or press the ENTER key to continue");
                        answer = Console.ReadLine();
                    }

                    Console.WriteLine();
                }

                if (skipRest)
                {
                    break;
                }
            }

            if (!skipRest)
            {
                foreach (var dirName in childMatchingDirNamesArr)
                {
                    string dirPath = Path.Combine(prDirPath, dirName);
                    await RunAsyncCore(pga, dirPath);
                }
            }
        }
    }
}
