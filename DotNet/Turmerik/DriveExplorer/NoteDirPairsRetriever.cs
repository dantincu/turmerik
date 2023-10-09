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
            out Dictionary<string, List<NoteDirName>> noteDirsMap,
            out Dictionary<string, List<NoteDirName>> internalDirsMap,
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
            out Dictionary<string, List<NoteDirName>> noteDirsMap,
            out Dictionary<string, List<NoteDirName>> internalDirsMap,
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

            noteDirsMap = new Dictionary<string, List<NoteDirName>>();
            internalDirsMap = new Dictionary<string, List<NoteDirName>>();
            ambgMap = new Dictionary<string, List<NoteDirName>>();

            foreach (var item in dirPairs)
            {
                GetNotesCore(
                    noteDirsMap,
                    internalDirsMap,
                    ambgMap,
                    ambgEntryNames,
                    item);
            }

            int idx = 0;
            var noteDirsMapList = noteDirsMap.ToList();
            var internalDirsMapList = internalDirsMap.ToList();

            var mapListMap = new Dictionary<DirCategory, List<KeyValuePair<string, List<NoteDirName>>>>
            {
                { DirCategory.Item, noteDirsMapList },
                { DirCategory.Internals, internalDirsMapList }
            };

            foreach (var outterKvp in mapListMap)
            {
                var dirsMapList = outterKvp.Value;

                while (idx < dirsMapList.Count)
                {
                    var kvp = dirsMapList[idx];

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

                        dirsMapList.RemoveAt(idx);
                    }
                    else if (kvp.Value.Any(item => item.NoteDirCategory != outterKvp.Key))
                    {
                        dirsMapList.RemoveAt(idx);
                    }
                    else
                    {
                        int noteIdx = int.Parse(
                            kvp.Key.Substring(
                                IdxRetriever.NoteItemsPfx.RawStr.Length));

                        foreach (var item in kvp.Value)
                        {
                            item.Idx = noteIdx;
                        }

                        idx++;
                    }
                }

                dirsMapList.Sort((a, b) => a.Key.CompareTo(b.Key));
            }

            var retMap = noteDirsMapList.Select(
                kvp => kvp.Value.Single(
                    item => item.FullDirNamePart != null)).ToDictionary(
                note => note.Idx,
                note => new NoteItemCore
                {
                    ItemIdx = note.Idx,
                    Title = note.FullDirNamePart,
                });

            internalDirsMap = internalDirsMapList.ToDictnr();

            ambgMap = ambgMap.OrderBy(
                kvp => kvp.Key).ToDictnr();

            return retMap;
        }

        public Dictionary<int, NoteItemCore> GetNotes(
            string[] existingEntriesArr) => GetNotes(
                existingEntriesArr, out _, out _, out _, out _);

        private void GetNotesCore(
            Dictionary<string, List<NoteDirName>> noteDirsMap,
            Dictionary<string, List<NoteDirName>> internalDirsMap,
            Dictionary<string, List<NoteDirName>> ambgMap,
            List<string> ambgEntryNamesList,
            NoteDirName item)
        {
            List<NoteDirName> ambgMatching;
            bool matchesNoteDir = false;

            if (ambgMap.TryGetValue(item.ShortDirName, out ambgMatching))
            {
                ambgMatching.Add(item);
            }
            else if ((matchesNoteDir = noteDirsMap.TryGetValue(
                item.ShortDirName, out var matching)) || (
                internalDirsMap.TryGetValue(
                    item.ShortDirName, out matching)))
            {
                var matchingMap = matchesNoteDir ? noteDirsMap : internalDirsMap;

                if (item.FullDirNamePart != null)
                {
                    if (matching.Count > 1 || matching.Single().FullDirNamePart != null)
                    {
                        matchingMap.Remove(item.ShortDirName);
                        matching.Add(item);

                        ambgMatching = matching;
                        ambgMap.Add(item.ShortDirName, ambgMatching);
                    }
                    else
                    {
                        matching.Add(item);
                    }
                }
            }
            else
            {
                switch (item.NoteDirCategory.Value)
                {
                    case DirCategory.Item:
                        noteDirsMap.Add(item.ShortDirName, new List<NoteDirName> { item });
                        break;
                    case DirCategory.Internals:
                        internalDirsMap.Add(item.ShortDirName, new List<NoteDirName> { item });
                        break;
                    default:
                        throw new NotSupportedException(string.Join(": ",
                            nameof(item.NoteDirCategory),
                            item.NoteDirCategory.ToString()));
                }
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
