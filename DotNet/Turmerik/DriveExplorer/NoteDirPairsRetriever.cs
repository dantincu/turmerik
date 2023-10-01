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

        Dictionary<int, NoteItem> GetNotes(
            string[] existingEntriesArr,
            out Dictionary<int, List<NoteItem>> ambiguosMap);

        Dictionary<int, NoteItem> GetNotes(
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

        public Dictionary<int, NoteItem> GetNotes(
            string[] existingEntriesArr,
            out Dictionary<int, List<NoteItem>> ambgMap)
        {
            var dirPairs = existingEntriesArr.Select(
                IdxRetriever.TryGetAsNoteDirName).NotNull().ToArray();

            var retMap = new Dictionary<int, NoteItem>();
            ambgMap = new Dictionary<int, List<NoteItem>>();

            foreach (var item in dirPairs)
            {
                GetNotesCore(
                    retMap,
                    ambgMap,
                    item);
            }

            return retMap;
        }

        public Dictionary<int, NoteItem> GetNotes(
            string[] existingEntriesArr) => GetNotes(
                existingEntriesArr, out _);

        private void GetNotesCore(
            Dictionary<int, NoteItem> retMap,
            Dictionary<int, List<NoteItem>> ambgMap,
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

        private NoteItem ToNoteItem(
            NoteDirName item) => new NoteItem
            {
                Title = item.FullDirNamePart,
                NoteIdx = item.Idx
            };

        private List<NoteItem> CreateNotesList(
            params NoteItem[] notesArr)
        {
            var list = new List<NoteItem>();
            list.AddRange(notesArr);

            return list;
        }
    }
}
