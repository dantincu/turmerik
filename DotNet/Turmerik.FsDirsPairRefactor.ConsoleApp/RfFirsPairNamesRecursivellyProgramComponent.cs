using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.DriveExplorer;
using RfDirsPairNames = Turmerik.DirsPair.ConsoleApps.RfDirsPairNames;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.DirsPair;
using Turmerik.Notes.Core;
using Turmerik.DirsPair.ConsoleApps.RfDirsPairNames;

namespace Turmerik.FsDirsPairRefactor.ConsoleApp
{
    public class RfFirsPairNamesRecursivellyProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly IProgramComponent rfDirsPairNamesProgramComponent;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;

        private readonly NoteDirsPairConfig.IDirNamesT noteDirNamesCfg;
        private readonly NoteDirsPairConfig.IDirNameIdxesT noteDirNameIdxesCfg;
        private readonly NoteDirsPairConfig.IDirNamePfxesT noteDirNamePfxesCfg;
        private readonly string joinStr;
        private readonly bool? incIdx;

        public RfFirsPairNamesRecursivellyProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            IProgramComponent rfDirsPairNamesProgramComponent,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            parser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.rfDirsPairNamesProgramComponent = rfDirsPairNamesProgramComponent ?? throw new ArgumentNullException(
                nameof(rfDirsPairNamesProgramComponent));

            config = jsonConversion.Adapter.Deserialize<DirsPairConfig>(
                File.ReadAllText(Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME)));

            notesConfig = jsonConversion.Adapter.Deserialize<NotesAppConfigMtbl>(
                File.ReadAllText(Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    TrmrkNotesH.NOTES_CFG_FILE_NAME)));

            existingDirPairsRetriever = existingDirPairsRetrieverFactory.Retriever(
                notesConfig.GetNoteDirPairs());

            noteDirNamesCfg = notesConfig.GetNoteDirPairs().GetDirNames();
            noteDirNameIdxesCfg = notesConfig.GetNoteDirPairs().GetNoteDirNameIdxes();
            noteDirNamePfxesCfg = noteDirNamesCfg.GetNoteItemsPfxes();
            joinStr = noteDirNamePfxesCfg.JoinStr;
            incIdx = noteDirNameIdxesCfg.IncIdx ?? true;
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);
            NormalizeArgs(args);

            await RunAsync(args.WorkDir);
        }

        private void NormalizeArgs(
            RfFirsPairNamesRecursivellyProgramArgs args)
        {
            args.WorkDir ??= Environment.CurrentDirectory;
        }

        private async Task RunAsync(
            string dirPath)
        {
            WriteHeadingLineToConsole(
                $"Refreshing note names for parent dir path {dirPath}",
                foregroundColor: ConsoleColor.Yellow);

            var noteItemsTuple = await existingDirPairsRetriever.GetNoteDirPairsAsync(dirPath);
            
            foreach (var dirsPair in noteItemsTuple.DirsPairTuples)
            {
                if (dirsPair.NoteDirCat == NoteDirCategory.Item)
                {
                    WriteHeadingLineToConsole(
                        $"Refreshing note name for parent dir name {dirsPair.ShortDirName}",
                        foregroundColor: ConsoleColor.DarkYellow);

                    rfDirsPairNamesProgramComponent.Run([
                        Path.Combine(dirPath, dirsPair.ShortDirName)]);
                }
            }

            foreach (var dirsPair in noteItemsTuple.DirsPairTuples)
            {
                if (dirsPair.NoteDirCat == NoteDirCategory.Item)
                {
                    await RunAsync(Path.Combine(dirPath, dirsPair.ShortDirName));
                }
            }
        }

        private RfFirsPairNamesRecursivellyProgramArgs GetArgs(
            string[] rawArgs) => parser.Parse(
                new ConsoleArgsParserOpts<RfFirsPairNamesRecursivellyProgramArgs>(rawArgs)
                {
                    ArgsBuilder = data => parser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<RfFirsPairNamesRecursivellyProgramArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = [
                                parser.ArgsItemOpts(data, data => data.Args.WorkDir = data.ArgItem.Nullify(
                                    true)?.With(path => NormPathH.NormPath(
                                        path, (path, isRooted) => isRooted.If(
                                            () => path, () => Path.GetFullPath(
                                                path))))!)
                            ],
                            FlagHandlersArr = []
                        })
                }).Args;

        private void WriteWithForegroundsToConsole(
            Tuple<ConsoleColor, string>[] tuplesArr,
            bool omitTrailingNewLine = false)
        {
            foreach (var tuple in tuplesArr)
            {
                Console.ForegroundColor = tuple.Item1;
                Console.Write(tuple.Item2);
            }

            Console.ResetColor();

            if (!omitTrailingNewLine)
            {
                Console.WriteLine();
            }
        }

        private void WriteHeadingLineToConsole(
            string headingCaption,
            bool omitStartingNewLine = false,
            bool omitTrailingNewLine = false,
            ConsoleColor? foregroundColor = null)
        {
            if (!omitStartingNewLine)
            {
                Console.WriteLine();
            }

            ConsoleH.WithColors(
                () => Console.WriteLine(headingCaption),
                foregroundColor ?? ConsoleColor.White);

            if (!omitTrailingNewLine)
            {
                Console.WriteLine();
            }
        }
    }
}
