using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using Turmerik.Helpers;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairIdxRetriever
    {
        ReadOnlyDictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>> DirNameRegexMap { get; }

        RegexEncodedText JoinStr { get; }
        RegexEncodedText NoteInternalsPfx { get; }
        RegexEncodedText NoteItemsPfx { get; }

        public NoteDirName TryGetAsNoteDirName(
            IEnumerable<KeyValuePair<DirType, Regex>> regexMap,
            string dirName);

        public NoteDirName TryGetAsNoteDirName(
            DirCategory noteDirCategory,
            string dirName);

        public NoteDirName TryGetAsNoteDirName(
            string dirName);

        HashSet<int> GetExistingDirIdxes(
            NoteDirsPairIdxOpts opts);

        int GetNextDirIdx(
            HashSet<int> existingIdxes,
            bool updateExistingIdxes = false);

        NoteDirsPairIdx GetNextDirIdx(
            NoteDirsPairIdxOpts opts);

        int[] GetNextDirIdxes(
            HashSet<int> existingIdxes,
            int count,
            bool updateExistingIdxes = false);
    }

    public class NoteDirsPairIdxRetriever : INoteDirsPairIdxRetriever
    {
        public const string DIR_NAME_REGEX = @"[1-9]+[0-9]*";

        private readonly IJsonConversion jsonConversion;

        public NoteDirsPairIdxRetriever(
            IJsonConversion jsonConversion,
            NoteDirsPairSettings.DirNamesT opts)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            JoinStr = RegexH.EncodeForRegex(
                opts.JoinStr);

            NoteInternalsPfx = RegexH.EncodeForRegex(
                opts.NoteInternalsPfx);

            NoteItemsPfx = RegexH.EncodeForRegex(
                opts.NoteItemsPfx);

            DirNameRegexMap = GetDirNameRegexMap();
        }

        public ReadOnlyDictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>> DirNameRegexMap { get; }

        public RegexEncodedText JoinStr { get; }
        public RegexEncodedText NoteInternalsPfx { get; }
        public RegexEncodedText NoteItemsPfx { get; }

        public NoteDirName TryGetAsNoteDirName(
            IEnumerable<KeyValuePair<DirType, Regex>> regexMap,
            string dirName)
        {
            NoteDirName dirsPair = null;
            int idx = -1;

            foreach (var kvp in regexMap)
            {
                if (kvp.Value.IsMatch(dirName))
                {
                    string dirNameStr = dirName;
                    string shortDirName = null;
                    string idxStrPart = dirNameStr;
                    string fullDirNamePart = null;
                    string fullDirName = null;
                    string joinStr = null;

                    if (!string.IsNullOrEmpty(NoteItemsPfx.RawStr))
                    {
                        dirNameStr = dirNameStr.Substring(
                            NoteItemsPfx.RawStr.Length);
                    }

                    if (kvp.Key == DirType.FullName)
                    {
                        (idxStrPart, fullDirNamePart) = dirNameStr.SplitStr(
                            (nmrbl, count) => nmrbl.IndexOfStr(
                                JoinStr.RawStr));

                        fullDirNamePart = fullDirNamePart.Substring(
                            JoinStr.RawStr.Length);

                        joinStr = JoinStr.RawStr;
                        fullDirName = dirName;
                    }

                    shortDirName = NoteItemsPfx.RawStr + idxStrPart;
                    idx = int.Parse(idxStrPart);

                    if (idx > 0)
                    {
                        dirsPair = new NoteDirName
                        {
                            ShortDirName = shortDirName,
                            FullDirName = fullDirName,
                            JoinStr = joinStr,
                            FullDirNamePart = fullDirNamePart,
                            Prefix = NoteItemsPfx.RawStr,
                            Idx = idx,
                        };
                    }

                    break;
                }
            }

            return dirsPair;
        }

        public NoteDirName TryGetAsNoteDirName(
            DirCategory noteDirCategory,
            string dirName)
        {
            var regexMap = DirNameRegexMap[noteDirCategory];

            var dirsPair = TryGetAsNoteDirName(
                regexMap, dirName);

            return dirsPair;
        }

        public NoteDirName TryGetAsNoteDirName(
            string dirName)
        {
            NoteDirName dirsPair = null;

            foreach (var kvp in DirNameRegexMap)
            {
                dirsPair = TryGetAsNoteDirName(
                    kvp.Value, dirName);

                if (dirsPair != null)
                {
                    dirsPair.NoteDirCategory = kvp.Key;
                    break;
                }
            }

            return dirsPair;
        }

        public HashSet<int> GetExistingDirIdxes(
            NoteDirsPairIdxOpts opts)
        {
            var idxes = new HashSet<int>();
            var regexMap = DirNameRegexMap[opts.DirCategory];

            foreach (var entry in opts.ExistingEntriesArr)
            {
                var dirsPair = TryGetAsNoteDirName(
                    regexMap, entry);

                if (dirsPair != null)
                {
                    idxes.Add(dirsPair.Idx);
                }
            }

            return idxes;
        }

        public NoteDirsPairIdx GetNextDirIdx(
            NoteDirsPairIdxOpts opts)
        {
            var idxes = GetExistingDirIdxes(opts);
            bool hasNoteJson = false;
            IJsonObjectDecorator<NoteItemCore> noteBook = null, noteItem = null;
            bool createInternalDirs = opts.DirCategory == DirCategory.Internals;

            if (TryLoadData(
                opts.NoteItemJson,
                out hasNoteJson,
                out noteItem))
            {
                AddIdxesIfAny(idxes,
                    createInternalDirs,
                    noteItem.Data,
                    data => data.ChildItems,
                    data => data.InternalDirs?.Values.ToArray());
            }
            else if (!hasNoteJson && TryLoadData(
                opts.NoteBookJson,
                out _,
                out noteBook))
            {
                AddIdxesIfAny(idxes,
                    createInternalDirs,
                    noteBook.Data,
                    data => data.ChildItems,
                    data => data.InternalDirs?.Values.ToArray());
            }

            int nextIdx = GetNextDirIdx(idxes);

            return new NoteDirsPairIdx
            {
                Idx = nextIdx,
                ExistingIdxes = idxes,
                NoteItem = noteItem,
                NoteBook = noteBook
            };
        }

        public int GetNextDirIdx(
            HashSet<int> existingIdxes,
            bool updateExistingIdxes = false)
        {
            int nextIdx = 1;
            int idxesCount = existingIdxes.Count;

            if (idxesCount >= 2)
            {
                var idxesList = existingIdxes.ToList();
                idxesList.Sort();

                int prevIdx = 0;
                int maxI = idxesCount - 1;

                for (int i = 0; i <= maxI; i++)
                {
                    var idx = idxesList[i] - 1;

                    if (idx > prevIdx || i == maxI)
                    {
                        nextIdx = prevIdx + 1;
                        break;
                    }
                    else
                    {
                        prevIdx = idx + 1;
                    }
                }
            }
            else if (idxesCount == 1 && existingIdxes.Single() == 1)
            {
                nextIdx = 2;
            }

            if (updateExistingIdxes)
            {
                existingIdxes.Add(nextIdx);
            }

            return nextIdx;
        }

        public int[] GetNextDirIdxes(
            HashSet<int> existingIdxes,
            int count,
            bool updateExistingIdxes = false)
        {
            HashSet<int> workIdexes = existingIdxes;

            if (!updateExistingIdxes)
            {
                workIdexes = new HashSet<int>();
                
                foreach (int existingIdx in existingIdxes)
                {
                    workIdexes.Add(existingIdx);
                }
            }

            var retArr = GetNextDirIdxesCore(
                workIdexes,
                new int[count],
                count);

            return retArr;
        }

        private int[] GetNextDirIdxesCore(
            HashSet<int> existingIdxes,
            int[] nextIdxesArr,
            int count)
        {
            for (int i = 0; i < count; i++)
            {
                int nextIdx = GetNextDirIdx(
                    existingIdxes, true);

                nextIdxesArr[i] = nextIdx;
            }

            return nextIdxesArr;
        }

        private void AddIdxesIfAny<TData>(
            HashSet<int> existingIdxes,
            bool createInternalDirs,
            TData data,
            Func<TData, Dictionary<int, string>> childNotesFactory,
            Func<TData, int[]> internalDirIdxesFactory)
        {
            int[]? idxesArr;

            if (data != null)
            {
                if (createInternalDirs)
                {
                    idxesArr = internalDirIdxesFactory(data);
                }
                else
                {
                    idxesArr = childNotesFactory(data)?.Keys.ToArray();
                }

                if (idxesArr != null)
                {
                    foreach (int idx in idxesArr)
                    {
                        existingIdxes.Add(idx);
                    }
                }
            }
        }

        private bool TryLoadData<TData>(
            string json, out bool hasJson,
            out IJsonObjectDecorator<TData> decorator)
        {
            decorator = null;
            hasJson = json != null;
            bool loaded = hasJson;

            if (loaded)
            {
                try
                {
                    decorator = jsonConversion.Decorator<TData>(json);
                    loaded = decorator.Data != null;
                }
                catch
                {
                    loaded = false;
                }
            }

            return loaded;
        }

        private ReadOnlyDictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>> GetDirNameRegexMap(
            ) => new Dictionary<DirCategory, ReadOnlyDictionary<DirType, Regex>>
            {
                {
                    DirCategory.Item,
                    new Dictionary<DirType, Regex>
                    {
                        { DirType.ShortName, new Regex($"^{NoteItemsPfx.EncodedStr}{DIR_NAME_REGEX}$") },
                        { DirType.FullName, new Regex($"^{NoteItemsPfx.EncodedStr}{DIR_NAME_REGEX}{JoinStr.EncodedStr}") }
                    }.RdnlD()
                },
                {
                    DirCategory.Internals,
                    new Dictionary<DirType, Regex>
                    {
                        { DirType.ShortName, new Regex($"^{NoteInternalsPfx.EncodedStr}{DIR_NAME_REGEX}$") },
                        { DirType.FullName, new Regex($"^{NoteInternalsPfx.EncodedStr}{DIR_NAME_REGEX}{JoinStr.EncodedStr}") }
                    }.RdnlD()
                },
            }.RdnlD();
    }
}
