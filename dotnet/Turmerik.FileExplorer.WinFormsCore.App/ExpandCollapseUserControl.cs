using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Turmerik.FsUtils.WinForms.App
{
    public partial class ExpandCollapseUserControl : UserControl
    {
        private bool isExpanded;

        private Action<bool> stateChanged;

        public ExpandCollapseUserControl()
        {
            InitializeComponent();
            IsExpanded = false;
        }

        public bool IsExpanded
        {
            get => isExpanded;
            set
            {
                isExpanded = value;
                stateChanged?.Invoke(isExpanded);

                buttonCollapse.Visible = isExpanded;
                buttonExpand.Visible = !isExpanded;
            }
        }

        public event Action<bool> StateChanged
        {
            add
            {
                stateChanged += value;
            }

            remove
            {
                stateChanged -= value;
            }
        }

        private void buttonCollapse_Click(object sender, EventArgs e)
        {
            IsExpanded = false;
        }

        private void buttonExpand_Click(object sender, EventArgs e)
        {
            IsExpanded = true;
        }
    }
}
