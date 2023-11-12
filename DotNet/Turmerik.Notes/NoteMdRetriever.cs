using Markdig.Syntax;
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
    public interface INoteMdRetriever
    {
        Task<NoteMdTuple> TryGetNoteMdFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            NoteItemCore noteItem,
            DriveItem[] filesArr);

        Task<NoteMdTuple> TryGetNoteMdFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory);

        Task<NoteMdTuple> TryGetNoteMdFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem mdFile);
    }

    public class NoteMdRetriever : NoteRetrieverBase, INoteMdRetriever
    {
        public NoteMdRetriever(
            IDriveItemsRetriever driveItemsRetriever,
            INoteMdParser noteMdParser,
            IBestItemAsyncRetriever bestItemAsyncRetriever,
            IFsEntryNameNormalizer fsEntryNameNormalizer) : base(
                driveItemsRetriever,
                bestItemAsyncRetriever)
        {
            this.NoteMdParser = noteMdParser ?? throw new ArgumentNullException(
                nameof(noteMdParser));

            this.FsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));
        }

        protected INoteMdParser NoteMdParser { get; }
        protected IFsEntryNameNormalizer FsEntryNameNormalizer { get; }

        public async Task<NoteMdTuple> TryGetNoteMdFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            NoteItemCore noteItem,
            DriveItem[] filesArr)
        {
            var fileNamesCfg = config.GetFileNames();

            bool ignoreTrmrkGuid = config.TrmrkGuidInputName != null && string.IsNullOrEmpty(
                config.TrmrkGuidInputName);

            var retTuple = await GetNoteFileCoreAsync<NoteItemCore, NoteMdTuple>(
                prIdnf,
                (tuple, idx) => ignoreTrmrkGuid || tuple.Item?.TrmrkGuid == Trmrk.TrmrkGuid,
                list =>
                {
                    noteItem?.ActWith(item =>
                    {
                        item.MdFileName?.ActWith(
                            mdFileName => list.Add(idx => TryGetNoteMdFileAsync(
                                config, prIdnf, filesArr,
                                file => file.Name == mdFileName)));

                        item.Title?.ActWith(title =>
                        {
                            string noteMdFileNameCore = FsEntryNameNormalizer.NormalizeFsEntryName(
                                title, config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH);

                            string mdFileName = noteMdFileNameCore + fileNamesCfg.NoteMdFileName;

                            if (mdFileName != item.MdFileName)
                            {
                                list.Add(idx => TryGetNoteMdFileAsync(
                                    config, prIdnf, filesArr,
                                    file => file.Name == mdFileName));
                            }
                        });
                    });

                    list.Add(idx => TryGetNoteMdFileAsync(
                        config, prIdnf, filesArr,
                        file => file.Name.EndsWith(
                            fileNamesCfg.NoteMdFileName)));
                },
                fileNamesCfg.RequireTrmrkGuidInNoteMdFile ?? true,
                item => item.Item?.TrmrkGuid == Trmrk.TrmrkGuid);

            return retTuple;
        }

        public Task<NoteMdTuple> TryGetNoteMdFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory) => GetNoteFileCoreAsync<NoteItemCore, NoteMdTuple>(
                prIdnf, filesArr, bestFileFactory,
                (parentIdnf, file) => TryGetNoteMdFileAsync(
                    config, prIdnf, file));

        public Task<NoteMdTuple> TryGetNoteMdFileAsync(
            INoteDirsPairConfig config,
            string prIdnf,
            DriveItem mdFile) => GetNoteFileCoreAsync<NoteItemCore, NoteMdTuple>(
                prIdnf, mdFile, (tuple, rawContent) => tuple.MdDoc = NoteMdParser.TryParse(
                    rawContent,
                    out var item,
                    config.TrmrkGuidInputName));
    }
}
