using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.Notes
{
    public interface INoteDirsPairCreatorFactory
    {
        INoteDirsPairCreator Creator(
            INoteDirsPairConfig config);
    }

    public class NoteDirsPairCreatorFactory : INoteDirsPairCreatorFactory
    {
        private readonly INoteDirsPairGeneratorFactory generatorFactory;
        private readonly IDriveItemsCreator itemsCreator;

        public NoteDirsPairCreatorFactory(
            INoteDirsPairGeneratorFactory generatorFactory,
            IDriveItemsCreator itemsCreator)
        {
            this.generatorFactory = generatorFactory ?? throw new ArgumentNullException(nameof(generatorFactory));
            this.itemsCreator = itemsCreator ?? throw new ArgumentNullException(nameof(itemsCreator));
        }

        public INoteDirsPairCreator Creator(
            INoteDirsPairConfig config) => new NoteDirsPairCreator(
                generatorFactory.Generator(config),
                itemsCreator);
    }
}
