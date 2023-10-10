using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Utility;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Text;
using Turmerik.Helpers;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairGenerator
    {
        string NoteJsonFileName { get; }
        string NoteBookJsonFileName { get; }

        List<DataTreeNode<DriveItemOpts>> Generate(
            NoteDirsPairOpts opts,
            out NoteDirsPair pair);
    }

    public class NoteDirsPairGenerator : INoteDirsPairGenerator
    {
        private readonly NoteDirsPairSettings settings;
        private readonly NoteDirsPairSettings.DirNamesT dirNames;
        private readonly NoteDirsPairSettings.FileNamesT fileNames;
        private readonly NoteDirsPairSettings.FileContentsT fileContents;

        private readonly IJsonConversion jsonConversion;
        private readonly INoteDirsPairShortNameRetriever shortNameRetriever;
        private readonly INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever;

        private readonly string keepFileContentsTemplate;
        private readonly RegexEncodedText noteInternalsPfx;

        public NoteDirsPairGenerator(
            IJsonConversion jsonConversion,
            INoteDirsPairShortNameRetriever noteDirsPairShortNameRetriever,
            INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever,
            NoteDirsPairSettings settings)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.shortNameRetriever = noteDirsPairShortNameRetriever ?? throw new ArgumentNullException(
                nameof(noteDirsPairShortNameRetriever));

            this.noteDirsPairFullNamePartRetriever = noteDirsPairFullNamePartRetriever ?? throw new ArgumentNullException(
                nameof(noteDirsPairFullNamePartRetriever));

            this.settings = settings ?? throw new ArgumentNullException(nameof(settings));
            dirNames = settings.DirNames;
            fileNames = settings.FileNames;
            fileContents = settings.FileContents;

            keepFileContentsTemplate = string.Format(
                fileContents.KeepFileContentsTemplate,
                Trmrk.TrmrkGuidStrNoDash);

            noteInternalsPfx = RegexH.EncodeForRegex(
                dirNames.NoteInternalsPfx);

            NoteJsonFileName = string.Join(
                ".", fileNames.NoteFileName, "json");

            NoteBookJsonFileName = string.Join(
                ".", fileNames.NoteBookFileName, "json");
        }

        public string NoteJsonFileName { get; }
        public string NoteBookJsonFileName { get; }

        public List<DataTreeNode<DriveItemOpts>> Generate(
            NoteDirsPairOpts opts,
            out NoteDirsPair pair)
        {
            List<DataTreeNode<DriveItemOpts>> dirsPair;
            pair = GetEntryNamesCore(opts);

            if (opts.DirCategory == DirCategory.Item)
            {
                dirsPair = GetNoteDirsPair(opts, pair);
            }
            else
            {
                dirsPair = GetInternalDirsPair(opts, pair);
            }

            if (settings.SerializeToJson == true)
            {
                SerializeToJson(
                    new SerializationArgs(
                        opts, pair, dirsPair));
            }

            return dirsPair;
        }

        private List<DataTreeNode<DriveItemOpts>> GetNoteDirsPair(
            NoteDirsPairOpts opts,
            NoteDirsPair pair)
        {
            var noteDirChildren = GetNoteDirChildren(opts, pair);

            var retList = new List<DataTreeNode<DriveItemOpts>>
                {
                    Folder(pair.ShortDirName,
                        noteDirChildren),
                    FullNameDir(pair.FullDirName)
                };

            return retList;
        }

        private List<DataTreeNode<DriveItemOpts>> GetInternalDirsPair(
            NoteDirsPairOpts opts,
            NoteDirsPair pair)
        {
            var list = new List<DataTreeNode<DriveItemOpts>>
                {
                    Folder(pair.ShortDirName),
                    FullNameDir(pair.FullDirName)
                };

            return list;
        }

        private DataTreeNode<DriveItemOpts>[] GetNoteDirChildren(
            NoteDirsPairOpts opts,
            NoteDirsPair pair)
        {
            string docFileContents = string.Format(
                fileContents.NoteFileContentsTemplate,
                pair.DocTitle);

            List<DataTreeNode<DriveItemOpts>> list = new()
            {
                TextFile(
                    pair.DocFileName,
                    docFileContents)
            };

            var fullDirNamePartsMap = GetInternalDirNamesList(opts).Select(
                (kvp, idx) => new KeyValuePair<InternalDir, Tuple<int, string>>(
                    kvp.Key, Tuple.Create(idx, kvp.Value))).Dictnr();

            var dirNames = settings.DirNames;

            foreach (var kvp in fullDirNamePartsMap)
            {
                var tuple = kvp.Value;
                int i = tuple.Item1;

                string fullDirNamePart = tuple.Item2;
                string shortDirName = $"{noteInternalsPfx.RawStr}{i + 1}";

                string fullDirName = string.Join(
                    dirNames.JoinStr,
                    shortDirName,
                    fullDirNamePart);

                list.Add(Folder(shortDirName));
                list.Add(FullNameDir(fullDirName));
            }

            if (settings.SerializeToJson == true)
            {
                string json = jsonConversion.Adapter.Serialize(
                    new NoteItemCore
                    {
                        Title = pair.DocTitle,
                        ItemIdx = pair.Idx,
                        InternalDirs = fullDirNamePartsMap.ToDictionary(
                            kvp => kvp.Key, kvp => kvp.Value.Item1 + 1),
                        ChildItems = new Dictionary<int, string>()
                    });

                list.Add(TextFile(
                    NoteJsonFileName, json));
            }

            return list.ToArray();
        }

        private NoteDirsPair GetEntryNamesCore(
            NoteDirsPairOpts opts)
        {
            string shortDirName = shortNameRetriever.GetShortDirName(
                opts, out var pairIdx);

            var pair = new NoteDirsPair(pairIdx);
            pair.ShortDirName = shortDirName;

            SetFullDirNamePart(opts, pair);

            pair.FullDirName = string.Join(
                dirNames.JoinStr,
                shortDirName,
                pair.FullDirNamePart);

            return pair;
        }

        private void SetFullDirNamePart(
            NoteDirsPairOpts opts,
            NoteDirsPair pair)
        {
            string docTitle = null;

            pair.FullDirNamePart = opts.DirCategory switch
            {
                DirCategory.Internals => GetInternalDirName(opts),
                DirCategory.Item => noteDirsPairFullNamePartRetriever.GetNoteDirFullNamePart(
                    opts.Title, out docTitle,
                    opts.AltSpaceChar,
                    settings.FileNameMaxLength)
            };

            if (docTitle != null)
            {
                pair.DocTitle = docTitle;

                string docFileName = settings.FileNames.NoteFileName ?? pair.FullDirNamePart;
                pair.DocFileName = $"{docFileName}.md";
            }
        }

        private Dictionary<InternalDir, string> GetInternalDirNamesList(
            NoteDirsPairOpts opts) => opts.NoteInternalDirs?.ToDictionary(
                internalDir => internalDir,
                internalDir => internalDir switch
                {
                    InternalDir.Root => dirNames.NoteBook,
                    InternalDir.Internals => dirNames.NoteInternals,
                    InternalDir.Files => dirNames.NoteFiles
                }) ?? new Dictionary<InternalDir, string>();

        private string GetInternalDirName(
            NoteDirsPairOpts opts)
        {
            string internalDirName;

            var internalDirNamesList = GetInternalDirNamesList(opts);
            int internalDirNamesCount = internalDirNamesList.Count;

            if (internalDirNamesCount == 1)
            {
                internalDirName = internalDirNamesList.Single().Value;
            }
            else if (internalDirNamesCount == 0)
            {
                throw new ArgumentException(
                    "Either the note name or an internal note dir flag must be specified");
            }
            else
            {
                throw new ArgumentException(
                    "You can only specify multiple note internal dir flags along with the note name");
            }

            return internalDirName;
        }

        private void SerializeToJson(
            SerializationArgs args)
        {
            args.Decorator = args.Pair.NoteItem ?? args.Pair.NoteBook ?? jsonConversion.Decorator(
                new NoteItemCore { ChildItems = new Dictionary<int, string>() });

            if (args.Decorator != null)
            {
                if (args.Opts.Title != null)
                {
                    SerializeNoteToJson(args);
                }
                else
                {
                    SerializeInternalDirToJson(args);
                }
            }
        }

        private void SerializeNoteToJson(
            SerializationArgs args)
        {
            var data = args.Decorator.Data;

            data.ChildItems = data.ChildItems ?? new Dictionary<int, string>();
            data.ChildItemsSortOrder = data.ChildItemsSortOrder ?? new List<int>();

            data.ChildItems.Add(
                args.Pair.Idx, args.Pair.DocTitle);

            int sortIdx = args.Opts.SortIdx ?? 0;

            if (sortIdx >= 0)
            {
                data.ChildItemsSortOrder.Insert(
                    sortIdx, args.Pair.Idx);
            }
            else
            {
                data.ChildItemsSortOrder.Add(
                    args.Pair.Idx);
            }

            string json = args.Decorator.Serialize(true);
            string fileName = GetJsonFileName(args.Opts);

            args.DirsPair.Add(TextFile(
                fileName, json));
        }

        private void SerializeInternalDirToJson(
            SerializationArgs args)
        {
            var data = args.Decorator.Data;
            data.InternalDirs = data.InternalDirs ?? new Dictionary<InternalDir, int>();

            data.InternalDirs.Add(
                args.Opts.NoteInternalDirs.Single(),
                args.Pair.Idx);

            string json = args.Decorator.Serialize(true);
            string fileName = GetJsonFileName(args.Opts);

            args.DirsPair.Add(TextFile(
                fileName, json));
        }

        private string GetJsonFileName(
            NoteDirsPairOpts opts)
        {
            string jsonFileName;

            if (opts.CreateNoteBook || opts.NoteBookJson != null)
            {
                jsonFileName = NoteBookJsonFileName;
            }
            else
            {
                jsonFileName = NoteJsonFileName;
            }

            return jsonFileName;
        }

        private DataTreeNode<DriveItemOpts> TextFile(
            string fileName,
            string contents) => new DriveItemOpts(
                fileName, false,
                contents, true).File();

        private DataTreeNode<DriveItemOpts> KeepFile(
            ) => TextFile(
                fileNames.KeepFileName,
                keepFileContentsTemplate);

        private DataTreeNode<DriveItemOpts> FullNameDir(
            string dirName) => new DriveItemOpts(
                dirName).Folder(KeepFile());

        private DataTreeNode<DriveItemOpts> Folder(
            string folderName,
            params DataTreeNode<DriveItemOpts>[] childItems) => new DriveItemOpts(
                folderName).Folder(childItems);

        private class SerializationArgs
        {
            public SerializationArgs()
            {
            }

            public SerializationArgs(
                NoteDirsPairOpts opts,
                NoteDirsPair pair,
                List<DataTreeNode<DriveItemOpts>> dirsPair)
            {
                Opts = opts;
                Pair = pair;
                DirsPair = dirsPair;
            }

            public NoteDirsPairOpts Opts { get; set; }
            public NoteDirsPair Pair { get; set; }
            public List<DataTreeNode<DriveItemOpts>> DirsPair { get; set; }
            public IJsonObjectDecorator<NoteItemCore> Decorator { get; set; }
        }
    }
}
