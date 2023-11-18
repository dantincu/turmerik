using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Notes.Settings;

namespace Turmerik.Notes.Service
{
    public interface INotesExplorerService
    {
        Task<NotesExplorerServiceResult> ExecuteAsync(
            NotesExplorerServiceArgs args);
    }

    public class NotesExplorerService : INotesExplorerService
    {
        private readonly INoteDirsPairCreator dirsPairCreator;
        private readonly INotesAppConfig appConfig;

        public NotesExplorerService(
            INoteDirsPairCreator dirsPairCreator,
            INotesAppConfig appConfig)
        {
            this.dirsPairCreator = dirsPairCreator ?? throw new ArgumentNullException(nameof(dirsPairCreator));
            this.appConfig = appConfig ?? throw new ArgumentNullException(nameof(appConfig));
        }

        public async Task<NotesExplorerServiceResult> ExecuteAsync(
            NotesExplorerServiceArgs args)
        {
            var opts = GetOpts(args);
            await dirsPairCreator.CreateDirsPairAsync(opts);

            throw new NotImplementedException();
        }

        private NoteDirsPairOpts GetOpts(
            NotesExplorerServiceArgs args) => new NoteDirsPairOpts
            {
                PrIdnf = args.DestnDirIdnf,
                Title = args.NoteTitle,
                SortIdx = args.SortIdx,
                IsPinned = args.IsPinned,
                OpenMdFile = args.OpenMdFile,
                CreateNoteFilesDirsPair = args.CreateNoteFilesDirsPair,
                CreateNoteInternalDirsPair = args.CreateNoteInternalDirsPair,
                Command = args.Command,
                SrcNote = args.SrcNote,
                SrcNoteIdx = args.SrcNoteIdx,
                DestnNote = args.DestnNote,
                DestnNoteIdx = args.DestnNoteIdx
            };
    }
}
