﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Notes.Core;

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
                NoteIdx = args.NoteIdx,
                IsSection = args.IsSection,
                OpenMdFile = args.OpenMdFile,
                CreateNoteFilesDirsPair = args.CreateNoteFilesDirsPair,
                CreateNoteInternalDirsPair = args.CreateNoteInternalDirsPair,
                Command = args.Command,
                SrcNote = args.SrcNote,
                SrcNoteIdx = args.SrcNoteIdx,
                DestnNote = args.DestnNote,
                DestnNoteIdx = args.DestnNoteIdx,
                NotesOrder = args.NotesOrder,
                NoteIdxesOrder = args.NoteIdxesOrder,
            };
    }
}
