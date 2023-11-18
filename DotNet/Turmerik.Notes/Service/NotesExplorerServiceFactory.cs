using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Notes.Settings;

namespace Turmerik.Notes.Service
{
    public interface INotesExplorerServiceFactory
    {
        NotesExplorerService Create(
            INotesAppConfig appConfig);
    }

    public class NotesExplorerServiceFactory : INotesExplorerServiceFactory
    {
        private readonly INoteDirsPairCreatorFactory dirsPairCreatorFactory;

        public NotesExplorerServiceFactory(
            INoteDirsPairCreatorFactory dirsPairCreatorFactory)
        {
            this.dirsPairCreatorFactory = dirsPairCreatorFactory ?? throw new ArgumentNullException(nameof(dirsPairCreatorFactory));
        }

        public NotesExplorerService Create(
            INotesAppConfig appConfig) => new NotesExplorerService(
                dirsPairCreatorFactory.Creator(
                    appConfig.GetNoteDirPairs()),
                appConfig);
    }
}
