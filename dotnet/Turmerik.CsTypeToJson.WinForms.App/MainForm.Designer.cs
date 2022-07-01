namespace Turmerik.CsTypeToJson.WinForms.App
{
    partial class MainForm
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

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.groupBoxAssembly = new System.Windows.Forms.GroupBox();
            this.checkBoxUseCamelCase = new System.Windows.Forms.CheckBox();
            this.buttonBrowseAssemblyPath = new System.Windows.Forms.Button();
            this.buttonLoadAssembly = new System.Windows.Forms.Button();
            this.textBoxAssemblyPath = new System.Windows.Forms.TextBox();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.toolStripStatusLabel = new System.Windows.Forms.ToolStripStatusLabel();
            this.openFileDialog = new System.Windows.Forms.OpenFileDialog();
            this.groupBoxAssemblyTypesSearch = new System.Windows.Forms.GroupBox();
            this.textBoxAssemblyTypesSearch = new System.Windows.Forms.TextBox();
            this.panelAssemblyTypesGrid = new System.Windows.Forms.Panel();
            this.dataGridViewAssemblyTypes = new System.Windows.Forms.DataGridView();
            this.dataGridViewAssemblyTypesFullTypeNameColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.groupBoxAssembly.SuspendLayout();
            this.statusStrip.SuspendLayout();
            this.groupBoxAssemblyTypesSearch.SuspendLayout();
            this.panelAssemblyTypesGrid.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewAssemblyTypes)).BeginInit();
            this.SuspendLayout();
            // 
            // groupBoxAssembly
            // 
            this.groupBoxAssembly.Controls.Add(this.checkBoxUseCamelCase);
            this.groupBoxAssembly.Controls.Add(this.buttonBrowseAssemblyPath);
            this.groupBoxAssembly.Controls.Add(this.buttonLoadAssembly);
            this.groupBoxAssembly.Controls.Add(this.textBoxAssemblyPath);
            this.groupBoxAssembly.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxAssembly.Location = new System.Drawing.Point(0, 0);
            this.groupBoxAssembly.Name = "groupBoxAssembly";
            this.groupBoxAssembly.Size = new System.Drawing.Size(800, 62);
            this.groupBoxAssembly.TabIndex = 0;
            this.groupBoxAssembly.TabStop = false;
            this.groupBoxAssembly.Text = "Load from assembly";
            // 
            // checkBoxUseCamelCase
            // 
            this.checkBoxUseCamelCase.AutoSize = true;
            this.checkBoxUseCamelCase.Checked = true;
            this.checkBoxUseCamelCase.CheckState = System.Windows.Forms.CheckState.Checked;
            this.checkBoxUseCamelCase.Dock = System.Windows.Forms.DockStyle.Right;
            this.checkBoxUseCamelCase.Location = new System.Drawing.Point(601, 36);
            this.checkBoxUseCamelCase.Name = "checkBoxUseCamelCase";
            this.checkBoxUseCamelCase.Size = new System.Drawing.Size(102, 23);
            this.checkBoxUseCamelCase.TabIndex = 3;
            this.checkBoxUseCamelCase.Text = "Use camel case";
            this.checkBoxUseCamelCase.UseVisualStyleBackColor = true;
            // 
            // buttonBrowseAssemblyPath
            // 
            this.buttonBrowseAssemblyPath.Dock = System.Windows.Forms.DockStyle.Right;
            this.buttonBrowseAssemblyPath.Location = new System.Drawing.Point(703, 36);
            this.buttonBrowseAssemblyPath.Name = "buttonBrowseAssemblyPath";
            this.buttonBrowseAssemblyPath.Size = new System.Drawing.Size(53, 23);
            this.buttonBrowseAssemblyPath.TabIndex = 2;
            this.buttonBrowseAssemblyPath.Text = "Browse";
            this.buttonBrowseAssemblyPath.UseVisualStyleBackColor = true;
            this.buttonBrowseAssemblyPath.Click += new System.EventHandler(this.ButtonBrowseAssemblyPath_Click);
            // 
            // buttonLoadAssembly
            // 
            this.buttonLoadAssembly.Dock = System.Windows.Forms.DockStyle.Right;
            this.buttonLoadAssembly.Location = new System.Drawing.Point(756, 36);
            this.buttonLoadAssembly.Name = "buttonLoadAssembly";
            this.buttonLoadAssembly.Size = new System.Drawing.Size(41, 23);
            this.buttonLoadAssembly.TabIndex = 1;
            this.buttonLoadAssembly.Text = "Load";
            this.buttonLoadAssembly.UseVisualStyleBackColor = true;
            this.buttonLoadAssembly.Click += new System.EventHandler(this.buttonLoadAssembly_Click);
            // 
            // textBoxAssemblyPath
            // 
            this.textBoxAssemblyPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxAssemblyPath.Location = new System.Drawing.Point(3, 16);
            this.textBoxAssemblyPath.Name = "textBoxAssemblyPath";
            this.textBoxAssemblyPath.Size = new System.Drawing.Size(794, 20);
            this.textBoxAssemblyPath.TabIndex = 0;
            this.textBoxAssemblyPath.KeyUp += new System.Windows.Forms.KeyEventHandler(this.textBoxAssemblyPath_KeyUp);
            // 
            // statusStrip
            // 
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripStatusLabel});
            this.statusStrip.Location = new System.Drawing.Point(0, 428);
            this.statusStrip.Name = "statusStrip";
            this.statusStrip.Size = new System.Drawing.Size(800, 22);
            this.statusStrip.TabIndex = 1;
            this.statusStrip.Text = "statusStrip1";
            // 
            // toolStripStatusLabel
            // 
            this.toolStripStatusLabel.Name = "toolStripStatusLabel";
            this.toolStripStatusLabel.Size = new System.Drawing.Size(112, 17);
            this.toolStripStatusLabel.Text = "toolStripStatusLabel";
            // 
            // groupBoxAssemblyTypesSearch
            // 
            this.groupBoxAssemblyTypesSearch.Controls.Add(this.textBoxAssemblyTypesSearch);
            this.groupBoxAssemblyTypesSearch.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxAssemblyTypesSearch.Location = new System.Drawing.Point(0, 62);
            this.groupBoxAssemblyTypesSearch.Name = "groupBoxAssemblyTypesSearch";
            this.groupBoxAssemblyTypesSearch.Size = new System.Drawing.Size(800, 36);
            this.groupBoxAssemblyTypesSearch.TabIndex = 2;
            this.groupBoxAssemblyTypesSearch.TabStop = false;
            this.groupBoxAssemblyTypesSearch.Text = "Assembly types";
            // 
            // textBoxAssemblyTypesSearch
            // 
            this.textBoxAssemblyTypesSearch.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxAssemblyTypesSearch.Location = new System.Drawing.Point(3, 16);
            this.textBoxAssemblyTypesSearch.Name = "textBoxAssemblyTypesSearch";
            this.textBoxAssemblyTypesSearch.Size = new System.Drawing.Size(794, 20);
            this.textBoxAssemblyTypesSearch.TabIndex = 1;
            this.textBoxAssemblyTypesSearch.KeyDown += new System.Windows.Forms.KeyEventHandler(this.textBoxAssemblyTypesSearch_KeyDown);
            // 
            // panelAssemblyTypesGrid
            // 
            this.panelAssemblyTypesGrid.Controls.Add(this.dataGridViewAssemblyTypes);
            this.panelAssemblyTypesGrid.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelAssemblyTypesGrid.Location = new System.Drawing.Point(0, 98);
            this.panelAssemblyTypesGrid.Name = "panelAssemblyTypesGrid";
            this.panelAssemblyTypesGrid.Size = new System.Drawing.Size(800, 330);
            this.panelAssemblyTypesGrid.TabIndex = 3;
            // 
            // dataGridViewAssemblyTypes
            // 
            this.dataGridViewAssemblyTypes.AllowUserToAddRows = false;
            this.dataGridViewAssemblyTypes.AllowUserToDeleteRows = false;
            this.dataGridViewAssemblyTypes.AllowUserToOrderColumns = true;
            this.dataGridViewAssemblyTypes.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridViewAssemblyTypes.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.dataGridViewAssemblyTypesFullTypeNameColumn});
            this.dataGridViewAssemblyTypes.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dataGridViewAssemblyTypes.Location = new System.Drawing.Point(0, 0);
            this.dataGridViewAssemblyTypes.Name = "dataGridViewAssemblyTypes";
            this.dataGridViewAssemblyTypes.ReadOnly = true;
            this.dataGridViewAssemblyTypes.RowHeadersVisible = false;
            this.dataGridViewAssemblyTypes.Size = new System.Drawing.Size(800, 330);
            this.dataGridViewAssemblyTypes.TabIndex = 0;
            this.dataGridViewAssemblyTypes.CellMouseDoubleClick += new System.Windows.Forms.DataGridViewCellMouseEventHandler(this.DataGridViewAssemblyTypes_CellMouseDoubleClick);
            this.dataGridViewAssemblyTypes.Sorted += new System.EventHandler(this.DataGridViewAssemblyTypes_Sorted);
            // 
            // dataGridViewAssemblyTypesFullTypeNameColumn
            // 
            this.dataGridViewAssemblyTypesFullTypeNameColumn.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.dataGridViewAssemblyTypesFullTypeNameColumn.HeaderText = "Full type name";
            this.dataGridViewAssemblyTypesFullTypeNameColumn.Name = "dataGridViewAssemblyTypesFullTypeNameColumn";
            this.dataGridViewAssemblyTypesFullTypeNameColumn.ReadOnly = true;
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.panelAssemblyTypesGrid);
            this.Controls.Add(this.groupBoxAssemblyTypesSearch);
            this.Controls.Add(this.statusStrip);
            this.Controls.Add(this.groupBoxAssembly);
            this.Name = "MainForm";
            this.Text = "C# type to json";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.groupBoxAssembly.ResumeLayout(false);
            this.groupBoxAssembly.PerformLayout();
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.groupBoxAssemblyTypesSearch.ResumeLayout(false);
            this.groupBoxAssemblyTypesSearch.PerformLayout();
            this.panelAssemblyTypesGrid.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewAssemblyTypes)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBoxAssembly;
        private System.Windows.Forms.TextBox textBoxAssemblyPath;
        private System.Windows.Forms.Button buttonLoadAssembly;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel;
        private System.Windows.Forms.OpenFileDialog openFileDialog;
        private System.Windows.Forms.Button buttonBrowseAssemblyPath;
        private System.Windows.Forms.GroupBox groupBoxAssemblyTypesSearch;
        private System.Windows.Forms.TextBox textBoxAssemblyTypesSearch;
        private System.Windows.Forms.Panel panelAssemblyTypesGrid;
        private System.Windows.Forms.DataGridView dataGridViewAssemblyTypes;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewAssemblyTypesFullTypeNameColumn;
        private System.Windows.Forms.CheckBox checkBoxUseCamelCase;
    }
}

