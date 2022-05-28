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
            FsEntries = fsEntries;
        }

        public void SetIsFoldersGrid(bool isFoldersGrid)
        {
            IsFoldersGrid = isFoldersGrid;
            labelControlTitle.Text = isFoldersGrid ? "Folders" : "Files";
        }
    }
}
