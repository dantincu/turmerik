using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
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
                        item, item.OpUuid)).ToArray().RdnlC())).RdnlD();

            return driveItemNameMacros;
        }

        private Dictionary<string, Tuple<string, List<DriveItemOp>>> GetDriveItemMacrosList(
            ReadOnlyDictionary<string, Tuple<string, ReadOnlyCollection<DriveItemNameMacro>>> driveItemNameMacrosMx)
        {
            var commonConstDirNameMacros = driveItemNameMacrosMx[MacrosH.COMMON_CONST];
            var miscMacros = driveItemNameMacrosMx[MacrosH.MISC];

            var descMacros = driveItemNameMacrosMx[MacrosH.DESC_IDX];
            var ascMacros = driveItemNameMacrosMx[MacrosH.ASC_IDX];

            var headingDescMacros = driveItemNameMacrosMx[MacrosH.H_DESC_IDX];
            var headingAscMacros = driveItemNameMacrosMx[MacrosH.H_ASC_IDX];

            var miscDriveItemOps = miscMacros.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(nameMacro)).ToList();

            var descDriveItemOps = descMacros.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(nameMacro)).ToList();

            var ascDriveItemOps = ascMacros.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(nameMacro)).ToList();

            var headingDescDriveItemOps = headingDescMacros.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(nameMacro)).ToList();

            var headingAscDriveItemOps = headingAscMacros.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(nameMacro)).ToList();

            var defaultDescMacro = descMacros.Item2.Skip(1).First();
            var defaultHeadingDescMacro = headingDescMacros.Item2.Last();

            var secondMacrosList = commonConstDirNameMacros.Item2.Select(
                nameMacro => this.GetDirsPairDriveItemOp(
                    this.GetDefaultHeadingDescMacro(
                        defaultHeadingDescMacro,
                        nameMacro.ConstName.First()),
                    nameMacro)).ToList();

            var firstMacrosList = secondMacrosList.Select(
                driveItemOp => this.GetDirsPairDriveItemOp(
                    defaultDescMacro, new DriveItemNameMacro(), shortDirItemOp =>
                    {
                        shortDirItemOp.MultipleItems = driveItemOp.MultipleItems;
                    })).ToList();

            var driveItemOpsDictnr = new Dictionary<string, Tuple<string, List<DriveItemOp>>>
            {
                { MacrosH.COMMON_CONST, new Tuple<string, List<DriveItemOp>>("Common const dir name macros", firstMacrosList) },
                { MacrosH.DESC_IDX, new Tuple<string, List<DriveItemOp>>("Desc Indexing", descDriveItemOps) },
                { MacrosH.ASC_IDX, new Tuple<string, List<DriveItemOp>>("Asc Indexing", ascDriveItemOps) },
                { MacrosH.H_DESC_IDX, new Tuple<string, List<DriveItemOp>>("Heading Desc Indexing", headingDescDriveItemOps) },
                { MacrosH.H_ASC_IDX, new Tuple<string, List<DriveItemOp>>("Heading Asc Indexing", headingAscDriveItemOps) },
                { MacrosH.MISC, new Tuple<string, List<DriveItemOp>>("Miscellaneous", miscDriveItemOps) }
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
                // OpUuid = Guid.NewGuid(),
                NameMacro = nameMacro
            };

            driveItemOpCallback?.Invoke(driveItemOp);
            return driveItemOp;
        }

        private DriveItemNameMacro GetDefaultHeadingDescMacro(
            DriveItemNameMacro defaultHeadingDescMacro, char trailingChar)
        {
            defaultHeadingDescMacro = new DriveItemNameMacro(defaultHeadingDescMacro)
            {
                SucceedingDelimiter = new string(new char[] { ' ', trailingChar })
            };

            return defaultHeadingDescMacro;
        }
    }
}
