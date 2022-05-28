using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Turmerik.FsUtils.WinForms.App.Properties;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class FsEntriesGridUserControl : UserControl
    {
        public FsEntriesGridUserControl()
        {
            InitializeComponent();
        }

        public bool IsFoldersGrid { get; private set; }

        public List<IFsItem> FsEntries { get; private set; }

        public void SetFsEntries(List<IFsItem> fsEntries)
        {
            dataGridView.Rows.Clear();
            FsEntries = fsEntries;

            foreach (var fsEntry in fsEntries)
            {
                var row = GetDataGridRow(fsEntry);
                dataGridView.Rows.Add(row);
            }
        }

        public void ClearFsEntries()
        {
            dataGridView.Rows.Clear();
            FsEntries = null;
        }

        public void SetIsFoldersGrid(bool isFoldersGrid)
        {
            IsFoldersGrid = isFoldersGrid;
            labelControlTitle.Text = isFoldersGrid ? "Folders" : "Files";
        }

        private DataGridViewRow GetDataGridRow(IFsItem fsEntry)
        {
            string label;
            Bitmap entryIcon;

            if (IsFoldersGrid)
            {
                label = fsEntry.Label;
                entryIcon = Resources.folder_icon_16x16;
            }
            else
            {
                label = fsEntry.FileNameExtension;
                entryIcon = Resources.file_icon_16x16;
            }

            var optsIcon = Resources.options_icon_16x16;

            var row = new DataGridViewRow()
                .AddDataGridImageCell(entryIcon)
                .AddDataGridTextCell(fsEntry.Name)
                .AddDataGridTextCell(label)
                .AddDataGridImageCell(optsIcon)
                .AddDataGridTextCell(fsEntry.CreationTimeStr)
                .AddDataGridTextCell(fsEntry.LastAccessTimeStr)
                .AddDataGridTextCell(fsEntry.LastWriteTimeStr);

            return row;
        }
    }
}
