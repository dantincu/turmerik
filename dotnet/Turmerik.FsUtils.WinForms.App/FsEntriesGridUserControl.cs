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

        public bool IsFoldersGrid { get; private set; }

        public ReadOnlyList<IFsEntriesDataGridRow> DataGridValueRows { get; private set; }
        public List<IFsEntriesDataGridRow> EditableDataGridValueRows { get; private set; }

        public int CurrentRowIndex { get; private set; }
        public int CurrentCellIndex { get; private set; }
        public FsEntriesGridColumn CurrentCell { get; private set; }

        public IFsEntriesDataGridRow CurrentRow { get; private set; }

        public int NavigationRowIndex { get; private set; }
        public IFsEntriesDataGridRow NavigationRow { get; private set; }

        private Bitmap FsItemIcon => IsFoldersGrid ? Resources.folder_icon_16x16 : Resources.file_icon_16x16;

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
                GetFsEntriesDataGridRow).ToList();

            this.DataGridValueRows = new ReadOnlyList<IFsEntriesDataGridRow>(
                EditableDataGridValueRows);

            var dataGridViewRows = EditableDataGridValueRows.Select(
                GetDataGridViewRow).ToArray();

            dataGridView.Rows.AddRange(dataGridViewRows);
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

        private IFsEntriesDataGridRow GetFsEntriesDataGridRow(IFsItem fsItem, int idx)
        {
            var row = new FsEntriesDataGridRowMtbl
            {
                Data = fsItem,
                DataMtbl = new FsItemMtbl(fsItem),
                RowIndex = idx
            };

            return row;
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
            AddFsEntriesGridCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.Icon, FsItemIcon, null);

            AddFsEntriesGridCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.Name, null, fsItem.Name);
            AddFsEntriesGridCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.Label, null, fsItem.Label);

            AddFsEntriesGridCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.Opts, optsIcon, null);
            AddFsEntriesGridCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.CreationTime, null, fsItem.CreationTimeStr);

            AddFsEntriesGridCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.LastAccessTime, null, fsItem.LastAccessTimeStr);
            AddFsEntriesGridCellToDictnr(rowCellsDictnr, FsEntriesGridColumn.LastWriteTime, null, fsItem.LastWriteTimeStr);

            return rowCellsDictnr;
        }

        private void AddFsEntriesGridCellToDictnr(
            Dictionary<FsEntriesGridColumn, DataGridViewCell>
            rowCellsDictnr,
            FsEntriesGridColumn fsEntriesGridColumn,
            Bitmap cellImage,
            string cellText)
        {
            DataGridViewCell cell;

            if (cellImage != null)
            {
                cell = new DataGridViewImageCell();
                cell.Value = cellImage;
            }
            else
            {
                cell = new DataGridViewTextBoxCell();
                cell.Value = cellText;
            }

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

        private void DataGridView_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            switch (CurrentCell)
            {
                case FsEntriesGridColumn.Opts:
                    onFsEntryOptsOpen?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        CurrentRowIndex, CurrentRow));
                    break;
            }
        }

        private void DataGridView_CellDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            switch (CurrentCell)
            {
                case FsEntriesGridColumn.Name:
                    onFsEntryOpen?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        CurrentRowIndex, CurrentRow));
                    break;
            }
        }

        private void dataGridView_KeyUp(object sender, KeyEventArgs e)
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

        private void dataGridView_RowEnter(object sender, DataGridViewCellEventArgs e)
        {
            CurrentRowIndex = e.RowIndex;
            CurrentCellIndex = e.ColumnIndex;

            CurrentCell = (FsEntriesGridColumn)e.ColumnIndex;
            CurrentRow = DataGridValueRows[CurrentRowIndex];
        }

        private void dataGridView_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode)
            {
                case Keys.Enter:
                case Keys.Back:
                    NavigationRowIndex = CurrentRowIndex;
                    NavigationRow = DataGridValueRows[NavigationRowIndex];
                    break;
            }
        }
    }
}
