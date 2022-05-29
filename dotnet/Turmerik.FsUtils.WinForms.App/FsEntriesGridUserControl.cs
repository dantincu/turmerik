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
        private readonly ILambdaExprHelperFactory lambdaExprHelperFactory;
        private readonly ILambdaExprHelper<IFsEntriesDataGridRow> fsEntriesDataGridRowLambdaExprHelper;
        private readonly ILambdaExprHelper<FsItemMtbl> fsItemMtblLambdaExprHelper;

        private readonly Action dataGridViewEndEditAction;

        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryIconClick;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryIconDblClick;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryNameClick;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryNameDblClick;
        private Action<KeyValuePair<int, IFsEntriesDataGridRow>> onFsEntryOptsClick;

        public FsEntriesGridUserControl()
        {
            lambdaExprHelperFactory = ServiceProviderContainer.Instance.Value.Services.GetRequiredService<ILambdaExprHelperFactory>();
            fsEntriesDataGridRowLambdaExprHelper = lambdaExprHelperFactory.GetHelper<IFsEntriesDataGridRow>();
            fsItemMtblLambdaExprHelper = lambdaExprHelperFactory.GetHelper<FsItemMtbl>();

            InitializeComponent();
            dataGridViewEndEditAction = () => dataGridView.EndEdit();
        }

        public bool IsFoldersGrid { get; private set; }

        public ReadOnlyList<IFsEntriesDataGridRow> DataGridValueRows { get; private set; }
        public List<IFsEntriesDataGridRow> EditableDataGridValueRows { get; private set; }

        public int CurrentRowIndex { get; private set; }
        public int CurrentCellIndex { get; private set; }
        public FsEntriesGridColumn CurrentCell { get; private set; }

        public IFsEntriesDataGridRow CurrentRow { get; private set; }

        private Bitmap FsItemIcon => IsFoldersGrid ? Resources.folder_icon_16x16 : Resources.file_icon_16x16;

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
            CurrentRowIndex = e.RowIndex;
            CurrentCellIndex = e.ColumnIndex;

            CurrentCell = (FsEntriesGridColumn)e.ColumnIndex;
            CurrentRow = DataGridValueRows[CurrentRowIndex];

            switch (CurrentCell)
            {
                case FsEntriesGridColumn.Icon:
                    onFsEntryIconClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, CurrentRow));
                    break;
                case FsEntriesGridColumn.Name:
                    onFsEntryNameClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, CurrentRow));
                    break;
                case FsEntriesGridColumn.Opts:
                    onFsEntryOptsClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, CurrentRow));
                    break;
            }
        }

        private void DataGridView_CellDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            switch (CurrentCell)
            {
                case FsEntriesGridColumn.Icon:
                    onFsEntryIconDblClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, CurrentRow));
                    break;
                case FsEntriesGridColumn.Name:
                    onFsEntryNameDblClick?.Invoke(new KeyValuePair<int, IFsEntriesDataGridRow>(
                        e.RowIndex, CurrentRow));
                    break;
            }
        }
    }
}
