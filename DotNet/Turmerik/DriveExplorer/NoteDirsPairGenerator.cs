using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Turmerik.Utility;
using Turmerik.MkFsDirsPair.Lib;
using Turmerik.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirsPairGenerator
    {
        List<DataTreeNode<DriveItemOpts>> Generate(
            NoteDirsPairOpts opts,
            out string shortDirName,
            out string? docFileName);
    }

    public class NoteDirsPairGenerator : INoteDirsPairGenerator
    {
        private readonly NoteDirsPairSettings settings;
        private readonly NoteDirsPairSettings.DirNamesT dirNames;
        private readonly NoteDirsPairSettings.FileNamesT fileNames;
        private readonly NoteDirsPairSettings.FileContentsT fileContents;

        private readonly INoteDirsPairShortNameRetriever noteDirsPairShortNameRetriever;
        private readonly INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever;

        private readonly string keepFileContentsTemplate;
        private readonly RegexEncodedText noteInternalsPfx;

        public NoteDirsPairGenerator(
            INoteDirsPairShortNameRetriever noteDirsPairShortNameRetriever,
            INoteDirsPairFullNamePartRetriever noteDirsPairFullNamePartRetriever,
            NoteDirsPairSettings settings)
        {
            this.noteDirsPairShortNameRetriever = noteDirsPairShortNameRetriever ?? throw new ArgumentNullException(
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
        }

        public List<DataTreeNode<DriveItemOpts>> Generate(
            NoteDirsPairOpts opts,
            out string shortDirName,
            out string? docFileName)
        {
            List<DataTreeNode<DriveItemOpts>> dirsPair;

            shortDirName = GetEntryNamesCore(
                opts, out _,
                out string fullDirName,
                out string docTitle,
                out docFileName);

            if (opts.DirCategory == NoteDirCategory.TrmrkNote)
            {
                dirsPair = GetNoteDirsPair(opts,
                    shortDirName, fullDirName,
                    docTitle, docFileName);
            }
            else
            {
                dirsPair = GetInternalDirsPair(
                    shortDirName, fullDirName);
            }

            return dirsPair;
        }

        private List<DataTreeNode<DriveItemOpts>> GetNoteDirsPair(
            NoteDirsPairOpts opts,
            string shortDirName,
            string fullDirName,
            string docTitle,
            string docFileName)
        {
            var noteDirChildren = GetNoteDirChildren(
                opts, docTitle, docFileName);

            var retList = new List<DataTreeNode<DriveItemOpts>>
                {
                    Folder(shortDirName,
                        noteDirChildren),
                    FullNameDir(fullDirName)
                };

            return retList;
        }

        private List<DataTreeNode<DriveItemOpts>> GetInternalDirsPair(
            string shortDirName,
            string fullDirName) => new List<DataTreeNode<DriveItemOpts>>
                {
                    Folder(shortDirName),
                    FullNameDir(fullDirName)
                };

        private DataTreeNode<DriveItemOpts>[] GetNoteDirChildren(
            NoteDirsPairOpts opts,
            string docTitle,
            string docFileName)
        {
            string docFileContents = string.Format(
                    fileContents.NoteFileContentsTemplate,
                    docTitle);

            List<DataTreeNode<DriveItemOpts>> list = new()
            {
                TextFile(
                    docFileName,
                    docFileContents)
            };

            var fullDirNamePartsList = GetInternalDirNamesList(opts);

            int dirsCount = fullDirNamePartsList.Count;
            var dirNames = settings.DirNames;

            for (int i = 0; i < dirsCount; i++)
            {
                string fullDirNamePart = fullDirNamePartsList[i];
                string shortDirName = $"{noteInternalsPfx.RawStr}{i + 1}";

                string fullDirName = string.Join(
                    dirNames.JoinStr,
                    shortDirName,
                    fullDirNamePart);

                list.Add(Folder(shortDirName));
                list.Add(FullNameDir(fullDirName));
            }

            return list.ToArray();
        }

        private string GetEntryNamesCore(
            NoteDirsPairOpts opts,
            out string fullDirNamePart,
            out string fullDirName,
            out string docTitle,
            out string? docFileName)
        {
            string shortDirName = noteDirsPairShortNameRetriever.GetShortDirName(opts);

            fullDirNamePart = GetFullDirNamePart(opts,
                out docTitle, out docFileName);

            fullDirName = string.Join(
                dirNames.JoinStr,
                shortDirName,
                fullDirNamePart);

            return shortDirName;
        }

        private string GetFullDirNamePart(
            NoteDirsPairOpts opts,
            out string docTitle,
            out string? docFileName)
        {
            docTitle = null;
            docFileName = null;

            string fullDirNamePart = opts.DirCategory switch
            {
                NoteDirCategory.TrmrkInternals => GetInternalDirName(opts),
                NoteDirCategory.TrmrkNote => noteDirsPairFullNamePartRetriever.GetNoteDirFullNamePart(
                    opts.Title, out docTitle,
                    opts.AltSpaceChar,
                    settings.FileNameMaxLength)
            };

            if (docTitle != null)
            {
                docFileName = settings.FileNames.NoteFileName ?? fullDirNamePart;
                docFileName = $"{docFileName}.md";
            }

            return fullDirNamePart;
        }

        private List<string> GetInternalDirNamesList(
            NoteDirsPairOpts opts)
        {
            var fullDirNamesList = opts.NoteInternalDirs?.Select(
                internalDir => internalDir switch
                {
                    NoteInternalDir.NoteInternals => dirNames.NoteInternals,
                    NoteInternalDir.NoteFiles => dirNames.NoteFiles
                }).ToList() ?? new List<string>();

            if (opts.CreateNoteBook)
            {
                if (fullDirNamesList.Any())
                {
                    throw new ArgumentException(
                        "The note book dir pairs flag cannot be provided along with other dir pairs flags");
                }

                fullDirNamesList.Add(
                    dirNames.NoteBook);
            }

            return fullDirNamesList;
        }

        private string GetInternalDirName(
            NoteDirsPairOpts opts)
        {
            string internalDirName;

            var internalDirNamesList = GetInternalDirNamesList(opts);
            int internalDirNamesCount = internalDirNamesList.Count;

            if (internalDirNamesCount == 1)
            {
                internalDirName = internalDirNamesList.Single();
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

        private DataTreeNode<DriveItemOpts> TextFile(
            string fileName,
            string contents) => new DriveItemOpts(
                fileName,
                contents).File();

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
    }
}
