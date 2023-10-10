using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public interface IDirPairsRetrieverFactory
    {
        IDirPairsRetriever Create(
            NoteDirsPairSettings noteDirsPairSettings);
    }

    public class DirPairsRetrieverFactory : IDirPairsRetrieverFactory
    {
        private readonly INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory;

        public DirPairsRetrieverFactory(
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory)
        {
            this.noteDirsPairGeneratorFactory = noteDirsPairGeneratorFactory ?? throw new ArgumentNullException(nameof(noteDirsPairGeneratorFactory));
        }

        public IDirPairsRetriever Create(
            NoteDirsPairSettings noteDirsPairSettings) => new DirPairsRetriever(
                noteDirsPairGeneratorFactory,
                noteDirsPairSettings);
    }
}
