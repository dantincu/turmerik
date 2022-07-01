using System.Collections.ObjectModel;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.Services
{
    public interface IDriveItemMacrosService
    {
        IDriveItemNameMacrosService DriveItemNameMacrosService { get; }
        ReadOnlyDictionary<string, Tuple<string, ReadOnlyCollection<DriveItemOp>>> GetDriveItemMacros();
    }

    public class DriveItemMacrosService : IDriveItemMacrosService
    {
        private readonly ReadOnlyDictionary<string, Tuple<string, ReadOnlyCollection<DriveItemNameMacro>>> driveItemNameMacrosMx;
        private readonly Dictionary<string, Tuple<string, List<DriveItemOp>>> driveItemMacrosMx;

        public DriveItemMacrosService(
            IDriveItemNameMacrosService driveItemNameMacrosService)
        {
            this.DriveItemNameMacrosService = driveItemNameMacrosService ?? throw new ArgumentNullException(nameof(driveItemNameMacrosService));
            this.driveItemNameMacrosMx = this.DriveItemNameMacrosService.GetDriveItemNameMacros();
            this.driveItemMacrosMx = this.GetDriveItemMacrosList(this.driveItemNameMacrosMx);
        }

        public IDriveItemNameMacrosService DriveItemNameMacrosService { get; }

        public ReadOnlyDictionary<string, Tuple<string, ReadOnlyCollection<DriveItemOp>>> GetDriveItemMacros()
        {
            var driveItemNameMacros = this.driveItemMacrosMx.ToDictionary(
                kvp => kvp.Key,
                kvp => new Tuple<string, ReadOnlyCollection<DriveItemOp>>(
                    kvp.Value.Item1,
                    kvp.Value.Item2.Select(
                    item => new DriveItemOp(
                        item)).ToArray().RdnlC())).RdnlD();

            return driveItemNameMacros;
        }

        private Dictionary<string, Tuple<string, List<DriveItemOp>>> GetDriveItemMacrosList(
            ReadOnlyDictionary<string, Tuple<string, ReadOnlyCollection<DriveItemNameMacro>>> driveItemNameMacrosMx)
        {
            var driveItemNameMacrosMxList = driveItemNameMacrosMx.ToList();
            var commonConstDirNameMacros = driveItemNameMacrosMxList[driveItemNameMacrosMxList.Count - 2];

            var descMacros = driveItemNameMacrosMxList[0];
            var ascMacros = driveItemNameMacrosMxList[1];

            var headingDescMacros = driveItemNameMacrosMxList[2];
            var headingAscMacros = driveItemNameMacrosMxList[3];

            var descDriveItemOps = descMacros.Value.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(nameMacro)).ToList();

            var ascDriveItemOps = ascMacros.Value.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(nameMacro)).ToList();

            var headingDescDriveItemOps = headingDescMacros.Value.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(nameMacro)).ToList();

            var headingAscDriveItemOps = headingAscMacros.Value.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(nameMacro)).ToList();

            var defaultDescMacro = descMacros.Value.Item2.Skip(1).First();
            var defaultHeadingDescMacro = headingDescMacros.Value.Item2.Last();

            var firstMacrosList = commonConstDirNameMacros.Value.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(
                    defaultDescMacro, null, shortDirItemOp =>
                    {
                        shortDirItemOp.MultipleItems = new List<DriveItemOp>
                        {
                            this.GetDriveItemOp(defaultHeadingDescMacro),
                            this.GetDriveItemOp(new DriveItemNameMacro(defaultHeadingDescMacro)
                                {
                                    SucceedingDelimiter = " ",
                                    SucceedingMacro = nameMacro
                                })
                        };
                    })).ToList();

            var driveItemOpsDictnr = new Dictionary<string, Tuple<string, List<DriveItemOp>>>
            {
                { MacrosH.COMMON_CONST, new Tuple<string, List<DriveItemOp>>("Common const dir name macros", firstMacrosList) },
                { MacrosH.DESC_IDX, new Tuple<string, List<DriveItemOp>>("Desc Indexing", descDriveItemOps) },
                { MacrosH.ASC_IDX, new Tuple<string, List<DriveItemOp>>("Asc Indexing", ascDriveItemOps) },
                { MacrosH.H_DESC_IDX, new Tuple<string, List<DriveItemOp>>("Heading Desc Indexing", headingDescDriveItemOps) },
                { MacrosH.H_ASC_IDX, new Tuple<string, List<DriveItemOp>>("Heading Asc Indexing", headingAscDriveItemOps) },
            };

            return driveItemOpsDictnr;
        }

        private DriveItemOp GetDirsPairDriveItemOp(
            DriveItemNameMacro shortNameMacro,
            DriveItemNameMacro fullNamePartMacro = null,
            Action<DriveItemOp> shortDirItemOpCallback = null)
        {
            var shortDirItemOp = this.GetDriveItemOp(shortNameMacro);
            shortDirItemOpCallback?.Invoke(shortDirItemOp);

            var driveItemOp = this.GetDriveItemOp(null, dvItemOp =>
            {
                dvItemOp.MultipleItems = new List<DriveItemOp>
                {
                    shortDirItemOp,
                    this.GetDriveItemOp(new DriveItemNameMacro(shortNameMacro)
                        {
                            SucceedingDelimiter = " ",
                            SucceedingMacro = fullNamePartMacro ?? new DriveItemNameMacro()
                        })
                };
            });

            return driveItemOp;
        }

        private DriveItemOp GetDriveItemOp(
            DriveItemNameMacro nameMacro = null,
            Action<DriveItemOp> driveItemOpCallback = null)
        {
            var driveItemOp = new DriveItemOp
            {
                OpUuid = Guid.NewGuid(),
                NameMacro = nameMacro
            };

            driveItemOpCallback?.Invoke(driveItemOp);
            return driveItemOp;
        }
    }
}
