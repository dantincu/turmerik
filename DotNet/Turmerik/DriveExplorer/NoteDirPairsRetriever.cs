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
            out Dictionary<int, List<NoteDirName>> noteDirsMap,
            out Dictionary<string, List<NoteDirName>> ambiguosMap,
            out List<string> ambgEntryNamesList);

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
            out Dictionary<int, List<NoteDirName>> noteDirsMap,
            out Dictionary<string, List<NoteDirName>> ambgMap,
            out List<string> ambgEntryNamesList)
        {
            var ambgEntryNames = new List<string>();
            ambgEntryNamesList = ambgEntryNames;

            var dirPairs = existingEntriesArr.Select(
                dirName =>
                {
                    var retObj = IdxRetriever.TryGetAsNoteDirName(dirName);

                    if (retObj == null)
                    {
                        ambgEntryNames.Add(dirName);
                    }

                    return retObj;
                }).NotNull().ToArray();

            noteDirsMap = new Dictionary<int, List<NoteDirName>>();
            ambgMap = new Dictionary<string, List<NoteDirName>>();

            foreach (var item in dirPairs)
            {
                GetNotesCore(
                    noteDirsMap,
                    ambgMap,
                    ambgEntryNames,
                    item);
            }

            int idx = 0;
            var mapList = noteDirsMap.ToList();

            while (idx < mapList.Count)
            {
                var kvp = mapList[idx];

                if (kvp.Value.Count != 2)
                {
                    ambgMap.AddOrUpdate(
                        kvp.Value.First().ShortDirName,
                        key => kvp.Value,
                        (key, value) =>
                        {
                            value.AddRange(kvp.Value);
                            return value;
                        });

                    mapList.RemoveAt(idx);
                }
            }

            mapList.Sort((a, b) => a.Key.CompareTo(b.Key));

            var retMap = mapList.ToDictionary(
                kvp => kvp.Key,
                kvp => new NoteItemCore
                {
                    ItemIdx = kvp.Key,
                    Title = kvp.Value.Single(
                        item => item.FullDirNamePart != null).FullDirNamePart,
                });

            ambgMap = ambgMap.OrderBy(
                kvp => kvp.Key).ToDictnr();

            return retMap;
        }

        public Dictionary<int, NoteItemCore> GetNotes(
            string[] existingEntriesArr) => GetNotes(
                existingEntriesArr, out _, out _, out _);

        private void GetNotesCore(
            Dictionary<int, List<NoteDirName>> noteDirsMap,
            Dictionary<string, List<NoteDirName>> ambgMap,
            List<string> ambgEntryNamesList,
            NoteDirName item)
        {
            string idxStr = item.Idx.ToString();
            List<NoteDirName> ambgMatching;

            if (ambgMap.TryGetValue(idxStr, out ambgMatching))
            {
                ambgMatching.Add(item);
            }
            else if (noteDirsMap.TryGetValue(item.Idx, out var matching))
            {
                if (item.FullDirNamePart != null)
                {
                    if (matching.Count > 1 || matching.Single().FullDirNamePart != null)
                    {
                        noteDirsMap.Remove(item.Idx);
                        matching.Add(item);

                        ambgMatching = matching;
                        ambgMap.Add(idxStr, ambgMatching);
                    }
                    else
                    {
                        matching.Add(item);
                    }
                }
            }
            else
            {
                ambgMatching = new List<NoteDirName> { item };
                ambgMap.Add(idxStr, ambgMatching);
            }

            if (ambgMatching != null)
            {
                int idx = 0;

                while (idx < ambgEntryNamesList.Count)
                {
                    string ambgEntryName = ambgEntryNamesList[idx];

                    if (ambgEntryName.StartsWith(item.ShortDirName))
                    {
                        ambgEntryNamesList.RemoveAt(idx);

                        ambgMatching.Add(new NoteDirName
                        {
                            FullDirName = ambgEntryName,
                        });
                    }
                    else
                    {
                        idx++;
                    }
                }
            }
        }
    }
}
