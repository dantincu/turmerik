using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.DirsPair;
using Turmerik.Notes.Core;
using static Turmerik.NetCore.ConsoleApps.UpdateNoteChildren.ProgramComponent;

namespace Turmerik.NetCore.ConsoleApps.UpdateNoteChildren
{
    public interface IProgramComponent
    {
        Task<bool> RunAsync(string[] rawArgs);

        Task<bool> RunAsync(
            ProgramArgs pga,
            bool normalizeArgs = true);

        Task<bool> RunAsync(WorkArgs wka);

        WorkArgs GetWorkArgs(ProgramArgs pga);

        ProgramArgs ParseArgs(string[] rawArgs);

        void NormalizeArgs(ProgramArgs args);
    }

    public class ProgramComponent : IProgramComponent
    {
        private const string WORK_DIR_OPT_NAME = "wd";
        private const string RECURSIVE_OPT_NAME = "rec";

        private readonly IJsonConversion jsonConversion;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly INoteChildrenFetcher noteChildrenFetcher;
        private readonly INoteChildrenUpdater noteChildrenUpdater;
        private readonly DirsPairConfig config;
        private readonly IDirsPairConfigLoader dirsPairConfigLoader;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly INotesAppConfigLoader notesAppConfigLoader;
        private readonly NoteDirsPairConfigMtbl noteDirsPairCfg;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            IConsoleArgsParser consoleArgsParser,
            ITextMacrosReplacer textMacrosReplacer,
            INoteChildrenFetcher noteChildrenFetcher,
            INoteChildrenUpdater noteChildrenUpdater,
            IDirsPairConfigLoader dirsPairConfigLoader,
            INotesAppConfigLoader notesAppConfigLoader)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.noteChildrenFetcher = noteChildrenFetcher ?? throw new ArgumentNullException(
                nameof(noteChildrenFetcher));

            this.noteChildrenUpdater = noteChildrenUpdater ?? throw new ArgumentNullException(
                nameof(noteChildrenUpdater));

            this.dirsPairConfigLoader = dirsPairConfigLoader ?? throw new ArgumentNullException(
                nameof(dirsPairConfigLoader));

            this.notesAppConfigLoader = notesAppConfigLoader ?? throw new ArgumentNullException(
                nameof(notesAppConfigLoader));

            config = dirsPairConfigLoader.LoadConfig();
            notesConfig = notesAppConfigLoader.LoadConfig();
            noteDirsPairCfg = notesConfig.NoteDirPairs;
        }

        public async Task<bool> RunAsync(string[] rawArgs)
        {
            var pga = ParseArgs(rawArgs);
            pga.OnlyRunIfValidJsonAlreadyExists ??= false;
            return await RunAsync(pga);
        }

        public async Task<bool> RunAsync(
            ProgramArgs pga,
            bool normalizeArgs = true)
        {
            if (normalizeArgs)
            {
                NormalizeArgs(pga);
            }

            var wka = GetWorkArgs(pga);
            return await RunAsync(wka);
        }

        public async Task<bool> RunAsync(
            WorkArgs wka)
        {
            Console.Write($"Fetching note children for path: ");
            Console.ForegroundColor = ConsoleColor.Blue;
            Console.Write(wka.Pga.WorkDir);
            Console.ResetColor();
            Console.WriteLine();

            bool run = !wka.OnlyRunIfValidJsonAlreadyExists;
            bool shouldExit = false;

            if (!run)
            {
                string jsonFilePath =
                    noteChildrenUpdater.GetJsonFilePath(
                        wka.Pga.WorkDir);

                run = File.Exists(jsonFilePath);

                if (run)
                {
                    var noteItem = jsonConversion.Adapter.Deserialize<NoteItem>(
                        File.ReadAllText(jsonFilePath));

                    run = noteItem?.ChildNotes != null && noteItem.ChildNotes.All(
                        kvp => kvp.Value.Title != null);
                }
            }

            if (!run)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Valid existing json not found for this path");
                Console.ResetColor();
                Console.WriteLine();
            }

            if (run)
            {
                var noteChildrenResult = await noteChildrenFetcher.FetchChildrenAsync(
                    new()
                    {
                        PrNoteDirPath = wka.Pga.WorkDir
                    });

                shouldExit = noteChildrenResult.NoteItem == null;

                if (!shouldExit)
                {
                    await noteChildrenUpdater.SaveAsync(
                        noteChildrenUpdater.Normalize(
                            noteChildrenResult.NoteItem!),
                        wka.Pga.WorkDir);

                    if (wka.Pga.InfiniteDepthRecursive)
                    {
                        foreach (var tuple in noteChildrenResult.NotesTuple.DirsPairTuples.Where(
                            tuple => tuple.NoteDirCat != NoteDirCategory.Internals))
                        {
                            shouldExit = await RunAsync(
                                new WorkArgs
                                {
                                    Pga = new(wka.Pga)
                                    {
                                        WorkDir = Path.Combine(
                                            wka.Pga.WorkDir,
                                            tuple.ShortDirName),
                                        OnlyRunIfValidJsonAlreadyExists = false
                                    }
                                });

                            if (shouldExit)
                            {
                                break;
                            }
                        }
                    }
                }

                if (shouldExit)
                {
                    Console.WriteLine();
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine("Stopping the updating of note children");
                    Console.ResetColor();
                    Console.WriteLine();
                }
            }

            return shouldExit;
        }

        public WorkArgs GetWorkArgs(ProgramArgs pga)
        {
            var wka = new WorkArgs
            {
                Pga = pga,
                OnlyRunIfValidJsonAlreadyExists = pga.OnlyRunIfValidJsonAlreadyExists!.Value
            };

            return wka;
        }

        public ProgramArgs ParseArgs(string[] rawArgs)
        {
            var args = consoleArgsParser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsBuilder = data => consoleArgsParser.HandleArgs(new ConsoleArgsParseHandlerOpts<ProgramArgs>
                    {
                        Data = data,
                        ThrowOnTooManyArgs = true,
                        ThrowOnUnknownFlag = true,
                        ItemHandlersArr = [],
                        FlagHandlersArr = [
                            consoleArgsParser.ArgsFlagOpts(data,
                                [WORK_DIR_OPT_NAME],
                                data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                            consoleArgsParser.ArgsFlagOpts(data,
                                [RECURSIVE_OPT_NAME],
                                data => data.Args.InfiniteDepthRecursive = true),
                        ]
                    })
                });

            return args.Args;
        }

        public void NormalizeArgs(ProgramArgs args)
        {
            args.LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile();

            args.WorkDir = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                args.WorkDir,
                null);

            args.OnlyRunIfValidJsonAlreadyExists ??= true;
        }

        public class WorkArgs
        {
            public ProgramArgs Pga { get; set; }
            public bool OnlyRunIfValidJsonAlreadyExists { get; set; }
        }
    }
}
