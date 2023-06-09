﻿namespace Turmerik.FileExplorer.WinFormsCore.App
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
            this.components = new System.ComponentModel.Container();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle4 = new System.Windows.Forms.DataGridViewCellStyle();
            this.topPanel = new System.Windows.Forms.Panel();
            this.labelCheckedEntriesCount = new System.Windows.Forms.Label();
            this.labelControlTitle = new System.Windows.Forms.Label();
            this.dataGridView = new System.Windows.Forms.DataGridView();
            this.dataGridSelectRowColumn = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.fsEntriesDataGridIconColumn = new System.Windows.Forms.DataGridViewImageColumn();
            this.fsEntriesDataGridNameColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesDataGridLabelColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesGridOptsColumn = new System.Windows.Forms.DataGridViewImageColumn();
            this.fsEntriesGridCreationTimeColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesDataGridLastAccessColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesDataGridLastWriteColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesGridUuidColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.fsEntriesContextMenuStrip = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.toolStripMenuItemCheckSelectedItems = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItemUncheckSelectedItems = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItemReverseSelectedItemsCheckedState = new System.Windows.Forms.ToolStripMenuItem();
            this.topPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView)).BeginInit();
            this.fsEntriesContextMenuStrip.SuspendLayout();
            this.SuspendLayout();
            // 
            // topPanel
            // 
            this.topPanel.Controls.Add(this.labelCheckedEntriesCount);
            this.topPanel.Controls.Add(this.labelControlTitle);
            this.topPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topPanel.Location = new System.Drawing.Point(0, 0);
            this.topPanel.Name = "topPanel";
            this.topPanel.Size = new System.Drawing.Size(1200, 27);
            this.topPanel.TabIndex = 0;
            // 
            // labelCheckedEntriesCount
            // 
            this.labelCheckedEntriesCount.AutoSize = true;
            this.labelCheckedEntriesCount.Location = new System.Drawing.Point(63, 6);
            this.labelCheckedEntriesCount.Name = "labelCheckedEntriesCount";
            this.labelCheckedEntriesCount.Size = new System.Drawing.Size(96, 13);
            this.labelCheckedEntriesCount.TabIndex = 1;
            this.labelCheckedEntriesCount.Text = "(0 entries selected)";
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
            this.dataGridView.ClipboardCopyMode = System.Windows.Forms.DataGridViewClipboardCopyMode.Disable;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dataGridView.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.dataGridView.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.dataGridSelectRowColumn,
            this.fsEntriesDataGridIconColumn,
            this.fsEntriesDataGridNameColumn,
            this.fsEntriesDataGridLabelColumn,
            this.fsEntriesGridOptsColumn,
            this.fsEntriesGridCreationTimeColumn,
            this.fsEntriesDataGridLastAccessColumn,
            this.fsEntriesDataGridLastWriteColumn,
            this.fsEntriesGridUuidColumn});
            this.dataGridView.ContextMenuStrip = this.fsEntriesContextMenuStrip;
            this.dataGridView.Cursor = System.Windows.Forms.Cursors.Hand;
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = System.Drawing.SystemColors.Window;
            dataGridViewCellStyle2.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            dataGridViewCellStyle2.ForeColor = System.Drawing.SystemColors.ControlText;
            dataGridViewCellStyle2.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle2.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle2.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.dataGridView.DefaultCellStyle = dataGridViewCellStyle2;
            this.dataGridView.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dataGridView.EditMode = System.Windows.Forms.DataGridViewEditMode.EditProgrammatically;
            this.dataGridView.Location = new System.Drawing.Point(0, 27);
            this.dataGridView.Name = "dataGridView";
            this.dataGridView.ReadOnly = true;
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle3.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            dataGridViewCellStyle3.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle3.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle3.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle3.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dataGridView.RowHeadersDefaultCellStyle = dataGridViewCellStyle3;
            this.dataGridView.RowHeadersVisible = false;
            dataGridViewCellStyle4.BackColor = System.Drawing.Color.White;
            dataGridViewCellStyle4.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            dataGridViewCellStyle4.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            dataGridViewCellStyle4.SelectionBackColor = System.Drawing.Color.LightGray;
            dataGridViewCellStyle4.SelectionForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.dataGridView.RowsDefaultCellStyle = dataGridViewCellStyle4;
            this.dataGridView.RowTemplate.DefaultCellStyle.BackColor = System.Drawing.Color.White;
            this.dataGridView.RowTemplate.DefaultCellStyle.Font = new System.Drawing.Font("Arial", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.dataGridView.RowTemplate.DefaultCellStyle.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.dataGridView.RowTemplate.DefaultCellStyle.SelectionBackColor = System.Drawing.Color.LightGray;
            this.dataGridView.RowTemplate.DefaultCellStyle.SelectionForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.dataGridView.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.CellSelect;
            this.dataGridView.Size = new System.Drawing.Size(1200, 584);
            this.dataGridView.TabIndex = 1;
            this.dataGridView.CellDoubleClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.DataGridView_CellDoubleClick);
            this.dataGridView.CellMouseUp += new System.Windows.Forms.DataGridViewCellMouseEventHandler(this.DataGridView_CellMouseUp);
            this.dataGridView.DataError += new System.Windows.Forms.DataGridViewDataErrorEventHandler(this.DataGridView_DataError);
            this.dataGridView.Sorted += new System.EventHandler(this.DataGridView_Sorted);
            this.dataGridView.KeyUp += new System.Windows.Forms.KeyEventHandler(this.DataGridView_KeyUp);
            // 
            // dataGridSelectRowColumn
            // 
            this.dataGridSelectRowColumn.HeaderText = "";
            this.dataGridSelectRowColumn.Name = "dataGridSelectRowColumn";
            this.dataGridSelectRowColumn.ReadOnly = true;
            this.dataGridSelectRowColumn.Width = 30;
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
            this.fsEntriesDataGridLabelColumn.Width = 120;
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
            this.fsEntriesGridCreationTimeColumn.Width = 120;
            // 
            // fsEntriesDataGridLastAccessColumn
            // 
            this.fsEntriesDataGridLastAccessColumn.HeaderText = "Last access";
            this.fsEntriesDataGridLastAccessColumn.Name = "fsEntriesDataGridLastAccessColumn";
            this.fsEntriesDataGridLastAccessColumn.ReadOnly = true;
            this.fsEntriesDataGridLastAccessColumn.Width = 120;
            // 
            // fsEntriesDataGridLastWriteColumn
            // 
            this.fsEntriesDataGridLastWriteColumn.HeaderText = "Last write";
            this.fsEntriesDataGridLastWriteColumn.Name = "fsEntriesDataGridLastWriteColumn";
            this.fsEntriesDataGridLastWriteColumn.ReadOnly = true;
            this.fsEntriesDataGridLastWriteColumn.Width = 120;
            // 
            // fsEntriesGridUuidColumn
            // 
            this.fsEntriesGridUuidColumn.HeaderText = "Uuid";
            this.fsEntriesGridUuidColumn.Name = "fsEntriesGridUuidColumn";
            this.fsEntriesGridUuidColumn.ReadOnly = true;
            this.fsEntriesGridUuidColumn.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.fsEntriesGridUuidColumn.Visible = false;
            // 
            // fsEntriesContextMenuStrip
            // 
            this.fsEntriesContextMenuStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripMenuItemCheckSelectedItems,
            this.toolStripMenuItemUncheckSelectedItems,
            this.toolStripMenuItemReverseSelectedItemsCheckedState});
            this.fsEntriesContextMenuStrip.Name = "contextMenuStrip1";
            this.fsEntriesContextMenuStrip.Size = new System.Drawing.Size(268, 70);
            // 
            // toolStripMenuItemCheckSelectedItems
            // 
            this.toolStripMenuItemCheckSelectedItems.Name = "toolStripMenuItemCheckSelectedItems";
            this.toolStripMenuItemCheckSelectedItems.Size = new System.Drawing.Size(267, 22);
            this.toolStripMenuItemCheckSelectedItems.Text = "Check selected items";
            // 
            // toolStripMenuItemUncheckSelectedItems
            // 
            this.toolStripMenuItemUncheckSelectedItems.Name = "toolStripMenuItemUncheckSelectedItems";
            this.toolStripMenuItemUncheckSelectedItems.Size = new System.Drawing.Size(267, 22);
            this.toolStripMenuItemUncheckSelectedItems.Text = "Uncheck selected items";
            // 
            // toolStripMenuItemReverseSelectedItemsCheckedState
            // 
            this.toolStripMenuItemReverseSelectedItemsCheckedState.Name = "toolStripMenuItemReverseSelectedItemsCheckedState";
            this.toolStripMenuItemReverseSelectedItemsCheckedState.Size = new System.Drawing.Size(267, 22);
            this.toolStripMenuItemReverseSelectedItemsCheckedState.Text = "Reverse selected items checked state";
            // 
            // FsEntriesGridUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoScroll = true;
            this.Controls.Add(this.dataGridView);
            this.Controls.Add(this.topPanel);
            this.Name = "FsEntriesGridUserControl";
            this.Size = new System.Drawing.Size(1200, 611);
            this.topPanel.ResumeLayout(false);
            this.topPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView)).EndInit();
            this.fsEntriesContextMenuStrip.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel topPanel;
        private System.Windows.Forms.Label labelControlTitle;
        private System.Windows.Forms.DataGridView dataGridView;
        private System.Windows.Forms.DataGridViewCheckBoxColumn dataGridSelectRowColumn;
        private System.Windows.Forms.DataGridViewImageColumn fsEntriesDataGridIconColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesDataGridNameColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesDataGridLabelColumn;
        private System.Windows.Forms.DataGridViewImageColumn fsEntriesGridOptsColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesGridCreationTimeColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesDataGridLastAccessColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesDataGridLastWriteColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn fsEntriesGridUuidColumn;
        private System.Windows.Forms.Label labelCheckedEntriesCount;
        private System.Windows.Forms.ContextMenuStrip fsEntriesContextMenuStrip;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemCheckSelectedItems;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemUncheckSelectedItems;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemReverseSelectedItemsCheckedState;
    }
}
