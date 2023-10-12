using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public interface INoteDirNamesPairGenerator
    {
        string NoteJsonFileName { get; }
        string NoteBookJsonFileName { get; }

        DirsPairInfo GetDirsPairInfo(
            MkNoteDirsPairWorkArgs wka,
            out NoteDirsPair pair);
    }

    public class NoteDirNamesPairGenerator : INoteDirNamesPairGenerator
    {
        private readonly INoteDirsPairGenerator noteDirsPairGenerator;
        private readonly NoteDirsPairSettings trmrk;
        private readonly NoteDirsPairSettings.FileNamesT fileNames;

        public NoteDirNamesPairGenerator(
            INoteDirsPairGeneratorFactory noteDirsPairGeneratorFactory,
            NoteDirsPairSettings trmrk)
        {
            this.trmrk = trmrk;
            this.fileNames = trmrk.FileNames;

            this.noteDirsPairGenerator = noteDirsPairGeneratorFactory.Generator(trmrk);
            NoteJsonFileName = noteDirsPairGenerator.NoteJsonFileName;
            NoteBookJsonFileName = noteDirsPairGenerator.NoteBookJsonFileName;
        }

        public string NoteJsonFileName { get; }
        public string NoteBookJsonFileName { get; }

        public DirsPairInfo GetDirsPairInfo(
            MkNoteDirsPairWorkArgs wka,
            out NoteDirsPair pair)
        {
            DirsPairInfo info;

            if (wka.ProgArgs.CreateNote)
            {
                info = GetNoteDirsPairInfo(wka, out pair);
            }
            else
            {
                info = GetInternalDirsPairInfoCore(wka, out pair);
            }

            return info;
        }

        private DirsPairInfo GetNoteDirsPairInfo(
            MkNoteDirsPairWorkArgs wka,
            out NoteDirsPair pair)
        {
            var dirsList = noteDirsPairGenerator.Generate(
                new NoteDirsPairOpts
                {
                    Title = wka.ProgArgs.NoteName,
                    AltSpaceChar = ':',
                    DirCategory = wka.DirCat,
                    ExistingEntriesArr = wka.ExistingEntriesArr,
                    NoteBookJson = wka.NoteBookJson,
                    NoteItemJson = wka.NoteItemJson,
                    NoteInternalDirs = GetInternalDirNamesList(
                        wka.ProgArgs),
                    SortIdx = wka.ProgArgs.SortIdx
                },
                out pair);

            string docFilePath = Path.Combine(
                wka.WorkDir,
                pair.ShortDirName,
                pair.DocFileName);

            var retInfo = new DirsPairInfo(
                wka.WorkDir,
                wka.ExistingEntriesArr,
                dirsList,
                wka.ProgArgs.OpenCreatedDocFile ? docFilePath: null);

            return retInfo;
        }

        private DirsPairInfo GetInternalDirsPairInfoCore(
            MkNoteDirsPairWorkArgs wka,
            out NoteDirsPair pair) => new DirsPairInfo(
                wka.WorkDir,
                wka.ExistingEntriesArr,
                noteDirsPairGenerator.Generate(
                    new NoteDirsPairOpts
                    {
                        AltSpaceChar = ':',
                        DirCategory = wka.DirCat,
                        ExistingEntriesArr = wka.ExistingEntriesArr,
                        NoteBookJson = wka.NoteBookJson,
                        NoteItemJson = wka.NoteItemJson,
                        NoteInternalDirs = GetInternalDirNamesList(
                            wka.ProgArgs),
                        CreateNoteBook = wka.ProgArgs.CreateNoteBook,
                        SortIdx = wka.ProgArgs.SortIdx
                    }, out pair),
                null);

        private InternalDir[] GetInternalDirNamesList(
            MkNoteDirsPairArgs pga)
        {
            List<InternalDir> fullDirNamesList = new();

            if (pga.CreateNoteBook)
            {
                fullDirNamesList.Add(
                    InternalDir.Root);
            }

            if (pga.CreateNoteFiles)
            {
                fullDirNamesList.Add(
                    InternalDir.Files);
            }

            if (pga.CreateNoteInternals)
            {
                fullDirNamesList.Add(
                    InternalDir.Internals);
            }

            if (pga.CreateNoteBook && fullDirNamesList.Count > 1)
            {
                throw new ArgumentException(
                    "The create note book flag cannot be provided along with other note flags");
            }

            return fullDirNamesList.ToArray();
        }
    }
}
