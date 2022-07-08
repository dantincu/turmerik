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

        private List<DriveItemMacroMtbl> GetDriveItemMacrosList(
            ReadOnlyCollection<DriveItemMacroImmtbl> driveItemNameMacros)
        {
            var commonConstDirNameMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.COMMON_CONST);

            var miscMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.PINNED);

            var descMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.DESC_IDX);

            var ascMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.ASC_IDX);

            var headingDescMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.H_DESC_IDX);

            var headingAscMacros = driveItemNameMacros.Single(
                macro => macro.Key == MacrosH.H_ASC_IDX);

            var entryNameMacro = commonConstDirNameMacros.Children.Single(
                macro => macro.Name == MacrosH.ENTRY_NAME);

            var srcNameMacro = commonConstDirNameMacros.Children.Single(
                macro => macro.Name == MacrosH.SRC_NAME);

            var miscDriveItemOps = miscMacros.Children.Select(
                macro => this.GetDirsPairDriveItemOp(
                    macro.GetNameMacro(),
                    entryNameMacro.GetNameMacro(),
                    macro.NameMacro.MacroName)).ToList();

            var descDriveItemOps = descMacros.Children.Select(
                macro => this.GetDirsPairDriveItemOp(
                    macro.GetNameMacro(),
                    entryNameMacro.GetNameMacro(),
                    macro.NameMacro.MacroName)).ToList();

            var ascDriveItemOps = ascMacros.Children.Select(
                macro => this.GetDirsPairDriveItemOp(macro.GetNameMacro(),
                    entryNameMacro.GetNameMacro(),
                    macro.NameMacro.MacroName)).ToList();

            var headingDescDriveItemOps = headingDescMacros.Children.Select(
                macro => this.GetDirsPairDriveItemOp(macro.GetNameMacro(),
                    entryNameMacro.GetNameMacro(),
                    macro.NameMacro.MacroName)).ToList();

            var headingAscDriveItemOps = headingAscMacros.Children.Select(
                macro => this.GetDirsPairDriveItemOp(macro.GetNameMacro(),
                    entryNameMacro.GetNameMacro(),
                    macro.NameMacro.MacroName)).ToList();

            var defaultDescMacro = descMacros.Children.Skip(1).First();
            var defaultHeadingDescMacro = headingDescMacros.Children.Last();

            var secondMacrosList = commonConstDirNameMacros.Children.Where(
                macro => macro.NameMacro.ConstName.Any()).Select(
                macro => this.GetDirsPairDriveItemOp(
                    this.GetDefaultHeadingDescMacro(
                        defaultHeadingDescMacro.NameMacro,
                        macro.NameMacro.ConstName.First()),
                    macro.NameMacro,
                    macro.NameMacro.MacroName)).ToList();

            var firstMacrosList = secondMacrosList.Select(
                macro => this.GetDirsPairDriveItemOp(
                    defaultDescMacro.NameMacro, new DriveItemNameMacroMtbl(),
                    macro.NameMacro.MacroName, shortDirItemOp =>
                    {
                        shortDirItemOp.MultipleItems = macro.MultipleDriveItemOps;
                    })).ToList();

            var retList = new List<DriveItemMacroMtbl>()
            {
                this.GetDriveItemMacroMtbl(MacrosH.COMMON_CONST, "Common const dir name macros", firstMacrosList),
                this.GetDriveItemMacroMtbl(MacrosH.DESC_IDX, "Desc Indexing", descDriveItemOps),
                this.GetDriveItemMacroMtbl(MacrosH.ASC_IDX, "Asc Indexing", ascDriveItemOps),
                this.GetDriveItemMacroMtbl(MacrosH.H_DESC_IDX, "Heading Desc Indexing", headingDescDriveItemOps),
                this.GetDriveItemMacroMtbl(MacrosH.H_ASC_IDX, "Heading Asc Indexing", headingAscDriveItemOps),
                this.GetDriveItemMacroMtbl(MacrosH.PINNED, "Miscellaneous", miscDriveItemOps)
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

        private DriveItemMacroMtbl GetDirsPairDriveItemOp(
            IDriveItemNameMacro shortNameMacro,
            IDriveItemNameMacro fullNamePartMacro,
            string name,
            Action<DriveItemOpMtbl> shortDirItemOpCallback = null)
        {
            var shortDirItemOp = this.GetDriveItemOp(shortNameMacro);
            shortDirItemOpCallback?.Invoke(shortDirItemOp);

            var fullNameMacro = this.GetDriveItemOp(
                new DriveItemNameMacroMtbl(shortNameMacro)
            {
                SucceedingDelimiter = " ",
                SucceedingMacro = new DriveItemNameMacroMtbl(
                    fullNamePartMacro)
            });

            var retMacro = new DriveItemMacroMtbl
            {
                Name = name,
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
