﻿using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.DriveExplorer.Notes;

namespace Turmerik.DriveExplorer.DirsPair
{
    public interface IDirsPairCreatorFactory
    {
        IDirsPairCreator Creator(
            INoteDirsPairConfig notesConfig);
    }

    public class DirsPairCreatorFactory : IDirsPairCreatorFactory
    {
        private readonly IDirsPairGeneratorFactory generatorFactory;
        private readonly IDriveItemsCreator itemsCreator;

        public DirsPairCreatorFactory(
            IDirsPairGeneratorFactory generatorFactory,
            IDriveItemsCreator itemsCreator)
        {
            this.generatorFactory = generatorFactory ?? throw new ArgumentNullException(
                nameof(generatorFactory));

            this.itemsCreator = itemsCreator ?? throw new ArgumentNullException(
                nameof(itemsCreator));
        }

        public IDirsPairCreator Creator(
            INoteDirsPairConfig notesConfig) => new DirsPairCreator(
                generatorFactory.Create(
                    notesConfig),
                itemsCreator);
    }
}
