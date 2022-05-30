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
        bool IsChecked { get; }
    }

    public class FsEntriesDataGridRowImmtbl : IFsEntriesDataGridRow
    {
        public FsEntriesDataGridRowImmtbl(IFsEntriesDataGridRow src)
        {
            Data = src.Data;
            RowIndex = src.RowIndex;
            IsChecked = src.IsChecked;
        }

        public IFsItem Data { get; }
        public int RowIndex { get; }
        public bool IsChecked { get; }
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
            IsChecked = src.IsChecked;
        }

        public IFsItem Data { get; set; }
        public int RowIndex { get; set; }
        public bool IsChecked { get; set; }
    }
}
