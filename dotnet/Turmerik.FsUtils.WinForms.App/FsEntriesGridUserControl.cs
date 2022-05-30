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
        private const int FS_ENTRIES_DATA_GRID_PAGE_SIZE = 10;
        private const int MAIN_COLOR_COMPONENT = 240;
        private const int SECONDARY_COLOR_COMPONENT = 184;

        private static readonly Color dataGridCellBackColor = Color.White;

        private static readonly Color dataGridCellCurrentBackColor = Color.FromArgb(
            MAIN_COLOR_COMPONENT,
            MAIN_COLOR_COMPONENT,
            SECONDARY_COLOR_COMPONENT);

        private static readonly Color dataGridCellCheckedBackColor = Color.FromArgb(
            SECONDARY_COLOR_COMPONENT,
            SECONDARY_COLOR_COMPONENT,
            MAIN_COLOR_COMPONENT);

        private static readonly Color dataGridCellCheckedCurrentBackColor = Color.FromArgb(
            SECONDARY_COLOR_COMPONENT,
            MAIN_COLOR_COMPONENT,
            SECONDARY_COLOR_COMPONENT);

        private bool isFoldersGrid;

        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onReload;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onGoToRoot;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onGoToParent;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onGoBack;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onGoForward;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryOpen;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryOptsOpen;

        public FsEntriesGridUserControl()
        {
            InitializeComponent();
            labelCheckedEntriesCount.Text = string.Empty;
        }

        private bool IsFoldersGrid { get; set; }
        private Bitmap FsItemIcon { get; set; }
        private string EntryTypeName { get; set; }
        private string labelCheckedEntriesCountTextTpl { get; set; }
        private List<FsEntriesDataGridRowMtbl> EditableDataGridValueRows { get; set; }

        private int CurrentCellIndex { get; set; }
        private FsEntriesGridColumn CurrentCell { get; set; }

        private int CurrentRowIndex { get; set; }
        private FsEntriesDataGridRowMtbl CurrentRow { get; set; }

        private int checkedEntriesCount;

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnReload
        {
            add
            {
                onReload += value;
            }

            remove
            {
                onReload -= value;
            }
        }

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnGoToRoot
        {
            add
            {
                onGoToRoot += value;
            }

            remove
            {
                onGoToRoot -= value;
            }
        }

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

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnGoBack
        {
            add
            {
                onGoBack += value;
            }

            remove
            {
                onGoBack -= value;
            }
        }

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnGoForward
        {
            add
            {
                onGoForward += value;
            }

            remove
            {
                onGoForward -= value;
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

            if (EditableDataGridValueRows.Any())
            {
                SetCurrentRow(0, 0, false);
            }
            else
            {
                ClearCurrentRow(false);
            }
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
                FsItemIcon = Resources.folder_icon_16x16;
                EntryTypeName = "folder";
                
                fsEntriesDataGridLabelColumn.HeaderText = "Description";
            }
            else
            {
                FsItemIcon = Resources.file_icon_16x16;
                EntryTypeName = "file";
                fsEntriesDataGridLabelColumn.HeaderText = "Extension";
            }

            string controlTitle = EntryTypeName.CapitalizeFirstLetter();
            controlTitle = $"{controlTitle}s";

            labelControlTitle.Text = controlTitle;
            labelCheckedEntriesCountTextTpl = $"({{0}} {controlTitle} selected)";
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

            AddFsEntriesGridTextCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.Uuid, fsItem.Uuid.ToString());
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

        private void SetCurrentRow(
            int currentRowIndex,
            int currentCellIndex,
            bool unMarkPrevCurrent = true)
        {
            FsEntriesGridColumn fsEntriesGridColumn = (FsEntriesGridColumn)currentCellIndex;

            var isDifferentRow = SetDataGridRowBackColor(
                CurrentRowIndex,
                () => CurrentRow.IsChecked ? dataGridCellCheckedBackColor : dataGridCellBackColor,
                () => unMarkPrevCurrent && currentRowIndex != CurrentRowIndex);

            CurrentRowIndex = currentRowIndex;
            CurrentRow = EditableDataGridValueRows[currentRowIndex];

            CurrentCellIndex = currentCellIndex;
            CurrentCell = fsEntriesGridColumn;

            SetDataGridRowBackColor(
                currentRowIndex,
                () => CurrentRow.IsChecked ? dataGridCellCheckedCurrentBackColor : dataGridCellCurrentBackColor,
                () => true);
        }

        private void ClearCurrentRow(bool unMarkPrevCurrent = true)
        {
            SetDataGridRowBackColor(
                CurrentRowIndex,
                () => CurrentRow.IsChecked ? dataGridCellCheckedBackColor : dataGridCellBackColor,
                () => unMarkPrevCurrent);

            CurrentRowIndex = 0;
            CurrentRow = null;

            CurrentCellIndex = 0;
            CurrentCell = FsEntriesGridColumn.SelectEntry;
        }

        private bool SetDataGridRowBackColor(
            int rowIndex,
            Func<Color> backColorFunc,
            Func<bool> condition)
        {
            bool retVal = ForEveryDataGridCellInRow(
                rowIndex,
                (cell, idx) => cell.Style.BackColor = backColorFunc(),
                condition);

            return retVal;
        }

        private bool ForEveryDataGridCellInRow(
            int rowIndex,
            Action<DataGridViewCell, int> callback,
            Func<bool> condition)
        {
            bool retVal = condition();

            if (retVal)
            {
                var row = dataGridView.Rows[rowIndex];

                for (int i = 0; i < row.Cells.Count; i++)
                {
                    var cell = row.Cells[i];
                    callback(cell, i);
                }
            }

            return retVal;
        }

        private void SelectDataGridRows(int[] rowIndexesArr, bool? check = null)
        {
            foreach (int rowIndex in rowIndexesArr)
            {
                SelectDataGridRow(rowIndex, check);
            }
        }

        private void SelectDataGridRow(int rowIndex, bool? check = null)
        {
            bool isCurrentRow = rowIndex == CurrentRowIndex;
            var dataRow = EditableDataGridValueRows[rowIndex];

            var row = dataGridView.Rows[rowIndex];
            var cell = row.Cells[(int)FsEntriesGridColumn.SelectEntry];

            if (check.HasValue)
            {
                cell.Value = check.Value;
            }
            else // toggle check
            {
                dataRow.IsChecked = !dataRow.IsChecked;
                cell.Value = dataRow.IsChecked;
            }

            if (isCurrentRow)
            {
                SetDataGridRowBackColor(
                    rowIndex,
                    () => CurrentRow.IsChecked ? dataGridCellCheckedCurrentBackColor : dataGridCellCurrentBackColor,
                    () => true);
            }
            else
            {
                SetDataGridRowBackColor(
                    rowIndex,
                    () => CurrentRow.IsChecked ? dataGridCellCheckedBackColor : dataGridCellBackColor,
                    () => true);
            }

            if (dataRow.IsChecked)
            {
                checkedEntriesCount++;
            }
            else
            {
                checkedEntriesCount--;
            }

            if (checkedEntriesCount == 0)
            {
                labelCheckedEntriesCount.Text = string.Empty;
            }
            else
            {
                labelCheckedEntriesCount.Text = string.Format(
                    labelCheckedEntriesCountTextTpl,
                    checkedEntriesCount);
            }
        }

        private void DataGridView_CellMouseUp(object sender, DataGridViewCellMouseEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                SetCurrentRow(e.RowIndex, e.ColumnIndex);

                if (e.Button == MouseButtons.Left)
                {
                    switch (CurrentCell)
                    {
                        case FsEntriesGridColumn.SelectEntry:
                            SelectDataGridRow(CurrentRowIndex);
                            break;
                        case FsEntriesGridColumn.EntryOpts:
                            onFsEntryOptsOpen?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                                CurrentRowIndex, CurrentRow));
                            break;
                    }
                }
            }
        }

        private void DataGridView_CellDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                SetCurrentRow(e.RowIndex, e.ColumnIndex);

                switch (CurrentCell)
                {
                    case FsEntriesGridColumn.EntryName:
                        onFsEntryOpen?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                            CurrentRowIndex, CurrentRow));
                        break;
                }
            }
        }

        private void DataGridView_KeyUp(object sender, KeyEventArgs e)
        {
            int newRowIndex;

            switch (e.KeyCode)
            {
                case Keys.R:
                    if (e.Control)
                    {
                        onReload?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                            CurrentCellIndex, CurrentRow));
                    }
                    break;

                case Keys.Enter:
                    onFsEntryOpen?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        CurrentCellIndex, CurrentRow));
                    break;

                case Keys.Back:
                    onGoToParent?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        CurrentCellIndex, CurrentRow));
                    break;

                case Keys.Space:
                    SelectDataGridRow(CurrentRowIndex);
                    break;

                case Keys.Up:
                    if (CurrentRowIndex > 0)
                    {
                        SetCurrentRow(CurrentRowIndex - 1, CurrentCellIndex);
                    }
                    break;

                case Keys.Down:
                    if (CurrentRowIndex < EditableDataGridValueRows.Count - 1)
                    {
                        SetCurrentRow(CurrentRowIndex + 1, CurrentCellIndex);
                    }
                    break;

                case Keys.Home:
                    if (e.Control)
                    {
                        onGoToRoot?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                            CurrentRowIndex, CurrentRow));
                    }
                    else
                    {
                        SetCurrentRow(0, CurrentCellIndex);
                    }
                    break;

                case Keys.End:
                    SetCurrentRow(EditableDataGridValueRows.Count - 1, CurrentCellIndex);
                    break;

                case Keys.PageDown:
                    newRowIndex = Math.Max(0, CurrentRowIndex - FS_ENTRIES_DATA_GRID_PAGE_SIZE);
                    SetCurrentRow(newRowIndex, CurrentCellIndex);
                    break;

                case Keys.PageUp:
                    newRowIndex = Math.Min(EditableDataGridValueRows.Count - 1, CurrentRowIndex + FS_ENTRIES_DATA_GRID_PAGE_SIZE);
                    SetCurrentRow(newRowIndex, CurrentCellIndex);
                    break;

                case Keys.OemMinus:
                    if (e.Control)
                    {
                        onGoBack?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                            CurrentCellIndex, CurrentRow));
                    }
                    break;

                case Keys.Oemplus:
                    if (e.Control)
                    {
                        onGoForward?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                            CurrentCellIndex, CurrentRow));
                    }
                    break;
            }
        }

        private void dataGridView_Sorted(object sender, EventArgs e)
        {
            var dataGridValueRows = new List<FsEntriesDataGridRowMtbl>();

            foreach (DataGridViewRow row in dataGridView.Rows)
            {
                var uuidCell = row.Cells[(int)FsEntriesGridColumn.Uuid];
                Guid uuid = Guid.Parse((string)uuidCell.Value);

                var dataRow = EditableDataGridValueRows.Single(
                    entry => entry.Data.Uuid == uuid);

                dataGridValueRows.Add(dataRow);
            }

            EditableDataGridValueRows = dataGridValueRows;
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
