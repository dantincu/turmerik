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
        private readonly IConsolePrinter consolePrinter;

        public DirPairsRetrieverFactory(
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory, IConsolePrinter consolePrinter)
        {
            this.noteDirsPairGeneratorFactory = noteDirsPairGeneratorFactory ?? throw new ArgumentNullException(
                nameof(noteDirsPairGeneratorFactory));

            this.consolePrinter = consolePrinter ?? throw new ArgumentNullException(
                nameof(consolePrinter));
        }

        public IDirPairsRetriever Create(
            NoteDirsPairSettings noteDirsPairSettings) => new DirPairsRetriever(
                noteDirsPairGeneratorFactory,
                consolePrinter,
                noteDirsPairSettings);
    }
}
