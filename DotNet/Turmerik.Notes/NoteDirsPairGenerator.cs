using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;

namespace Turmerik.Notes
{
    public interface INoteDirsPairGenerator
    {
        List<DriveItemX> GenerateItems(
            DirsPairOpts opts);
    }

    public class NoteDirsPairGenerator : INoteDirsPairGenerator
    {
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;

        public NoteDirsPairGenerator(
            IFsEntryNameNormalizer fsEntryNameNormalizer)
        {
            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));
        }

        public List<DriveItemX> GenerateItems(
            DirsPairOpts opts)
        {
            opts.FullDirNamePart ??= fsEntryNameNormalizer.NormalizeFsEntryName(
                opts.Title, opts.MaxFsEntryNameLength);

            var folderFiles = GetFolderFiles(opts);
            var dirsPair = GetDirsPair(opts, folderFiles);

            return dirsPair;
        }

        private List<DriveItemX> GetDirsPair(
            DirsPairOpts opts,
            List<DriveItemX> folderFiles) => new List<DriveItemX>
            {
                new DriveItemX
                {
                    Name = opts.ShortDirName,
                    FolderFiles = folderFiles
                },
                new DriveItemX
                {
                    Name = string.Join(
                        opts.JoinStr,
                        opts.ShortDirName,
                        opts.FullDirNamePart),
                    FolderFiles = new DriveItemX
                    {
                        Name = opts.KeepFileName,
                        Data = new DriveItemXData
                        {
                            TextFileContents = opts.KeepFileNameContents
                        }
                    }.Arr().ToList()
                }
            };

        private List<DriveItemX> GetFolderFiles(
            DirsPairOpts opts)
        {
            List<DriveItemX> folderFiles = null;

            if (opts.MdFileNameTemplate != null)
            {
                var mdFile = new DriveItemX
                {
                    Name = string.Format(
                        opts.MdFileNameTemplate,
                        opts.FullDirNamePart),
                    Data = new DriveItemXData
                    {
                        TextFileContents = string.Format(
                            opts.MdFileContentsTemplate,
                            opts.Title)
                    }
                };

                folderFiles = new List<DriveItemX>
                {
                    mdFile
                };
            }

            return folderFiles;
        }
    }
}
