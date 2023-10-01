using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using Turmerik.Helpers;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairIdxRetriever
    {
        ReadOnlyDictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>> DirNameRegexMap { get; }

        RegexEncodedText JoinStr { get; }
        RegexEncodedText NoteInternalsPfx { get; }
        RegexEncodedText NoteItemsPfx { get; }

        HashSet<int> GetExistingDirIdxes(
            NoteDirsPairIdxOpts opts);

        HashSet<int> GetExistingIdxes(
            NoteDirsPairIdxOpts opts,
            out IJsonObjectDecorator<NoteItem> noteItem,
            out IJsonObjectDecorator<NoteBook> noteBook);

        void AddExistingIdxesIfReq(
            NoteDirsPairIdxOpts opts,
            HashSet<int> existingIdxes,
            out IJsonObjectDecorator<NoteItem> noteItem,
            out IJsonObjectDecorator<NoteBook> noteBook);

        int GetNextDirIdx(
            NoteDirsPairIdxOpts opts,
            out HashSet<int> existingIdxes,
            out IJsonObjectDecorator<NoteItem> noteItem,
            out IJsonObjectDecorator<NoteBook> noteBook);

        int GetNextDirIdx(
            HashSet<int> existingIdxes);

        int GetNextDirIdx(NoteDirsPairIdxOpts opts);
    }

    public class NoteDirsPairIdxRetriever : INoteDirsPairIdxRetriever
    {
        private const string DIR_NAME_REGEX = @"[1-9]+[0-9]*";

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

        public ReadOnlyDictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>> DirNameRegexMap { get; }

        public RegexEncodedText JoinStr { get; }
        public RegexEncodedText NoteInternalsPfx { get; }
        public RegexEncodedText NoteItemsPfx { get; }

        public HashSet<int> GetExistingDirIdxes(
            NoteDirsPairIdxOpts opts)
        {
            var idxes = new HashSet<int>();
            var regexMap = DirNameRegexMap[opts.DirCategory];

            foreach (var entry in opts.ExistingEntriesArr)
            {
                foreach (var kvp in regexMap)
                {
                    if (kvp.Value.IsMatch(entry))
                    {
                        string idxStr = entry;

                        if (kvp.Key == NoteDirType.FullName)
                        {
                            idxStr = idxStr.SplitStr(
                                (nmrbl, count) => nmrbl.IndexOfStr(
                                    JoinStr.RawStr)).Item1;
                        }

                        int idx = int.Parse(idxStr);

                        if (idx > 0)
                        {
                            idxes.Add(idx);
                        }

                        break;
                    }
                }
            }

            return idxes;
        }

        public HashSet<int> GetExistingIdxes(
            NoteDirsPairIdxOpts opts,
            out IJsonObjectDecorator<NoteItem> noteItem,
            out IJsonObjectDecorator<NoteBook> noteBook)
        {
            var existingIdxes = GetExistingDirIdxes(opts);

            AddExistingIdxesIfReq(
                opts,
                existingIdxes,
                out noteItem,
                out noteBook);

            return existingIdxes;
        }

        public void AddExistingIdxesIfReq(
            NoteDirsPairIdxOpts opts,
            HashSet<int> existingIdxes,
            out IJsonObjectDecorator<NoteItem> noteItem,
            out IJsonObjectDecorator<NoteBook> noteBook)
        {
            bool hasNoteJson = false;
            noteBook = null;
            bool createInternalDirs = opts.DirCategory == NoteDirCategory.TrmrkInternals;

            if (TryLoadData(
                opts.NoteItemJson,
                out hasNoteJson,
                out noteItem))
            {
                AddIdxesIfAny(
                    existingIdxes,
                    createInternalDirs,
                    noteItem.Data,
                    data => data.ChildNotes,
                    data => data.NoteDirs?.Values.ToArray());
            }
            else if (!hasNoteJson && TryLoadData(
                opts.NoteBookJson,
                out _,
                out noteBook))
            {
                AddIdxesIfAny(
                    existingIdxes,
                    createInternalDirs,
                    noteBook.Data,
                    data => data.Notes,
                    data => data.InternalDirIdx?.Arr());
            }
        }

        public int GetNextDirIdx(
            NoteDirsPairIdxOpts opts,
            out HashSet<int> existingIdxes,
            out IJsonObjectDecorator<NoteItem> noteItem,
            out IJsonObjectDecorator<NoteBook> noteBook)
        {
            existingIdxes = GetExistingIdxes(
                opts,
                out noteItem,
                out noteBook);

            int nextIdx = GetNextDirIdx(
                existingIdxes);

            return nextIdx;
        }

        public int GetNextDirIdx(
            NoteDirsPairIdxOpts opts) => GetNextDirIdx(
                opts, out _, out _, out _);

        public int GetNextDirIdx(
            HashSet<int> existingIdxes)
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
                        nextIdx = prevIdx + 2;
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

            return nextIdx;
        }

        private void AddIdxesIfAny<TData>(
            HashSet<int> existingIdxes,
            bool createInternalDirs,
            TData data,
            Func<TData, Dictionary<int, NoteItem>> childNotesFactory,
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

        private ReadOnlyDictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>> GetDirNameRegexMap(
            ) => new Dictionary<NoteDirCategory, ReadOnlyDictionary<NoteDirType, Regex>>
            {
                {
                    NoteDirCategory.TrmrkNote,
                    new Dictionary<NoteDirType, Regex>
                    {
                        { NoteDirType.ShortName, new Regex($"^{NoteItemsPfx.EncodedStr}{DIR_NAME_REGEX}$") },
                        { NoteDirType.FullName, new Regex($"^{NoteItemsPfx.EncodedStr}{DIR_NAME_REGEX}{JoinStr.EncodedStr}") }
                    }.RdnlD()
                },
                {
                    NoteDirCategory.TrmrkInternals,
                    new Dictionary<NoteDirType, Regex>
                    {
                        { NoteDirType.ShortName, new Regex($"^{NoteInternalsPfx.EncodedStr}{DIR_NAME_REGEX}$") },
                        { NoteDirType.FullName, new Regex($"^{NoteInternalsPfx.EncodedStr}{DIR_NAME_REGEX}{JoinStr.EncodedStr}") }
                    }.RdnlD()
                },
            }.RdnlD();
    }
}
