using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveItemMacro
    {
        string Key { get; }
        string Name { get; }
        IDriveItemNameMacro GetNameMacro();
        IDriveItemOp GetDriveItemOp();
        IDriveItemOp[] GetMultipleDriveItemOps();
        IDriveItemMacro[] GetChildren();
    }

    public class DriveItemMacroImmtbl : IDriveItemMacro
    {
        public DriveItemMacroImmtbl(IDriveItemMacro src)
        {
            this.Key = src.Key;
            this.Name = src.Name;

            this.NameMacro = src.GetNameMacro().IfNotNull(
                val => new DriveItemNameMacroImmtbl(val));

            this.DriveItemOp = src.GetDriveItemOp().IfNotNull(
                val => new DriveItemOpImmtbl(val));

            this.MultipleDriveItemOps = src.GetMultipleDriveItemOps()?.Select(
                item => new DriveItemOpImmtbl(item)).RdnlC();

            this.Children = src.GetChildren()?.Select(
                item => new DriveItemMacroImmtbl(item)).RdnlC();
        }

        public string Key { get; }
        public string Name { get; }

        public DriveItemNameMacroImmtbl NameMacro { get; }
        public DriveItemOpImmtbl DriveItemOp { get; }
        public ReadOnlyCollection<DriveItemOpImmtbl> MultipleDriveItemOps { get; }
        public ReadOnlyCollection<DriveItemMacroImmtbl> Children { get; }

        public IDriveItemNameMacro GetNameMacro() => this.NameMacro;
        public IDriveItemOp GetDriveItemOp() => this.DriveItemOp;
        public IDriveItemOp[] GetMultipleDriveItemOps() => this.MultipleDriveItemOps?.Cast<IDriveItemOp>().ToArray();
        public IDriveItemMacro[] GetChildren() => this.Children?.Cast<IDriveItemMacro>().ToArray();
    }

    public class DriveItemMacroMtbl : IDriveItemMacro
    {
        public DriveItemMacroMtbl()
        {
        }

        public DriveItemMacroMtbl(IDriveItemMacro src)
        {
            this.Key = src.Key;
            this.Name = src.Name;

            this.NameMacro = src.GetNameMacro().IfNotNull(
                val => new DriveItemNameMacroMtbl(val));

            this.DriveItemOp = src.GetDriveItemOp().IfNotNull(
                val => new DriveItemOpMtbl(val));

            this.MultipleDriveItemOps = src.GetMultipleDriveItemOps()?.Select(
                item => new DriveItemOpMtbl(item)).ToList();

            this.Children = src.GetChildren()?.Select(
                item => new DriveItemMacroMtbl(item)).ToList();
        }

        public string Key { get; set; }
        public string Name { get; set; }

        public DriveItemNameMacroMtbl NameMacro { get; set; }
        public DriveItemOpMtbl DriveItemOp { get; set; }
        public List<DriveItemOpMtbl> MultipleDriveItemOps { get; set; }
        public List<DriveItemMacroMtbl> Children { get; set; }

        public IDriveItemNameMacro GetNameMacro() => this.NameMacro;
        public IDriveItemOp GetDriveItemOp() => this.DriveItemOp;
        public IDriveItemOp[] GetMultipleDriveItemOps() => this.MultipleDriveItemOps?.Cast<IDriveItemOp>().ToArray();
        public IDriveItemMacro[] GetChildren() => this.Children?.Cast<IDriveItemMacro>().ToArray();
    }
}
