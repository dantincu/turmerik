namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class FetchMultipleLinksMainUC
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            DataGridViewCellStyle dataGridViewCellStyle1 = new DataGridViewCellStyle();
            DataGridViewCellStyle dataGridViewCellStyle2 = new DataGridViewCellStyle();
            splitContainerMain = new SplitContainer();
            dataGridViewItemsList = new DataGridView();
            dataGridViewItemsListColumnItemText = new DataGridViewTextBoxColumn();
            panelMainSplitContainerTopControls = new Panel();
            buttonPrevItem = new Button();
            buttonNextItem = new Button();
            buttonReloadCurrentItem = new Button();
            buttonRefreshCurrentItem = new Button();
            buttonResetItemsList = new Button();
            buttonReloadItemsList = new Button();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)dataGridViewItemsList).BeginInit();
            panelMainSplitContainerTopControls.SuspendLayout();
            SuspendLayout();
            // 
            // splitContainerMain
            // 
            splitContainerMain.Dock = DockStyle.Fill;
            splitContainerMain.Location = new Point(0, 0);
            splitContainerMain.Name = "splitContainerMain";
            // 
            // splitContainerMain.Panel1
            // 
            splitContainerMain.Panel1.Controls.Add(dataGridViewItemsList);
            splitContainerMain.Panel1.Controls.Add(panelMainSplitContainerTopControls);
            splitContainerMain.Size = new Size(1600, 800);
            splitContainerMain.SplitterDistance = 617;
            splitContainerMain.TabIndex = 0;
            splitContainerMain.SplitterMoved += SplitContainerMain_SplitterMoved;
            splitContainerMain.SplitterMoving += SplitContainerMain_SplitterMoving;
            // 
            // dataGridViewItemsList
            // 
            dataGridViewItemsList.AllowUserToAddRows = false;
            dataGridViewItemsList.AllowUserToDeleteRows = false;
            dataGridViewItemsList.AllowUserToResizeColumns = false;
            dataGridViewItemsList.AllowUserToResizeRows = false;
            dataGridViewCellStyle1.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = SystemColors.Control;
            dataGridViewCellStyle1.Font = new Font("Segoe UI", 9F);
            dataGridViewCellStyle1.ForeColor = SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = SystemColors.Window;
            dataGridViewCellStyle1.SelectionForeColor = SystemColors.ControlText;
            dataGridViewCellStyle1.WrapMode = DataGridViewTriState.True;
            dataGridViewItemsList.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            dataGridViewItemsList.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            dataGridViewItemsList.Columns.AddRange(new DataGridViewColumn[] { dataGridViewItemsListColumnItemText });
            dataGridViewCellStyle2.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = SystemColors.Window;
            dataGridViewCellStyle2.Font = new Font("Segoe UI", 10F);
            dataGridViewCellStyle2.ForeColor = SystemColors.ControlText;
            dataGridViewCellStyle2.SelectionBackColor = SystemColors.Window;
            dataGridViewCellStyle2.SelectionForeColor = SystemColors.ControlText;
            dataGridViewCellStyle2.WrapMode = DataGridViewTriState.False;
            dataGridViewItemsList.DefaultCellStyle = dataGridViewCellStyle2;
            dataGridViewItemsList.Dock = DockStyle.Fill;
            dataGridViewItemsList.Location = new Point(0, 30);
            dataGridViewItemsList.Name = "dataGridViewItemsList";
            dataGridViewItemsList.ReadOnly = true;
            dataGridViewItemsList.RowHeadersVisible = false;
            dataGridViewItemsList.RowHeadersWidth = 4;
            dataGridViewItemsList.RowHeadersWidthSizeMode = DataGridViewRowHeadersWidthSizeMode.DisableResizing;
            dataGridViewItemsList.Size = new Size(617, 770);
            dataGridViewItemsList.TabIndex = 1;
            dataGridViewItemsList.CellMouseClick += DataGridViewItemsList_CellMouseClick;
            // 
            // dataGridViewItemsListColumnItemText
            // 
            dataGridViewItemsListColumnItemText.AutoSizeMode = DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewItemsListColumnItemText.HeaderText = "Item";
            dataGridViewItemsListColumnItemText.Name = "dataGridViewItemsListColumnItemText";
            dataGridViewItemsListColumnItemText.ReadOnly = true;
            dataGridViewItemsListColumnItemText.SortMode = DataGridViewColumnSortMode.NotSortable;
            // 
            // panelMainSplitContainerTopControls
            // 
            panelMainSplitContainerTopControls.Controls.Add(buttonPrevItem);
            panelMainSplitContainerTopControls.Controls.Add(buttonNextItem);
            panelMainSplitContainerTopControls.Controls.Add(buttonReloadCurrentItem);
            panelMainSplitContainerTopControls.Controls.Add(buttonRefreshCurrentItem);
            panelMainSplitContainerTopControls.Controls.Add(buttonResetItemsList);
            panelMainSplitContainerTopControls.Controls.Add(buttonReloadItemsList);
            panelMainSplitContainerTopControls.Dock = DockStyle.Top;
            panelMainSplitContainerTopControls.Location = new Point(0, 0);
            panelMainSplitContainerTopControls.Name = "panelMainSplitContainerTopControls";
            panelMainSplitContainerTopControls.Size = new Size(617, 30);
            panelMainSplitContainerTopControls.TabIndex = 0;
            // 
            // buttonPrevItem
            // 
            buttonPrevItem.Dock = DockStyle.Right;
            buttonPrevItem.Location = new Point(186, 0);
            buttonPrevItem.Name = "buttonPrevItem";
            buttonPrevItem.Size = new Size(55, 30);
            buttonPrevItem.TabIndex = 3;
            buttonPrevItem.Text = "&Prev";
            buttonPrevItem.UseVisualStyleBackColor = true;
            buttonPrevItem.Click += ButtonPrevItem_Click;
            // 
            // buttonNextItem
            // 
            buttonNextItem.Dock = DockStyle.Right;
            buttonNextItem.Location = new Point(241, 0);
            buttonNextItem.Name = "buttonNextItem";
            buttonNextItem.Size = new Size(64, 30);
            buttonNextItem.TabIndex = 2;
            buttonNextItem.Text = "&Next";
            buttonNextItem.UseVisualStyleBackColor = true;
            buttonNextItem.Click += ButtonNextItem_Click;
            // 
            // buttonReloadCurrentItem
            // 
            buttonReloadCurrentItem.Dock = DockStyle.Right;
            buttonReloadCurrentItem.Location = new Point(305, 0);
            buttonReloadCurrentItem.Name = "buttonReloadCurrentItem";
            buttonReloadCurrentItem.Size = new Size(159, 30);
            buttonReloadCurrentItem.TabIndex = 5;
            buttonReloadCurrentItem.Text = "&Reload Current";
            buttonReloadCurrentItem.UseVisualStyleBackColor = true;
            buttonReloadCurrentItem.Click += ButtonReloadCurrentItem_Click;
            // 
            // buttonRefreshCurrentItem
            // 
            buttonRefreshCurrentItem.Dock = DockStyle.Right;
            buttonRefreshCurrentItem.Location = new Point(464, 0);
            buttonRefreshCurrentItem.Name = "buttonRefreshCurrentItem";
            buttonRefreshCurrentItem.Size = new Size(153, 30);
            buttonRefreshCurrentItem.TabIndex = 4;
            buttonRefreshCurrentItem.Text = "Refres&h Current";
            buttonRefreshCurrentItem.UseVisualStyleBackColor = true;
            buttonRefreshCurrentItem.Click += ButtonRefreshCurrentItem_Click;
            // 
            // buttonResetItemsList
            // 
            buttonResetItemsList.Dock = DockStyle.Left;
            buttonResetItemsList.Location = new Point(69, 0);
            buttonResetItemsList.Name = "buttonResetItemsList";
            buttonResetItemsList.Size = new Size(75, 30);
            buttonResetItemsList.TabIndex = 1;
            buttonResetItemsList.Text = "Rese&t";
            buttonResetItemsList.UseVisualStyleBackColor = true;
            buttonResetItemsList.Click += ButtonResetItemsList_Click;
            // 
            // buttonReloadItemsList
            // 
            buttonReloadItemsList.Dock = DockStyle.Left;
            buttonReloadItemsList.Location = new Point(0, 0);
            buttonReloadItemsList.Name = "buttonReloadItemsList";
            buttonReloadItemsList.Size = new Size(69, 30);
            buttonReloadItemsList.TabIndex = 0;
            buttonReloadItemsList.Text = "Re&load";
            buttonReloadItemsList.UseVisualStyleBackColor = true;
            buttonReloadItemsList.Click += ButtonReloadItemsList_Click;
            // 
            // FetchMultipleLinksMainUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "FetchMultipleLinksMainUC";
            Size = new Size(1600, 800);
            Load += FetchMultipleLinksMainUC_Load;
            splitContainerMain.Panel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)dataGridViewItemsList).EndInit();
            panelMainSplitContainerTopControls.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private SplitContainer splitContainerMain;
        private Panel panelMainSplitContainerTopControls;
        private Button buttonReloadItemsList;
        private DataGridView dataGridViewItemsList;
        private Button buttonResetItemsList;
        private Button buttonNextItem;
        private Button buttonPrevItem;
        private DataGridViewTextBoxColumn dataGridViewItemsListColumnItemText;
        private Button buttonRefreshCurrentItem;
        private Button buttonReloadCurrentItem;
    }
}
