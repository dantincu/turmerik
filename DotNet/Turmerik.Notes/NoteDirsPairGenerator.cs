using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Helpers;
using Turmerik.Md;
using Turmerik.Core.Utility;
using Turmerik.Notes.Core;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.Notes
{
    public interface INoteDirsPairGenerator
    {
        INoteDirsPairConfig Config { get; }
        NoteDirsPairConfig.IArgOptionsAggT ArgOptsCfg { get; }
        NoteDirsPairConfig.IDirNamesT DirNamesCfg { get; }
        NoteDirsPairConfig.IDirNameIdxesT NoteDirNameIdxesCfg { get; }
        NoteDirsPairConfig.IDirNameIdxesT NoteInternalDirNameIdxesCfg { get; }
        NoteDirsPairConfig.IFileNamesT FileNamesCfg { get; }
        NoteDirsPairConfig.IFileContentsT FileContentsCfg { get; }

        Task<NoteDirsPair> GenerateItemsAsync(
            NoteDirsPairOpts opts);
    }

    public class NoteDirsPairGenerator : NoteDirsPairGeneratorBase, INoteDirsPairGenerator
    {
        public NoteDirsPairGenerator(
            IJsonConversion jsonConversion,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            INextNoteIdxRetriever nextNoteIdxRetriever,
            INoteItemsRetriever existingNoteDirPairsRetriever,
            INoteCfgValuesRetriever noteCfgValuesRetriever) : base(
                jsonConversion,
                fsEntryNameNormalizer,
                nextNoteIdxRetriever,
                existingNoteDirPairsRetriever,
                noteCfgValuesRetriever)
        {
        }


        public async Task<NoteDirsPair> GenerateItemsAsync(
            NoteDirsPairOpts opts)
        {
            var args = new Args(opts)
            {
                PrIdnf = opts.PrIdnf,
                ExistingDirPairs = await ExistingNoteDirPairsRetriever.GetNoteDirPairsAsync(opts.PrIdnf)
            };

            if (opts.Command == CmdCommand.CreateNoteBook)
            {
                GenerateNoteBook(args);
            }
            else if (opts.Command == CmdCommand.CreateNote)
            {
                GenerateNoteItem(args);
            }
            else
            {
                GenerateInternalDirs(args);
            }

            return new NoteDirsPair
            {
                DirPairs = args.DirsList,
                NoteItem = args.NoteItem,
            };
        }
    }
}
