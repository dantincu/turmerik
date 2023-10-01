using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairGeneratorFactory
    {
        INoteDirsPairIdxRetriever IdxRetriever(
            NoteDirsPairSettings.DirNamesT opts);

        INoteDirsPairShortNameRetriever ShortNameRetriever(
            NoteDirsPairSettings.DirNamesT opts);

        INoteDirsPairGenerator Generator(
            NoteDirsPairSettings settings);
    }

    public class NoteDirsPairGeneratorFactory : INoteDirsPairGeneratorFactory
    {
        private readonly IJsonConversion jsonConversion;
        private readonly INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever;

        public NoteDirsPairGeneratorFactory(
            IJsonConversion jsonConversion,
            INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.noteDirsPairFullNamePartRetriever = noteDirsPairFullNamePartRetriever ?? throw new ArgumentNullException(
                nameof(noteDirsPairFullNamePartRetriever));
        }

        public INoteDirsPairIdxRetriever IdxRetriever(
            NoteDirsPairSettings.DirNamesT opts) => new NoteDirsPairIdxRetriever(
                jsonConversion, opts);

        public INoteDirsPairShortNameRetriever ShortNameRetriever(
            NoteDirsPairSettings.DirNamesT opts) => new NoteDirsPairShortNameRetriever(
                IdxRetriever(opts));

        public INoteDirsPairGenerator Generator(
            NoteDirsPairSettings settings) => new NoteDirsPairGenerator(
                ShortNameRetriever(settings.DirNames),
                noteDirsPairFullNamePartRetriever,
                settings);
    }
}
