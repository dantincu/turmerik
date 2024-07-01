using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing.IndexesFilter;
using Turmerik.Core.TextParsing;
using Turmerik.NetCore.ConsoleApps.MkScripts;

namespace Turmerik.NetCore.ConsoleApps.MkFiles
{
    public interface IProgramArgsNormalizer
    {
        void NormalizeArgs(
            ProgramArgs args);

        void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile);
    }

    public class ProgramArgsNormalizer : IProgramArgsNormalizer
    {
        private readonly IProgramBehaviorRetriever programConfigRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IIdxesFilterParser idxesFilterParser;
        private readonly IFilteredItemsRetriever filteredItemsRetriever;

        public ProgramArgsNormalizer(
            IProgramBehaviorRetriever programConfigRetriever,
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            IIdxesFilterParser idxesFilterParser,
            IFilteredItemsRetriever filteredItemsRetriever)
        {
            this.programConfigRetriever = programConfigRetriever ?? throw new ArgumentNullException(
                nameof(programConfigRetriever));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.idxesFilterParser = idxesFilterParser ?? throw new ArgumentNullException(
                nameof(idxesFilterParser));

            this.filteredItemsRetriever = filteredItemsRetriever ?? throw new ArgumentNullException(
                nameof(filteredItemsRetriever));
        }

        public void NormalizeArgs(
            ProgramArgs args)
        {
            NormalizeArgs(args, args.Profile);
        }

        public void NormalizeArgs(
            ProgramArgs args,
            ProgramConfig.Profile profile)
        {
            profile.JsFilePath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                profile.JsFilePath,
                null);
        }
    }
}
