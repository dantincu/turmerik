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
            out Dictionary<int, List<NoteDirName>> ambiguosMap);

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
            out Dictionary<int, List<NoteDirName>> ambgMap)
        {
            var dirPairs = existingEntriesArr.Select(
                IdxRetriever.TryGetAsNoteDirName).NotNull().ToArray();

            var map = new Dictionary<int, List<NoteDirName>>();
            ambgMap = new Dictionary<int, List<NoteDirName>>();

            foreach (var item in dirPairs)
            {
                GetNotesCore(
                    map,
                    ambgMap,
                    item);
            }

            int idx = 0;
            var mapList = map.ToList();

            while (idx < mapList.Count)
            {
                var kvp = mapList[idx];

                if (kvp.Value.Count != 2)
                {
                    ambgMap.AddOrUpdate(
                        kvp.Key,
                        key => kvp.Value,
                        (key, value) =>
                        {
                            value.AddRange(kvp.Value);
                            return value;
                        });

                    mapList.RemoveAt(idx);
                }
            }

            var retMap = mapList.ToDictionary(
                kvp => kvp.Key,
                kvp => new NoteItemCore
                {
                    ItemIdx = kvp.Key,
                    Title = kvp.Value.Single(
                        item => item.FullDirNamePart != null).FullDirNamePart,
                });

            return retMap;
        }

        public Dictionary<int, NoteItemCore> GetNotes(
            string[] existingEntriesArr) => GetNotes(
                existingEntriesArr, out _);

        private void GetNotesCore(
            Dictionary<int, List<NoteDirName>> retMap,
            Dictionary<int, List<NoteDirName>> ambgMap,
            NoteDirName item)
        {
            if (ambgMap.TryGetValue(item.Idx, out var ambgMatching))
            {
                ambgMatching.Add(item);
            }
            else if (retMap.TryGetValue(item.Idx, out var matching))
            {
                if (item.FullDirNamePart != null)
                {
                    if (matching.Count > 1 || matching.Single().FullDirNamePart != null)
                    {
                        retMap.Remove(item.Idx);
                        matching.Add(item);

                        ambgMap.Add(item.Idx, matching);
                    }
                    else
                    {
                        matching.Add(item);
                    }
                }
            }
            else
            {
                retMap.Add(item.Idx,
                    new List<NoteDirName> { item });
            }
        }
    }
}
