using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.TextSerialization;
using Turmerik.DirsPair;
using Turmerik.Notes.Core;

namespace Turmerik.NetCore.ConsoleApps.UpdateNoteChildren
{
    public interface INoteChildrenUpdater
    {
        Task<NoteItem> LoadAsync(string noteDirPath);

        Task SaveAsync(
            NoteItem noteItem,
            string noteDirPath);

        NoteItem Normalize(NoteItem noteItem);
        string GetJsonFilePath(string noteDirPath);
    }

    public class NoteChildrenUpdater : INoteChildrenUpdater
    {
        private readonly IJsonConversion jsonConversion;
        private readonly DirsPairConfig config;
        private readonly IDirsPairConfigLoader dirsPairConfigLoader;

        public NoteChildrenUpdater(
            IJsonConversion jsonConversion,
            IDirsPairConfigLoader dirsPairConfigLoader)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.dirsPairConfigLoader = dirsPairConfigLoader ?? throw new ArgumentNullException(
                nameof(dirsPairConfigLoader));

            config = dirsPairConfigLoader.LoadConfig();
        }

        public async Task<NoteItem> LoadAsync(string noteDirPath)
        {
            string jsonFilePath = GetJsonFilePath(noteDirPath);
            var noteItem = jsonConversion.Adapter.Deserialize<NoteItem>(jsonFilePath);
            return noteItem;
        }

        public async Task SaveAsync(
            NoteItem noteItem,
            string noteDirPath)
        {
            string jsonFilePath = GetJsonFilePath(noteDirPath);
            string json = jsonConversion.Adapter.Serialize(noteItem);
            File.WriteAllText(jsonFilePath, json);
        }

        public NoteItem Normalize(NoteItem noteItem)
        {
            var retItem = new NoteItem
            {
                ChildNotes = noteItem.ChildNotes?.ToDictionary(
                    kvp => kvp.Key,
                    kvp => new NoteItemSummary
                    {
                        Title = kvp.Value.Title,
                        CreatedAt = kvp.Value.CreatedAt,
                        UpdatedAt = kvp.Value.UpdatedAt,
                    })!
            };

            return retItem;
        }

        public string GetJsonFilePath(
            string noteDirPath) => Path.Combine(
                noteDirPath,
                config.FileNames.NoteChildrenJsonFileName);
    }
}
