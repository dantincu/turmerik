using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.Notes.Md;
using Turmerik.Utility;

namespace Turmerik.Notes
{
    public interface INoteJsonRetriever
    {
        Task<NoteJsonTupleCore<TItem>> TryGetNoteJsonFileAsync<TItem>(
            NoteDirsPairConfig.IFileNamesT fileNamesCfg,
            string prIdnf,
            DriveItem[] filesArr)
            where TItem : NoteItemCoreBase;

        Task<NoteJsonTupleCore<TItem>> TryGetNoteJsonFileAsync<TItem>(
            NoteDirsPairConfig.IFileNamesT fileNamesCfg,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory)
            where TItem : NoteItemCoreBase;

        Task<NoteJsonTupleCore<TItem>> TryGetNoteJsonFileAsync<TItem>(
            NoteDirsPairConfig.IFileNamesT fileNamesCfg,
            string prIdnf,
            DriveItem jsonFile)
            where TItem : NoteItemCoreBase;
    }

    public class NoteJsonRetriever : NoteRetrieverBase, INoteJsonRetriever
    {
        public NoteJsonRetriever(
            IDriveExplorerService dvExplrSvc,
            INoteJsonDeserializer noteJsonDeserializer,
            IBestItemAsyncRetriever bestItemAsyncRetriever) : base(
                dvExplrSvc,
                bestItemAsyncRetriever)
        {
            this.NoteJsonDeserializer = noteJsonDeserializer ?? throw new ArgumentNullException(
                nameof(noteJsonDeserializer));
        }

        protected INoteJsonDeserializer NoteJsonDeserializer { get; }

        public Task<NoteJsonTupleCore<TItem>> TryGetNoteJsonFileAsync<TItem>(
            NoteDirsPairConfig.IFileNamesT fileNamesCfg,
            string prIdnf,
            DriveItem[] filesArr)
            where TItem : NoteItemCoreBase => GetNoteFileCoreAsync<TItem, NoteJsonTupleCore<TItem>>(
                prIdnf, (tuple, idx) => tuple.TrmrkGuidIsValid,
                list => list.AddItems(
                    idx => TryGetNoteJsonFileAsync<TItem>(
                        fileNamesCfg, prIdnf, filesArr,
                        file => file.Name == fileNamesCfg.NoteJsonFileName),
                    idx => TryGetNoteJsonFileAsync<TItem>(
                        fileNamesCfg, prIdnf, filesArr,
                        file => file.Name.EndsWith(
                            fileNamesCfg.NoteJsonFileName))),
                fileNamesCfg.RequireTrmrkGuidInNoteJsonFile ?? true,
                tuple => tuple.Item?.TrmrkGuid == Trmrk.TrmrkGuid);

        public Task<NoteJsonTupleCore<TItem>> TryGetNoteJsonFileAsync<TItem>(
            NoteDirsPairConfig.IFileNamesT fileNamesCfg,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory)
            where TItem : NoteItemCoreBase => GetNoteFileCoreAsync<TItem, NoteJsonTupleCore<TItem>>(
                prIdnf, filesArr, bestFileFactory,
                (parentIdnf, file) => TryGetNoteJsonFileAsync<TItem>(
                    fileNamesCfg, prIdnf, file));

        public Task<NoteJsonTupleCore<TItem>> TryGetNoteJsonFileAsync<TItem>(
            NoteDirsPairConfig.IFileNamesT fileNamesCfg,
            string prIdnf,
            DriveItem jsonFile) where TItem : NoteItemCoreBase => GetNoteFileCoreAsync<TItem, NoteJsonTupleCore<TItem>>(
                prIdnf, jsonFile, (tuple, rawContent) =>
                {
                    (var item, var isValid) = NoteJsonDeserializer.TryDeserialize<TItem>(
                        rawContent, fileNamesCfg.RequireTrmrkGuidInNoteJsonFile ?? true);

                    tuple.Item = item;
                    tuple.TrmrkGuidIsValid = isValid;
                });
    }
}
