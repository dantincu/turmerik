using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairGeneratorFactory
    {
        INoteDirsPairIdxRetriever IdxRetriever(
            NoteDirsPairSettingsMtbl.DirNamesT opts);

        INoteDirsPairShortNameRetriever ShortNameRetriever(
            NoteDirsPairSettingsMtbl.DirNamesT opts);

        INoteDirPairsRetriever PairsRetriever(
            NoteDirsPairSettingsMtbl.DirNamesT opts);

        INoteDirsPairGenerator Generator(
            NoteDirsPairSettingsMtbl settings);
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
            NoteDirsPairSettingsMtbl.DirNamesT opts) => new NoteDirsPairIdxRetriever(
                jsonConversion, opts);

        public INoteDirsPairShortNameRetriever ShortNameRetriever(
            NoteDirsPairSettingsMtbl.DirNamesT opts) => new NoteDirsPairShortNameRetriever(
                IdxRetriever(opts));

        public INoteDirPairsRetriever PairsRetriever(
            NoteDirsPairSettingsMtbl.DirNamesT opts) => new NoteDirPairsRetriever(
                IdxRetriever(opts));

        public INoteDirsPairGenerator Generator(
            NoteDirsPairSettingsMtbl settings) => new NoteDirsPairGenerator(
                jsonConversion,
                ShortNameRetriever(settings.DirNames),
                noteDirsPairFullNamePartRetriever,
                settings);
    }
}
