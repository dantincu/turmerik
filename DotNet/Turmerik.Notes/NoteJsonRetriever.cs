using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Utility;
using Turmerik.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Md;
using Turmerik.Notes.Core;

namespace Turmerik.Notes
{
    public interface INoteJsonRetriever
    {
        Task<TTuple> TryGetNoteJsonFileAsync<TItem, TTuple>(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            string noteJsonFileName)
            where TItem : NoteItemCoreBase
            where TTuple : NoteJsonTupleCore<TItem>, new();

        Task<TTuple> TryGetNoteJsonFileAsync<TItem, TTuple>(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory)
            where TItem : NoteItemCoreBase
            where TTuple : NoteJsonTupleCore<TItem>, new();

        Task<TTuple> TryGetNoteJsonFileAsync<TItem, TTuple>(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem jsonFile)
            where TItem : NoteItemCoreBase
            where TTuple : NoteJsonTupleCore<TItem>, new();

        Task<NoteItemJsonTuple> TryGetNoteItemJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr);

        Task<NoteItemJsonTuple> TryGetNoteItemJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory);

        Task<NoteItemJsonTuple> TryGetNoteItemJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem jsonFile);

        Task<NoteBookJsonTuple> TryGetNoteBookJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr);

        Task<NoteBookJsonTuple> TryGetNoteBookJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory);

        Task<NoteBookJsonTuple> TryGetNoteBookJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem jsonFile);
    }

    public class NoteJsonRetriever : NoteRetrieverBase, INoteJsonRetriever
    {
        public NoteJsonRetriever(
            IDriveItemsRetriever driveItemsRetriever,
            INoteJsonDeserializer noteJsonDeserializer,
            IBestItemAsyncRetriever bestItemAsyncRetriever) : base(
                driveItemsRetriever,
                bestItemAsyncRetriever)
        {
            this.NoteJsonDeserializer = noteJsonDeserializer ?? throw new ArgumentNullException(
                nameof(noteJsonDeserializer));
        }

        protected INoteJsonDeserializer NoteJsonDeserializer { get; }

        public Task<TTuple> TryGetNoteJsonFileAsync<TItem, TTuple>(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            string noteJsonFileName)
            where TItem : NoteItemCoreBase
            where TTuple : NoteJsonTupleCore<TItem>, new() => GetNoteFileCoreAsync<TItem, TTuple>(
                prIdnf, (tuple, idx) => tuple.TrmrkGuidIsValid,
                list =>
                {
                    list.Add(
                        idx => TryGetNoteJsonFileAsync<TItem, TTuple>(
                            config, prIdnf, filesArr,
                            file => file.Name == noteJsonFileName));

                    foreach (var candidateFile in filesArr.Where(
                        file => file.Name != noteJsonFileName && file.Name.EndsWith(
                            noteJsonFileName)))
                    {
                        list.Add(idx => TryGetNoteJsonFileAsync<TItem, TTuple>(
                            config, prIdnf, candidateFile));
                    }
                },
                config.GetFileContents().RequireTrmrkGuidInNoteJsonFile ?? true,
                tuple => tuple.Item?.TrmrkGuid == Trmrk.TrmrkGuid,
                tuple => tuple.File?.Name == noteJsonFileName);

        public Task<TTuple> TryGetNoteJsonFileAsync<TItem, TTuple>(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory)
            where TItem : NoteItemCoreBase
            where TTuple : NoteJsonTupleCore<TItem>, new() => GetNoteFileCoreAsync<TItem, TTuple>(
                prIdnf, filesArr, bestFileFactory,
                (parentIdnf, file) => TryGetNoteJsonFileAsync<TItem, TTuple>(
                    config, prIdnf, file));

        public Task<TTuple> TryGetNoteJsonFileAsync<TItem, TTuple>(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem jsonFile)
            where TItem : NoteItemCoreBase
            where TTuple : NoteJsonTupleCore<TItem>, new() => GetNoteFileCoreAsync<TItem, TTuple>(
                prIdnf, jsonFile, (tuple, rawContent) =>
                {
                    (var item, var isValid) = NoteJsonDeserializer.TryDeserialize<TItem>(
                        rawContent, config.GetFileContents().RequireTrmrkGuidInNoteJsonFile ?? true);

                    tuple.Item = item;
                });

        public Task<NoteItemJsonTuple> TryGetNoteItemJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr) => TryGetNoteJsonFileAsync<NoteItemCore, NoteItemJsonTuple>(
                config, prIdnf, filesArr, config.GetFileNames().NoteItemJsonFileName);

        public Task<NoteItemJsonTuple> TryGetNoteItemJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory) => TryGetNoteJsonFileAsync<NoteItemCore, NoteItemJsonTuple>(
                config, prIdnf, filesArr, bestFileFactory);

        public Task<NoteItemJsonTuple> TryGetNoteItemJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem jsonFile) => TryGetNoteJsonFileAsync<NoteItemCore, NoteItemJsonTuple>(
                config, prIdnf, jsonFile);

        public Task<NoteBookJsonTuple> TryGetNoteBookJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr) => TryGetNoteJsonFileAsync<NoteBookCore, NoteBookJsonTuple>(
                config, prIdnf, filesArr, config.GetFileNames().NoteBookJsonFileName);

        public Task<NoteBookJsonTuple> TryGetNoteBookJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory) => TryGetNoteJsonFileAsync<NoteBookCore, NoteBookJsonTuple>(
                config, prIdnf, filesArr, bestFileFactory);

        public Task<NoteBookJsonTuple> TryGetNoteBookJsonFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem jsonFile) => TryGetNoteJsonFileAsync<NoteBookCore, NoteBookJsonTuple>(
                config, prIdnf, jsonFile);
    }
}
