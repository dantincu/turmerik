using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.DriveExplorer
{
    public interface IDriveItemOp : IDriveItem
    {
        Guid? OpUuid { get; }
        IDriveItemOp[] GetMultipleItems();
        IDriveItemNameMacro GetNameMacro();
    }

    public class DriveItemOpImmtbl : DriveItemMtbl, IDriveItemOp
    {
        public DriveItemOpImmtbl(IDriveItemOp src) : base(src)
        {
            this.OpUuid = src.OpUuid;

            this.MultipleItems = src.GetMultipleItems()?.Select(
                item => new DriveItemOpImmtbl(item)).RdnlC();

            this.NameMacro = src.GetNameMacro().IfNotNull(
                val => new DriveItemNameMacroImmtbl(val));
        }

        public Guid? OpUuid { get; set; }
        public ReadOnlyCollection<DriveItemOpImmtbl> MultipleItems { get; set; }
        public DriveItemNameMacroImmtbl NameMacro { get; set; }

        public IDriveItemOp[] GetMultipleItems() => this.MultipleItems?.Cast<IDriveItemOp>().ToArray();

        public IDriveItemNameMacro GetNameMacro() => this.NameMacro;
    }

    public class DriveItemOpMtbl : DriveItemMtbl, IDriveItemOp
    {
        public DriveItemOpMtbl()
        {
        }

        public DriveItemOpMtbl(IDriveItemOp src, Guid? opUuid = null) : base(src)
        {
            this.OpUuid = opUuid;

            this.MultipleItems = src.GetMultipleItems()?.Select(
                item => new DriveItemOpMtbl(item)).ToList();

            this.NameMacro = src.GetNameMacro().IfNotNull(
                val => new DriveItemNameMacroMtbl(val));
        }

        public Guid? OpUuid { get; set; }
        public List<DriveItemOpMtbl> MultipleItems { get; set; }
        public DriveItemNameMacroMtbl NameMacro { get; set; }

        public IDriveItemOp[] GetMultipleItems() => this.MultipleItems?.Cast<IDriveItemOp>().ToArray();

        public IDriveItemNameMacro GetNameMacro() => this.NameMacro;
    }
}
