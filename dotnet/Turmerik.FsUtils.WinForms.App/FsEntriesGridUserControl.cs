using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.Core.Components;
using Turmerik.Core.Data;
using Turmerik.Core.Helpers;
using Turmerik.FsUtils.WinForms.App.Properties;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class FsEntriesGridUserControl : UserControl
    {
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onGoToParent;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryOpen;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryOptsOpen;

        public FsEntriesGridUserControl()
        {
            InitializeComponent();
        }

        private bool IsFoldersGrid { get; set; }
        private Bitmap FsItemIcon => IsFoldersGrid ? Resources.folder_icon_16x16 : Resources.file_icon_16x16;
        private List<FsEntriesDataGridRowMtbl> EditableDataGridValueRows { get; set; }

        private int CurrentCellIndex { get; set; }
        private FsEntriesGridColumn CurrentCell { get; set; }

        private int CurrentRowIndex { get; set; }
        private FsEntriesDataGridRowMtbl CurrentRow { get; set; }
        
        private int NavigationRowIndex { get; set; }
        private FsEntriesDataGridRowMtbl NavigationRow { get; set; }
        
        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnGoToParent
        {
            add
            {
                onGoToParent += value;
            }

            remove
            {
                onGoToParent -= value;
            }
        }

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnFsEntryOpen
        {
            add
            {
                onFsEntryOpen += value;
            }

            remove
            {
                onFsEntryOpen -= value;
            }
        }

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnFsEntryOptsOpen
        {
            add
            {
                onFsEntryOptsOpen += value;
            }

            remove
            {
                onFsEntryOptsOpen -= value;
            }
        }

        public void SetFsEntries(ICollection<IFsItem> fsEntries)
        {
            dataGridView.Rows.Clear();

            EditableDataGridValueRows = fsEntries.Select(
                GetFsEntriesDataGridRowMtbl).ToList();

            var dataGridViewRows = EditableDataGridValueRows.Select(
                GetDataGridViewRow).ToArray();

            dataGridView.Rows.AddRange(dataGridViewRows);
        }

        public void ClearFsEntries()
        {
            dataGridView.Rows.Clear();
            EditableDataGridValueRows = null;
        }

        public void SetIsFoldersGrid(bool isFoldersGrid)
        {
            IsFoldersGrid = isFoldersGrid;

            if (isFoldersGrid)
            {
                labelControlTitle.Text = "Folders";
                fsEntriesDataGridLabelColumn.HeaderText = "Description";
            }
            else
            {
                labelControlTitle.Text = "Files";
                fsEntriesDataGridLabelColumn.HeaderText = "Extension";
            }
        }

        private FsEntriesDataGridRowMtbl GetFsEntriesDataGridRowMtbl(IFsItem fsItem, int idx)
        {
            var rowMtbl = new FsEntriesDataGridRowMtbl
            {
                Data = fsItem,
                RowIndex = idx
            };

            return rowMtbl;
        }

        private DataGridViewRow GetDataGridViewRow(IFsEntriesDataGridRow dataRow, int idx)
        {
            var rowCellsDictnr = GetFsEntriesGridCellsDictnr(dataRow);
            var row = GetDataGridViewRow(rowCellsDictnr);

            return row;
        }

        private Dictionary<FsEntriesGridColumn, DataGridViewCell> GetFsEntriesGridCellsDictnr(IFsEntriesDataGridRow dataRow)
        {
            var fsItem = dataRow.Data;
            var optsIcon = Resources.options_icon_16x16;

            var rowCellsDictnr = new Dictionary<FsEntriesGridColumn, DataGridViewCell>();

            AddFsEntriesGridCheckBoxCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.SelectEntry, false);
            AddFsEntriesGridImageCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.EntryIcon, FsItemIcon);

            AddFsEntriesGridTextCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.EntryName, fsItem.Name);
            AddFsEntriesGridTextCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.EntryLabel, fsItem.Label);

            AddFsEntriesGridImageCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.EntryOpts, optsIcon);
            AddFsEntriesGridTextCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.CreationTime, fsItem.CreationTimeStr);

            AddFsEntriesGridTextCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.LastAccessTime, fsItem.LastAccessTimeStr);
            AddFsEntriesGridTextCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.LastWriteTime, fsItem.LastWriteTimeStr);

            return rowCellsDictnr;
        }

        private void AddFsEntriesGridTextCellToDictnr(
            Dictionary<FsEntriesGridColumn, DataGridViewCell> rowCellsDictnr,
            FsEntriesGridColumn fsEntriesGridColumn,
            string cellText)
        {
            var cell = new DataGridViewTextBoxCell();
            cell.Value = cellText;

            rowCellsDictnr.Add(fsEntriesGridColumn, cell);
        }

        private void AddFsEntriesGridImageCellToDictnr(
            Dictionary<FsEntriesGridColumn, DataGridViewCell> rowCellsDictnr,
            FsEntriesGridColumn fsEntriesGridColumn,
            Bitmap cellImage)
        {
            var cell = new DataGridViewImageCell();
            cell.Value = cellImage;

            rowCellsDictnr.Add(fsEntriesGridColumn, cell);
        }

        private void AddFsEntriesGridCheckBoxCellToDictnr(
            Dictionary<FsEntriesGridColumn, DataGridViewCell> rowCellsDictnr,
            FsEntriesGridColumn fsEntriesGridColumn,
            bool isChecked)
        {
            var cell = new DataGridViewCheckBoxCell();
            cell.Value = isChecked;

            rowCellsDictnr.Add(fsEntriesGridColumn, cell);
        }

        private DataGridViewRow GetDataGridViewRow(Dictionary<FsEntriesGridColumn, DataGridViewCell> rowCellsDictnr)
        {
            var rowCellsArr = rowCellsDictnr.OrderBy(
                x => x.Key).Select(kvp => kvp.Value).ToArray();

            var row = new DataGridViewRow();
            row.Cells.AddRange(rowCellsArr);

            return row;
        }

        private void SetNavigationRow(int navigationRowIndex)
        {
            dataGridView.Rows[NavigationRowIndex].Cells[(int)FsEntriesGridColumn.EntryName].Style.BackColor = Color.White;

            NavigationRowIndex = navigationRowIndex;
            NavigationRow = EditableDataGridValueRows[navigationRowIndex];

            dataGridView.Rows[navigationRowIndex].Cells[(int)FsEntriesGridColumn.EntryName].Style.BackColor = Color.AntiqueWhite;
        }

        private void SetCurrentRow(
            int currentRowIndex,
            int currentCellIndex)
        {
            FsEntriesGridColumn fsEntriesGridColumn = (FsEntriesGridColumn)currentCellIndex;

            CurrentRowIndex = currentRowIndex;
            CurrentRow = EditableDataGridValueRows[currentRowIndex];

            CurrentCellIndex = currentCellIndex;
            CurrentCell = fsEntriesGridColumn;
        }

        private void DataGridView_CellMouseDown(object sender, DataGridViewCellMouseEventArgs e)
        {
            SetNavigationRow(e.RowIndex);

            switch (CurrentCell)
            {
                case FsEntriesGridColumn.SelectEntry:
                    break;
                case FsEntriesGridColumn.EntryOpts:
                    onFsEntryOptsOpen?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        CurrentRowIndex, CurrentRow));
                    break;
            }
        }

        private void DataGridView_CellMouseUp(object sender, DataGridViewCellMouseEventArgs e)
        {
            if (NavigationRowIndex == CurrentCellIndex)
            {
                dataGridView.Rows[NavigationRowIndex].Cells[(int)FsEntriesGridColumn.EntryName].Style.BackColor = Color.AntiqueWhite;
            }
        }

        private void DataGridView_CellDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            switch (CurrentCell)
            {
                case FsEntriesGridColumn.EntryName:
                    onFsEntryOpen?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        CurrentRowIndex, CurrentRow));
                    break;
            }
        }

        private void DataGridView_KeyUp(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode)
            {
                case Keys.Enter:
                    onFsEntryOpen?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        NavigationRowIndex, NavigationRow));
                    break;
                case Keys.Back:
                    onGoToParent?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        NavigationRowIndex, NavigationRow));
                    break;
            }
        }

        private void DataGridView_CellEnter(object sender, DataGridViewCellEventArgs e)
        {
            SetCurrentRow(e.RowIndex, e.ColumnIndex);
        }

        private void DataGridView_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode)
            {
                case Keys.Enter:
                case Keys.Back:
                    SetNavigationRow(CurrentRowIndex);
                    break;
            }
        }

        private void DataGridView_DataError(object sender, DataGridViewDataErrorEventArgs e)
        {
            var exc = e.Exception;

            string exceptionStr = string.Join(
                Environment.NewLine,
                $"EXCEPTION TYPE: {exc.GetType().FullName}",
                $"EXCEPTION MESSAGE: {exc.Message}");

            string message = string.Join(
                Environment.NewLine,
                "A critical error related to the FS entries data grids has ocurred and the application needs to exit:",
                string.Empty,
                exceptionStr);

            MessageBox.Show(
                message,
                "Critical error",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);

            Application.Exit();
        }
    }
}
