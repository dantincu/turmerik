using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.FsUtils.WinForms.App
{
    public interface IFsEntriesDataGridRow
    {
        IFsItem Data { get; }
        int RowIndex { get; }
        ReadOnlyCollection<IFsEntriesDataGridCell> Cells { get; }
        bool IsEdited { get; }
        bool IsNewRow { get; }
    }

    public class FsEntriesDataGridRowImmtbl : IFsEntriesDataGridRow
    {
        public FsEntriesDataGridRowImmtbl(IFsEntriesDataGridRow src)
        {
            Data = src.Data;
            RowIndex = src.RowIndex;
            Cells = src.Cells;
            IsEdited = src.IsEdited;
            IsNewRow = src.IsNewRow;
        }

        public IFsItem Data { get; }
        public int RowIndex { get; }
        public ReadOnlyCollection<IFsEntriesDataGridCell> Cells { get; }
        public bool IsEdited { get; }
        public bool IsNewRow { get; }
    }

    public class FsEntriesDataGridRowMtbl : IFsEntriesDataGridRow
    {
        public FsEntriesDataGridRowMtbl()
        {
        }

        public FsEntriesDataGridRowMtbl(IFsEntriesDataGridRow src)
        {
            Data = src.Data;
            RowIndex = src.RowIndex;
            Cells = src.Cells;
            IsEdited = src.IsEdited;
            IsNewRow = src.IsNewRow;
        }

        public IFsItem Data { get; set; }
        public int RowIndex { get; set; }
        public ReadOnlyCollection<IFsEntriesDataGridCell> Cells { get; set; }
        public bool IsEdited { get; set; }
        public bool IsNewRow { get; set; }
    }
}
