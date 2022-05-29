using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FsUtils.WinForms.App
{
    public interface IFsEntriesDataGridCell
    {
        int CellIndex { get; }
        string CellText { get; }
        object CellValue { get; }
        FsEntriesDataGridCellType CellType { get; }
        bool IsEditable { get; }
        bool IsEditMode { get; }
        string EditedCellText { get; }
        TValue GetCellValue<TValue>();
    }

    public class FsEntriesDataGridCellImmtbl : IFsEntriesDataGridCell
    {
        public FsEntriesDataGridCellImmtbl(IFsEntriesDataGridCell src)
        {
            CellIndex = src.CellIndex;
            CellText = src.CellText;
            CellValue = src.CellValue;
            CellType = src.CellType;
            IsEditable = src.IsEditable;
            IsEditMode = src.IsEditMode;
            EditedCellText = src.EditedCellText;
        }

        public int CellIndex { get; }
        public string CellText { get; }
        public object CellValue { get; }
        public FsEntriesDataGridCellType CellType { get; }
        public bool IsEditable { get; }
        public bool IsEditMode { get; }
        public string EditedCellText { get; }

        public TValue GetCellValue<TValue>() => (TValue)CellValue;
    }

    public class FsEntriesDataGridCellMtbl : IFsEntriesDataGridCell
    {
        public FsEntriesDataGridCellMtbl()
        {
        }

        public FsEntriesDataGridCellMtbl(IFsEntriesDataGridCell src)
        {
            CellIndex = src.CellIndex;
            CellText = src.CellText;
            CellValue = src.CellValue;
            CellType = src.CellType;
            IsEditable = src.IsEditable;
            IsEditMode = src.IsEditMode;
            EditedCellText = src.EditedCellText;
        }

        public int CellIndex { get; set; }
        public string CellText { get; set; }
        public object CellValue { get; set; }
        public FsEntriesDataGridCellType CellType { get; set; }
        public bool IsEditable { get; set; }
        public bool IsEditMode { get; set; }
        public string EditedCellText { get; set; }

        public TValue GetCellValue<TValue>() => (TValue)CellValue;
    }

    public enum FsEntriesDataGridCellType
    {
        Text = 1,
        Image = 2
    }
}
