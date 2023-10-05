using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Helpers;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirPairsRetriever
    {
        INoteDirsPairIdxRetriever IdxRetriever { get; }

        Dictionary<int, NoteItemCore> GetNotes(
            string[] existingEntriesArr,
            out Dictionary<int, List<NoteItemCore>> ambiguosMap);

        Dictionary<int, NoteItemCore> GetNotes(
            string[] existingEntriesArr);
    }

    public class NoteDirPairsRetriever : INoteDirPairsRetriever
    {
        public NoteDirPairsRetriever(
            INoteDirsPairIdxRetriever noteDirsPairIdxRetriever)
        {
            this.IdxRetriever = noteDirsPairIdxRetriever ?? throw new ArgumentNullException(nameof(noteDirsPairIdxRetriever));
        }

        public INoteDirsPairIdxRetriever IdxRetriever { get; }

        public Dictionary<int, NoteItemCore> GetNotes(
            string[] existingEntriesArr,
            out Dictionary<int, List<NoteItemCore>> ambgMap)
        {
            var dirPairs = existingEntriesArr.Select(
                IdxRetriever.TryGetAsNoteDirName).NotNull().ToArray();

            var retMap = new Dictionary<int, NoteItemCore>();
            ambgMap = new Dictionary<int, List<NoteItemCore>>();

            foreach (var item in dirPairs)
            {
                GetNotesCore(
                    retMap,
                    ambgMap,
                    item);
            }

            return retMap;
        }

        public Dictionary<int, NoteItemCore> GetNotes(
            string[] existingEntriesArr) => GetNotes(
                existingEntriesArr, out _);

        private void GetNotesCore(
            Dictionary<int, NoteItemCore> retMap,
            Dictionary<int, List<NoteItemCore>> ambgMap,
            NoteDirName item)
        {
            if (ambgMap.TryGetValue(item.Idx, out var ambgMatching))
            {
                ambgMatching.Add(
                    ToNoteItem(item));
            }
            else if (retMap.TryGetValue(item.Idx, out var matching))
            {
                if (item.FullDirNamePart != null)
                {
                    if (matching.Title != null)
                    {
                        retMap.Remove(item.Idx);

                        ambgMap.Add(item.Idx,
                            CreateNotesList(matching,
                                ToNoteItem(item)));
                    }
                    else
                    {
                        matching.Title = item.FullDirNamePart;
                    }
                }
            }
            else
            {
                retMap.Add(item.Idx,
                    ToNoteItem(item));
            }
        }

        private NoteItemCore ToNoteItem(
            NoteDirName item) => new NoteItemCore
            {
                Title = item.FullDirNamePart,
                ItemIdx = item.Idx
            };

        private List<NoteItemCore> CreateNotesList(
            params NoteItemCore[] notesArr)
        {
            var list = new List<NoteItemCore>();
            list.AddRange(notesArr);

            return list;
        }
    }
}
