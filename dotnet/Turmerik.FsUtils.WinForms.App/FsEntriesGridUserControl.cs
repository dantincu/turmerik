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
using Turmerik.Core.Helpers;
using Turmerik.FsUtils.WinForms.App.Properties;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class FsEntriesGridUserControl : UserControl
    {
        private const int ICON_COLUMN_INDEX = 0;
        private const int NAME_COLUMN_INDEX = 1;
        private const int OPTS_COLUMN_INDEX = 2;

        private readonly Action dataGridViewEndEditAction;

        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryIconClick;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryIconDblClick;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryNameClick;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryNameDblClick;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryOptsClick;

        public FsEntriesGridUserControl()
        {
            InitializeComponent();
            dataGridViewEndEditAction = () => dataGridView.EndEdit();
        }

        public bool IsFoldersGrid { get; private set; }

        public ReadOnlyCollection<IFsEntriesDataGridRow> DataGridValueRows { get; private set; }
        public List<FsEntriesDataGridRowMtbl> EditableDataGridValueRows { get; private set; }

        public int CurrentRowIndex { get; private set; }
        public int CurrentCellIndex { get; private set; }
        public bool IsEditMode { get; private set; }
        public bool IsAddingNewRow { get; private set; }
        public bool CurrentRowIndexOutOfBounds => CurrentRowIndex >= DataGridValueRows.Count;
        public IFsEntriesDataGridRow CurrentRow { get; private set; }
        private FsEntriesDataGridRowMtbl CurrentlyEditedRow { get; set; }
        private FsEntriesDataGridRowMtbl CurrentlyAddedRow { get; set; }

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnFsEntryIconClick
        {
            add
            {
                onFsEntryIconClick += value;
            }

            remove
            {
                onFsEntryIconClick -= value;
            }
        }

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnFsEntryIconDblClick
        {
            add
            {
                onFsEntryIconDblClick += value;
            }

            remove
            {
                onFsEntryIconDblClick -= value;
            }
        }

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnFsEntryNameClick
        {
            add
            {
                onFsEntryNameClick += value;
            }

            remove
            {
                onFsEntryNameClick -= value;
            }
        }

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnFsEntryNameDblClick
        {
            add
            {
                onFsEntryNameDblClick += value;
            }

            remove
            {
                onFsEntryNameDblClick -= value;
            }
        }

        public event Action<KeyValuePair<int, IFsEntriesDataGridRow>> OnFsEntryOptsClick
        {
            add
            {
                onFsEntryOptsClick += value;
            }

            remove
            {
                onFsEntryOptsClick -= value;
            }
        }


        public void SetFsEntries(ICollection<IFsItem> fsEntries)
        {
            dataGridView.Rows.Clear();

            EditableDataGridValueRows = fsEntries.Select(
                GetFsEntriesDataGridRowMtbl).ToList();

            this.DataGridValueRows = EditableDataGridValueRows.Select(
                row => (IFsEntriesDataGridRow) new FsEntriesDataGridRowImmtbl(row)).RdnlC();

            var dataGridRows = EditableDataGridValueRows.Select(
                GetDataGridRow).ToArray();

            dataGridView.Rows.AddRange(dataGridRows);
        }

        public void ClearFsEntries()
        {
            dataGridView.Rows.Clear();
            DataGridValueRows = null;
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

        private DataGridViewRow GetDataGridRow(FsEntriesDataGridRowMtbl dataRow)
        {
            var row = new DataGridViewRow();

            foreach (var dataCell in dataRow.Cells)
            {
                switch (dataCell.CellType)
                {
                    case FsEntriesDataGridCellType.Text:
                        row.AddDataGridTextCell(dataCell.CellText);
                        break;
                    case FsEntriesDataGridCellType.Image:
                        row.AddDataGridImageCell(dataCell.GetCellValue<Bitmap>());
                        break;
                    default:
                        throw new NotSupportedException();
                }
            }

            return row;
        }

        private IFsEntriesDataGridCell GetFsEntriesDataGridCell(
            ref int cellIndex,
            object cellValue,
            string cellText,
            bool isTextCellType = true,
            bool isEditable = false)
        {
            FsEntriesDataGridCellType cellType = FsEntriesDataGridCellType.Text;

            if (!isTextCellType)
            {
                cellType = FsEntriesDataGridCellType.Image;
            }

            var cell = new FsEntriesDataGridCellImmtbl(
                new FsEntriesDataGridCellMtbl
                {
                    CellIndex = cellIndex++,
                    CellText = cellText,
                    CellValue = cellValue,
                    IsEditable = isEditable,
                    EditedCellText = cellText,
                    CellType = cellType
                });

            return cell;
        }

        private FsEntriesDataGridRowMtbl GetFsEntriesDataGridRowMtbl(IFsItem fsItem, int idx)
        {
            string label;
            Bitmap entryIcon;

            if (IsFoldersGrid)
            {
                label = fsItem.Label;
                entryIcon = Resources.folder_icon_16x16;
            }
            else
            {
                label = fsItem.FileNameExtension;
                entryIcon = Resources.file_icon_16x16;
            }

            var optsIcon = Resources.options_icon_16x16;
            int cellIndex = 0;

            var row = new FsEntriesDataGridRowMtbl
            {
                RowIndex = idx,
                Data = fsItem,
                Cells = new IFsEntriesDataGridCell[]
                    {
                        GetFsEntriesDataGridCell(ref cellIndex, entryIcon, null, false),
                        GetFsEntriesDataGridCell(ref cellIndex, fsItem.Name, fsItem.Name, true, true),
                        GetFsEntriesDataGridCell(ref cellIndex, label, label),
                        GetFsEntriesDataGridCell(ref cellIndex, optsIcon, null, false),
                        GetFsEntriesDataGridCell(ref cellIndex, fsItem.CreationTime, fsItem.CreationTimeStr),
                        GetFsEntriesDataGridCell(ref cellIndex, fsItem.LastAccessTime, fsItem.LastAccessTimeStr),
                        GetFsEntriesDataGridCell(ref cellIndex, fsItem.LastWriteTime, fsItem.LastAccessTimeStr),
                    }.RdnlC()
            };

            return row;
        }

        private void BeginAddNewRow()
        {
            IsAddingNewRow = true;

            CurrentlyAddedRow = new FsEntriesDataGridRowMtbl
            {
                IsEdited = true,
                IsNewRow = true
            };

            BeginEdit();
        }

        private void BeginEdit()
        {
            IsEditMode = true;

            if (IsAddingNewRow)
            {
                CurrentlyEditedRow = CurrentlyAddedRow;
            }
            else
            {
                CurrentlyEditedRow = new FsEntriesDataGridRowMtbl(
                    DataGridValueRows[CurrentRowIndex]);
            }

            var cellToEdit = dataGridView.Rows[CurrentRowIndex].Cells[1];
            dataGridView.CurrentCell = cellToEdit;

            dataGridView.BeginEdit(true);
        }

        private void EndEditIfReq(bool checkIfInvokeRequired = false)
        {
            if (IsEditMode)
            {
                EndEdit(checkIfInvokeRequired);
            }
        }

        private void EndEdit(bool checkIfInvokeRequired = false)
        {
            IsEditMode = false;
            IsAddingNewRow = false;

            CurrentlyEditedRow = null;
            CurrentlyAddedRow = null;

            if (checkIfInvokeRequired && dataGridView.InvokeRequired)
            {
                dataGridView.Invoke(dataGridViewEndEditAction);
            }
            else
            {
                dataGridViewEndEditAction();
            }
        }

        private void DataGridView_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            bool currentRowIndexHasChanged = e.RowIndex != CurrentRowIndex;

            CurrentRowIndex = e.RowIndex;
            CurrentCellIndex = e.ColumnIndex;

            if (currentRowIndexHasChanged)
            {
                EndEditIfReq();
            }

            IFsEntriesDataGridRow row;

            if (CurrentRowIndexOutOfBounds)
            {
                BeginAddNewRow();
                row = CurrentlyAddedRow;
            }
            else
            {
                row = DataGridValueRows[e.RowIndex];
            }

            CurrentRow = row;

            switch (e.ColumnIndex)
            {
                case ICON_COLUMN_INDEX:
                    onFsEntryIconClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, row));
                    break;
                case NAME_COLUMN_INDEX:
                    onFsEntryNameClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, row));
                    break;
                case OPTS_COLUMN_INDEX:
                    onFsEntryOptsClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, row));
                    break;
            }
        }

        private void DataGridView_CellDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            var row = CurrentRow;

            switch (e.ColumnIndex)
            {
                case ICON_COLUMN_INDEX:
                    onFsEntryIconDblClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, row));
                    break;
                case NAME_COLUMN_INDEX:
                    BeginEdit();
                    onFsEntryNameDblClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, row));
                    break;
            }
        }

        private void dataGridView_CellValueChanged(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void dataGridView_CurrentCellChanged(object sender, EventArgs e)
        {

        }

        private void dataGridView_UserAddedRow(object sender, DataGridViewRowEventArgs e)
        {

        }

        private void dataGridView_UserDeletedRow(object sender, DataGridViewRowEventArgs e)
        {

        }

        private void dataGridView_UserDeletingRow(object sender, DataGridViewRowCancelEventArgs e)
        {

        }

        private void dataGridView_CellStateChanged(object sender, DataGridViewCellStateChangedEventArgs e)
        {

        }

        private void dataGridView_CellEnter(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void dataGridView_CellLeave(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void dataGridView_EditModeChanged(object sender, EventArgs e)
        {

        }

        private void dataGridView_RowsAdded(object sender, DataGridViewRowsAddedEventArgs e)
        {

        }
    }
}
