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
        ReadOnlyCollection<DriveItemMacroImmtbl> GetDriveItemMacros();
        DriveItemMacrosAggregate GetDriveItemMacrosAggregate();
    }

    public class DriveItemMacrosService : IDriveItemMacrosService
    {
        private readonly ReadOnlyCollection<DriveItemMacroImmtbl> driveItemNameMacros;
        private readonly ReadOnlyCollection<DriveItemMacroImmtbl> driveItemMacros;

        public DriveItemMacrosService(
            IDriveItemNameMacrosService driveItemNameMacrosService)
        {
            this.DriveItemNameMacrosService = driveItemNameMacrosService ?? throw new ArgumentNullException(
                nameof(driveItemNameMacrosService));

            this.driveItemNameMacros = this.DriveItemNameMacrosService.GetDriveItemNameMacros();

            this.driveItemMacros = this.GetDriveItemMacrosList(
                this.driveItemNameMacros).Select(
                item => new DriveItemMacroImmtbl(item)).RdnlC();
        }

        public IDriveItemNameMacrosService DriveItemNameMacrosService { get; }

        public ReadOnlyCollection<DriveItemMacroImmtbl> GetDriveItemMacros() => this.driveItemMacros;

        public DriveItemMacrosAggregate GetDriveItemMacrosAggregate() => new DriveItemMacrosAggregate(
            this.driveItemMacros, this.driveItemNameMacros);

        private List<DriveItemMacroMtbl> GetDriveItemMacrosList(
            ReadOnlyCollection<DriveItemMacroImmtbl> driveItemNameMacros)
        {
            var pinnedMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.PINNED);

            var constDirNameMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.CONST);

            var descMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.DESC_IDX);

            var ascMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.ASC_IDX);

            var headingDescMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.H_DESC_IDX);

            var headingAscMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.H_ASC_IDX);

            var entryNameMacro = pinnedMacros.Children.Single(
                macro => macro.Name == MacrosH.ENTRY_NAME);

            var srcNameMacro = pinnedMacros.Children.Single(
                macro => macro.Name == MacrosH.SRC_NAME);

            var descDriveItemOps = descMacros.Children.Select(
                macro => this.GetDirsPairDriveItemOp(
                    macro.GetNameMacro(),
                    entryNameMacro.GetNameMacro(),
                    null, MacrosH.DESC_IDX)).ToList();

            var ascDriveItemOps = ascMacros.Children.Select(
                macro => this.GetDirsPairDriveItemOp(
                    macro.GetNameMacro(),
                    entryNameMacro.GetNameMacro(),
                    null, MacrosH.ASC_IDX)).ToList();

            var headingDescDriveItemOps = headingDescMacros.Children.Select(
                macro => this.GetDirsPairDriveItemOp(
                    macro.GetNameMacro(),
                    entryNameMacro.GetNameMacro(),
                    null, MacrosH.H_DESC_IDX)).ToList();

            var headingAscDriveItemOps = headingAscMacros.Children.Select(
                macro => this.GetDirsPairDriveItemOp(
                    macro.GetNameMacro(),
                    entryNameMacro.GetNameMacro(),
                    null, MacrosH.H_ASC_IDX)).ToList();

            var defaultDescMacro = pinnedMacros.Children.First();
            var defaultHeadingDescMacro = headingDescMacros.Children.Last();

            var firstMacrosList = constDirNameMacros.Children.Select(
                macro => this.GetConstDirMacros(
                    defaultHeadingDescMacro.NameMacro,
                    macro)).ToList();

            var retList = new List<DriveItemMacroMtbl>()
            {
                this.GetDriveItemMacroMtbl(MacrosH.CONST, "Common const dir name macros", firstMacrosList),
                this.GetDriveItemMacroMtbl(MacrosH.DESC_IDX, "Desc Indexing", descDriveItemOps),
                this.GetDriveItemMacroMtbl(MacrosH.ASC_IDX, "Asc Indexing", ascDriveItemOps),
                this.GetDriveItemMacroMtbl(MacrosH.H_DESC_IDX, "Heading Desc Indexing", headingDescDriveItemOps),
                this.GetDriveItemMacroMtbl(MacrosH.H_ASC_IDX, "Heading Asc Indexing", headingAscDriveItemOps),
            };

            return retList;
        }

        private DriveItemMacroMtbl GetDriveItemMacroMtbl(
            string key, string name,
            List<DriveItemMacroMtbl> macros)
        {
            var retMacro = new DriveItemMacroMtbl
            {
                Key = key,
                Name = name,
                Children = macros
            };

            return retMacro;
        }

        private DriveItemMacroMtbl GetConstDirMacros(
            IDriveItemNameMacro defaultHeadingDescMacro,
            DriveItemMacroImmtbl immtblMacro)
        {
            DriveItemMacroMtbl mtblMacro;

            if (immtblMacro.NameMacro != null)
            {
                var headingDescMacro = this.GetDefaultHeadingDescMacro(
                    defaultHeadingDescMacro,
                    immtblMacro.NameMacro.ConstName.First());

                mtblMacro = this.GetDirsPairDriveItemOp(
                    headingDescMacro,
                    immtblMacro.NameMacro,
                    null, immtblMacro.Key);
            }
            else
            {
                mtblMacro = new DriveItemMacroMtbl
                {
                    Key = immtblMacro.Key,
                    Name = immtblMacro.Name,
                    Children = immtblMacro.Children.Select(
                        child => this.GetConstDirMacros(
                            defaultHeadingDescMacro, child)).ToList()
                };
            }

            return mtblMacro;
        }

        private DriveItemMacroMtbl GetDirsPairDriveItemOp(
            IDriveItemNameMacro shortNameMacro,
            IDriveItemNameMacro fullNamePartMacro,
            string name = null, string key = null)
        {
            var shortDirItemOp = this.GetDriveItemOp(shortNameMacro);

            var fullNameMacro = this.GetDriveItemOp(
                new DriveItemNameMacroMtbl(shortNameMacro)
            {
                SucceedingDelimiter = " ",
                SucceedingMacro = new DriveItemNameMacroMtbl(
                    fullNamePartMacro)
            });

            var retMacro = new DriveItemMacroMtbl
            {
                Name = name ?? shortNameMacro.MacroName,
                Key = key,
                MultipleDriveItemOps = new List<DriveItemOpMtbl>
                {
                    shortDirItemOp,
                    fullNameMacro
                }
            };

            return retMacro;
        }

        private DriveItemOpMtbl GetDriveItemOp(
            IDriveItemNameMacro nameMacro = null,
            Action<DriveItemOpMtbl> driveItemOpCallback = null)
        {
            var driveItemOp = new DriveItemOpMtbl
            {
                NameMacro = new DriveItemNameMacroMtbl(nameMacro)
            };

            driveItemOpCallback?.Invoke(driveItemOp);
            return driveItemOp;
        }

        private DriveItemNameMacroMtbl GetDefaultHeadingDescMacro(
            IDriveItemNameMacro defaultHeadingDescMacro, char trailingChar)
        {
            var headingDescMacro = new DriveItemNameMacroMtbl(defaultHeadingDescMacro)
            {
                SucceedingDelimiter = new string(new char[] { ' ', trailingChar })
            };

            return headingDescMacro;
        }
    }
}
