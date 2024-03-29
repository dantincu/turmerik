﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;
using Turmerik.Notes.Core;

namespace Turmerik.Notes
{
    public abstract class NoteRetrieverBase
    {
        protected NoteRetrieverBase(
            IDriveItemsRetriever driveItemsRetriever,
            IBestItemAsyncRetriever bestItemAsyncRetriever)
        {
            this.DriveItemsRetriever = driveItemsRetriever ?? throw new ArgumentNullException(nameof(driveItemsRetriever));
            this.BestItemAsyncRetriever = bestItemAsyncRetriever ?? throw new ArgumentNullException(nameof(bestItemAsyncRetriever));
        }

        protected IDriveItemsRetriever DriveItemsRetriever { get; }
        protected IBestItemAsyncRetriever BestItemAsyncRetriever { get; }

        protected async Task<TTuple> GetNoteFileCoreAsync<TItem, TTuple>(
            string prIdnf,
            Func<TTuple, int, bool> perfectMatchCondition,
            Action<List<Func<int, Task<TTuple>>>> factoriesBuilder,
            bool requirePerfectMatch,
            Func<TTuple, bool> perfectMatchPredicate,
            Func<TTuple, bool> bestMatchPredicate)
            where TItem : NoteItemCoreBase
            where TTuple : NoteTupleCore<TItem>, new()
        {
            var tuplesNmrbl = BestItemAsyncRetriever.RetrieveAsync(
                new BestItemAsyncRetrieverOpts<TTuple>
                {
                    PerfectMatchPredicate = perfectMatchCondition
                }.WithFactories(factoriesBuilder));

            var tuplesList = await tuplesNmrbl.ToListAsync();

            TTuple retTuple = tuplesList.LastOrDefault(
                perfectMatchPredicate);

            if (!requirePerfectMatch)
            {
                retTuple ??= tuplesList.LastOrDefault(
                    bestMatchPredicate) ?? tuplesList.LastOrDefault(
                    item => item.Item != null);
            }

            if (retTuple != null)
            {
                retTuple.FileIdnf = DriveItemsRetriever.GetItemIdnf(
                    retTuple.File, prIdnf);
            }

            return retTuple;
        }

        protected async Task<TTuple> GetNoteFileCoreAsync<TItem, TTuple>(
            string prIdnf,
            DriveItem[] filesArr,
            Func<DriveItem, bool> bestFileFactory,
            Func<string, DriveItem, Task<TTuple>> tupleFactory)
            where TItem : NoteItemCoreBase
            where TTuple : NoteTupleCore<TItem>, new()
        {
            var file = filesArr.FirstOrDefault(
                bestFileFactory);

            TTuple tuple;

            if (file != null)
            {
                tuple = await tupleFactory(prIdnf, file);
            }
            else
            {
                tuple = new TTuple();
            }

            return tuple;
        }

        protected async Task<TTuple> GetNoteFileCoreAsync<TItem, TTuple>(
            string prIdnf,
            DriveItem file,
            Action<TTuple, string> onRawContent)
            where TItem : NoteItemCoreBase
            where TTuple : NoteTupleCore<TItem>, new()
        {
            var tuple = await GetTupleCoreAsync<TItem, TTuple>(
                prIdnf, file);

            var rawContent = tuple.RawContent;

            if (rawContent != null)
            {
                onRawContent(tuple, rawContent);
                tuple.TrmrkGuidIsValid = tuple.Item?.TrmrkGuid == Trmrk.TrmrkGuid;
            }

            return tuple;
        }

        protected async Task<TTuple> GetTupleCoreAsync<TItem, TTuple>(
            string prIdnf,
            DriveItem file)
            where TItem : NoteItemCoreBase
            where TTuple : NoteTupleCore<TItem>, new()
        {
            var tuple = new TTuple
            {
                FileIdnf = DriveItemsRetriever.GetItemIdnf(file, prIdnf),
                File = file,
            };

            tuple.RawContent = await DriveItemsRetriever.GetFileTextAsync(
                tuple.FileIdnf);

            return tuple;
        }
    }
}
