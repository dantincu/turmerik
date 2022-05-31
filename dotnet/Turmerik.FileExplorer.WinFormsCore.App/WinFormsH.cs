using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Turmerik.FileExplorer.WinFormsCore.App
{
    public static class WinFormsH
    {
        public static DataGridViewRow AddDataGridTextCell(
            this DataGridViewRow row,
            string cellText)
        {
            var cell = new DataGridViewTextBoxCell();
            cell.Value = cellText;

            row.Cells.Add(cell);
            return row;
        }

        public static DataGridViewRow AddDataGridImageCell(this DataGridViewRow row, Image cellImage)
        {
            var cell = new DataGridViewImageCell();
            cell.Value = cellImage;

            row.Cells.Add(cell);
            return row;
        }
    }
}
