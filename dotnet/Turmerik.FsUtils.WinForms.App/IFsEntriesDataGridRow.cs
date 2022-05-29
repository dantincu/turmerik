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
        FsItemMtbl DataMtbl { get; }
        int RowIndex { get; }
        bool IsEdited { get; }
        bool IsNewRow { get; }
    }

    public class FsEntriesDataGridRowImmtbl : IFsEntriesDataGridRow
    {
        public FsEntriesDataGridRowImmtbl(IFsEntriesDataGridRow src)
        {
            Data = src.Data;
            DataMtbl = src.DataMtbl;
            RowIndex = src.RowIndex;
            IsEdited = src.IsEdited;
            IsNewRow = src.IsNewRow;
        }

        public IFsItem Data { get; }
        public FsItemMtbl DataMtbl { get; }
        public int RowIndex { get; }
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
            DataMtbl = src.DataMtbl;
            RowIndex = src.RowIndex;
            IsEdited = src.IsEdited;
            IsNewRow = src.IsNewRow;
        }

        public IFsItem Data { get; set; }
        public FsItemMtbl DataMtbl { get; set; }
        public int RowIndex { get; set; }
        public bool IsEdited { get; set; }
        public bool IsNewRow { get; set; }
    }
}
