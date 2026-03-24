using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.TextSerialization;
using Turmerik.DirsPair;
using Turmerik.NetCore.Config;
using Turmerik.Notes.Core;

namespace Turmerik.NetCore.ConsoleApps.UpdateNoteChildren
{
    public interface INoteChildrenFetcher
    {
        Task<NoteChildrenFetcherResult> FetchChildrenAsync(NoteChildrenFetcherOpts opts);
    }

    public class NoteChildrenFetcherOpts
    {
        public string PrNoteDirPath { get; set; }
    }

    public class NoteChildrenFetcherResult
    {
        public NoteItem? NoteItem { get; set; }
        public NoteItemsTupleCore NotesTuple { get; set; }
    }

    public class NoteChildrenFetcher : INoteChildrenFetcher
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;
        private readonly IDirsPairConfigLoader dirsPairConfigLoader;
        private readonly DirsPairConfig config;
        private readonly INotesAppConfigLoader notesAppConfigLoader;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly NoteDirsPairConfigMtbl noteDirsPairCfg;

        public NoteChildrenFetcher(
            IJsonConversion jsonConversion,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory,
            IDirsPairConfigLoader dirsPairConfigLoader,
            INotesAppConfigLoader notesAppConfigLoader)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.dirsPairConfigLoader = dirsPairConfigLoader ?? throw new ArgumentNullException(
                nameof(dirsPairConfigLoader));

            this.notesAppConfigLoader = notesAppConfigLoader ?? throw new ArgumentNullException(
                nameof(notesAppConfigLoader));

            config = dirsPairConfigLoader.LoadConfig();
            notesConfig = notesAppConfigLoader.LoadConfig();
            noteDirsPairCfg = notesConfig.NoteDirPairs;

            this.existingDirPairsRetriever = existingDirPairsRetrieverFactory.Retriever(
                noteDirsPairCfg);
        }

        public async Task<NoteChildrenFetcherResult> FetchChildrenAsync(NoteChildrenFetcherOpts opts)
        {
            var notesTuple = await existingDirPairsRetriever.GetNoteDirPairsAsync(
                opts.PrNoteDirPath);

            var notesMap = new Dictionary<int, NoteItem>();
            bool? @continue = null;

            foreach (var pair in notesTuple.DirsPairTuples.Where(
                tuple => tuple.NoteDirCat != NoteDirCategory.Internals))
            {
                string shortDirPath = Path.Combine(
                    opts.PrNoteDirPath,
                    pair.ShortDirName);

                string jsonFilePath = Path.Combine(
                    shortDirPath,
                    config.FileNames.JsonFileName);

                NoteItem? childNote = null;
                @continue = null;

                while (!@continue.HasValue)
                {
                    (childNote, @continue) = await FetchNoteItemAsync(
                        jsonFilePath, pair.ShortDirName);
                }

                if (@continue.Value)
                {
                    notesMap.Add(pair.NoteDirIdx, childNote!);
                }
                else
                {
                    childNote = null;
                }

                if (!@continue.Value)
                {
                    break;
                }
            }

            var noteItem = (@continue ?? true) ? new NoteItem
            {
                ChildNotes = notesMap,
            } : null;

            return new NoteChildrenFetcherResult
            {
                NoteItem = noteItem,
                NotesTuple = notesTuple
            };
        }

        private async Task<Tuple<NoteItem?, bool?>> FetchNoteItemAsync(
            string jsonFilePath,
            string shortDirName)
        {
            bool? @continue = true;
            NoteItem noteItem = null!;

            bool hasError = false;
            string? errMsg = null;

            if (hasError = !File.Exists(jsonFilePath))
            {
                errMsg = hasError ? "There is no note json file" : null;
            }
            else
            {
                noteItem = jsonConversion.Adapter.Deserialize<NoteItem>(
                    File.ReadAllText(jsonFilePath));

                if (hasError = noteItem.Title == null)
                {
                    errMsg = $"There is no note title set";
                }
            }

            if (hasError)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"{errMsg} for short dir name {shortDirName}; do you wish to continue (y/n/r)?");
                Console.ResetColor();
                var answer = (Console.ReadLine() ?? "").ToLower();

                switch (answer)
                {
                    case "y":
                        break;
                    case "r":
                        @continue = null;
                        break;
                    default:
                        @continue = false;
                        noteItem = null;
                        break;
                }
            }

            return Tuple.Create(noteItem, @continue);
        }
    }
}
