namespace Turmerik.FsUtils.WinForms.App
{
    partial class FsEntriesGridUserControl
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
            this.topPanel = new System.Windows.Forms.Panel();
            this.labelControlTitle = new System.Windows.Forms.Label();
            this.dataGridView = new System.Windows.Forms.DataGridView();
            this.fsEntriesDataGridIconColumn = new System.Windows.Forms.DataGridViewImageColumn();
            this.fsEntriesDataGridNameColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesDataGridLabelColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesGridOptsColumn = new System.Windows.Forms.DataGridViewImageColumn();
            this.fsEntriesGridCreationTimeColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesDataGridLastAccessColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesDataGridLastWriteColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.topPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView)).BeginInit();
            this.SuspendLayout();
            // 
            // topPanel
            // 
            this.topPanel.Controls.Add(this.labelControlTitle);
            this.topPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topPanel.Location = new System.Drawing.Point(0, 0);
            this.topPanel.Name = "topPanel";
            this.topPanel.Size = new System.Drawing.Size(1064, 27);
            this.topPanel.TabIndex = 0;
            // 
            // labelControlTitle
            // 
            this.labelControlTitle.AutoSize = true;
            this.labelControlTitle.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.labelControlTitle.Location = new System.Drawing.Point(4, 4);
            this.labelControlTitle.Name = "labelControlTitle";
            this.labelControlTitle.Size = new System.Drawing.Size(52, 15);
            this.labelControlTitle.TabIndex = 0;
            this.labelControlTitle.Text = "Entries";
            // 
            // dataGridView
            // 
            this.dataGridView.AllowUserToAddRows = false;
            this.dataGridView.AllowUserToDeleteRows = false;
            this.dataGridView.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.AllCells;
            this.dataGridView.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.fsEntriesDataGridIconColumn,
            this.fsEntriesDataGridNameColumn,
            this.fsEntriesDataGridLabelColumn,
            this.fsEntriesGridOptsColumn,
            this.fsEntriesGridCreationTimeColumn,
            this.fsEntriesDataGridLastAccessColumn,
            this.fsEntriesDataGridLastWriteColumn});
            this.dataGridView.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dataGridView.EditMode = System.Windows.Forms.DataGridViewEditMode.EditProgrammatically;
            this.dataGridView.Location = new System.Drawing.Point(0, 27);
            this.dataGridView.Name = "dataGridView";
            this.dataGridView.ReadOnly = true;
            this.dataGridView.RowHeadersVisible = false;
            this.dataGridView.Size = new System.Drawing.Size(1064, 584);
            this.dataGridView.TabIndex = 1;
            this.dataGridView.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.DataGridView_CellClick);
            this.dataGridView.CellDoubleClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.DataGridView_CellDoubleClick);
            // 
            // fsEntriesDataGridIconColumn
            // 
            this.fsEntriesDataGridIconColumn.HeaderText = "";
            this.fsEntriesDataGridIconColumn.Name = "fsEntriesDataGridIconColumn";
            this.fsEntriesDataGridIconColumn.ReadOnly = true;
            this.fsEntriesDataGridIconColumn.Width = 30;
            // 
            // fsEntriesDataGridNameColumn
            // 
            this.fsEntriesDataGridNameColumn.HeaderText = "Name";
            this.fsEntriesDataGridNameColumn.Name = "fsEntriesDataGridNameColumn";
            this.fsEntriesDataGridNameColumn.ReadOnly = true;
            this.fsEntriesDataGridNameColumn.Width = 600;
            // 
            // fsEntriesDataGridLabelColumn
            // 
            this.fsEntriesDataGridLabelColumn.HeaderText = "Label or file ext";
            this.fsEntriesDataGridLabelColumn.Name = "fsEntriesDataGridLabelColumn";
            this.fsEntriesDataGridLabelColumn.ReadOnly = true;
            // 
            // fsEntriesGridOptsColumn
            // 
            this.fsEntriesGridOptsColumn.HeaderText = "";
            this.fsEntriesGridOptsColumn.Name = "fsEntriesGridOptsColumn";
            this.fsEntriesGridOptsColumn.ReadOnly = true;
            this.fsEntriesGridOptsColumn.Width = 30;
            // 
            // fsEntriesGridCreationTimeColumn
            // 
            this.fsEntriesGridCreationTimeColumn.HeaderText = "Creation";
            this.fsEntriesGridCreationTimeColumn.Name = "fsEntriesGridCreationTimeColumn";
            this.fsEntriesGridCreationTimeColumn.ReadOnly = true;
            // 
            // fsEntriesDataGridLastAccessColumn
            // 
            this.fsEntriesDataGridLastAccessColumn.HeaderText = "Last access";
            this.fsEntriesDataGridLastAccessColumn.Name = "fsEntriesDataGridLastAccessColumn";
            this.fsEntriesDataGridLastAccessColumn.ReadOnly = true;
            // 
            // fsEntriesDataGridLastWriteColumn
            // 
            this.fsEntriesDataGridLastWriteColumn.HeaderText = "Last write";
            this.fsEntriesDataGridLastWriteColumn.Name = "fsEntriesDataGridLastWriteColumn";
            this.fsEntriesDataGridLastWriteColumn.ReadOnly = true;
            // 
            // FsEntriesGridUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoScroll = true;
            this.Controls.Add(this.dataGridView);
            this.Controls.Add(this.topPanel);
            this.Name = "FsEntriesGridUserControl";
            this.Size = new System.Drawing.Size(1064, 611);
            this.topPanel.ResumeLayout(false);
            this.topPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel topPanel;
        private System.Windows.Forms.Label labelControlTitle;
        private System.Windows.Forms.DataGridView dataGridView;
        private System.Windows.Forms.DataGridViewImageColumn fsEntriesDataGridIconColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesDataGridNameColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesDataGridLabelColumn;
        private System.Windows.Forms.DataGridViewImageColumn fsEntriesGridOptsColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesGridCreationTimeColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesDataGridLastAccessColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesDataGridLastWriteColumn;
    }
}
