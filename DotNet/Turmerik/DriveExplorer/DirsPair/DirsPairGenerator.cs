using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.Utility;

namespace Turmerik.DriveExplorer.DirsPair
{
    public interface IDirsPairGenerator
    {
        Task<List<DriveItemX>> GenerateItemsAsync(
            DirsPairOpts opts);
    }

    public class DirsPairGenerator : IDirsPairGenerator
    {
        private readonly IDriveExplorerService dvExplrSvc;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;

        public DirsPairGenerator(
            IDriveExplorerService dvExplrSvc,
            IFsEntryNameNormalizer fsEntryNameNormalizer)
        {
            this.dvExplrSvc = dvExplrSvc ?? throw new ArgumentNullException(
                nameof(dvExplrSvc));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));
        }

        public async Task<List<DriveItemX>> GenerateItemsAsync(
            DirsPairOpts opts)
        {
            opts.FullDirNamePart ??= fsEntryNameNormalizer.NormalizeFsEntryName(
                opts.Title, opts.MaxFsEntryNameLength);

            var folderFiles = GetFolderFiles(opts);
            var dirsPair = GetDirsPair(opts, folderFiles);

            if (opts.ThrowIfAnyItemAlreadyExists)
            {
                foreach (var item in dirsPair)
                {
                    item.Idnf ??= dvExplrSvc.GetItemIdnf(
                        item, opts.PrIdnf);

                    if (await dvExplrSvc.ItemExistsAsync(
                        item.Idnf))
                    {
                        throw new InvalidOperationException(
                            $"File path {item.Idnf} already exists");
                    }
                }
            }

            return dirsPair;
        }

        private List<DriveItemX> GetDirsPair(
            DirsPairOpts opts,
            List<DriveItemX> folderFiles) => new List<DriveItemX>
            {
                new DriveItemX
                {
                    Name = opts.ShortDirName,
                    IsFolder = true,
                    FolderFiles = folderFiles,
                    Data = new DriveItemXData()
                },
                new DriveItemX
                {
                    Name = string.Join(
                        opts.JoinStr,
                        opts.ShortDirName,
                        opts.FullDirNamePart),
                    IsFolder = true,
                    FolderFiles = new DriveItemX
                    {
                        Name = opts.KeepFileName,
                        Data = new DriveItemXData
                        {
                            TextFileContents = opts.KeepFileNameContents
                        }
                    }.Arr().ToList(),
                    Data = new DriveItemXData()
                }
            };

        private List<DriveItemX> GetFolderFiles(
            DirsPairOpts opts)
        {
            List<DriveItemX> folderFiles = null;

            if (!string.IsNullOrWhiteSpace(
                opts.MdFileNameTemplate))
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
                            opts.Title,
                            Trmrk.TrmrkGuidStrNoDash,
                            opts.TrmrkGuidInputName ?? TrmrkNotesH.TRMRK_GUID_INPUT_NAME)
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
