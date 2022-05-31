namespace Turmerik.FsUtils.WinForms.App
{
    partial class FsEntryOptionsForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FsEntryOptionsForm));
            this.groupBoxSelectedFsEntryName = new System.Windows.Forms.GroupBox();
            this.panelCurrentFolderNameControls = new System.Windows.Forms.Panel();
            this.textBoxSelectedFsEntryName = new System.Windows.Forms.TextBox();
            this.buttonCopySelectedFsEntryNameToClipboard = new System.Windows.Forms.Button();
            this.commandsTableLayoutPanel = new System.Windows.Forms.TableLayoutPanel();
            this.groupBoxSelectedFsEntryName.SuspendLayout();
            this.panelCurrentFolderNameControls.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBoxSelectedFsEntryName
            // 
            this.groupBoxSelectedFsEntryName.Controls.Add(this.panelCurrentFolderNameControls);
            this.groupBoxSelectedFsEntryName.Controls.Add(this.textBoxSelectedFsEntryName);
            this.groupBoxSelectedFsEntryName.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxSelectedFsEntryName.Location = new System.Drawing.Point(0, 0);
            this.groupBoxSelectedFsEntryName.Name = "groupBoxSelectedFsEntryName";
            this.groupBoxSelectedFsEntryName.Size = new System.Drawing.Size(800, 66);
            this.groupBoxSelectedFsEntryName.TabIndex = 10;
            this.groupBoxSelectedFsEntryName.TabStop = false;
            this.groupBoxSelectedFsEntryName.Text = "Selected entry name";
            // 
            // panelCurrentFolderNameControls
            // 
            this.panelCurrentFolderNameControls.Controls.Add(this.buttonCopySelectedFsEntryNameToClipboard);
            this.panelCurrentFolderNameControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelCurrentFolderNameControls.Location = new System.Drawing.Point(3, 36);
            this.panelCurrentFolderNameControls.Name = "panelCurrentFolderNameControls";
            this.panelCurrentFolderNameControls.Size = new System.Drawing.Size(794, 26);
            this.panelCurrentFolderNameControls.TabIndex = 6;
            // 
            // textBoxSelectedFsEntryName
            // 
            this.textBoxSelectedFsEntryName.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxSelectedFsEntryName.Location = new System.Drawing.Point(3, 16);
            this.textBoxSelectedFsEntryName.Name = "textBoxSelectedFsEntryName";
            this.textBoxSelectedFsEntryName.ReadOnly = true;
            this.textBoxSelectedFsEntryName.Size = new System.Drawing.Size(794, 20);
            this.textBoxSelectedFsEntryName.TabIndex = 3;
            // 
            // buttonCopySelectedFsEntryNameToClipboard
            // 
            this.buttonCopySelectedFsEntryNameToClipboard.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCopySelectedFsEntryNameToClipboard.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.clipboard_16x16;
            this.buttonCopySelectedFsEntryNameToClipboard.Location = new System.Drawing.Point(3, 1);
            this.buttonCopySelectedFsEntryNameToClipboard.Name = "buttonCopySelectedFsEntryNameToClipboard";
            this.buttonCopySelectedFsEntryNameToClipboard.Size = new System.Drawing.Size(32, 23);
            this.buttonCopySelectedFsEntryNameToClipboard.TabIndex = 5;
            this.buttonCopySelectedFsEntryNameToClipboard.UseVisualStyleBackColor = true;
            this.buttonCopySelectedFsEntryNameToClipboard.Click += new System.EventHandler(this.ButtonCopySelectedFsEntryNameToClipboard_Click);
            // 
            // commandsTableLayoutPanel
            // 
            this.commandsTableLayoutPanel.ColumnCount = 1;
            this.commandsTableLayoutPanel.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.commandsTableLayoutPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.commandsTableLayoutPanel.Location = new System.Drawing.Point(0, 66);
            this.commandsTableLayoutPanel.Name = "commandsTableLayoutPanel";
            this.commandsTableLayoutPanel.RowCount = 1;
            this.commandsTableLayoutPanel.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.commandsTableLayoutPanel.Size = new System.Drawing.Size(800, 384);
            this.commandsTableLayoutPanel.TabIndex = 11;
            // 
            // FsEntryOptionsForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.commandsTableLayoutPanel);
            this.Controls.Add(this.groupBoxSelectedFsEntryName);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "FsEntryOptionsForm";
            this.Text = "FsEntryOptionsForm";
            this.groupBoxSelectedFsEntryName.ResumeLayout(false);
            this.groupBoxSelectedFsEntryName.PerformLayout();
            this.panelCurrentFolderNameControls.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBoxSelectedFsEntryName;
        private System.Windows.Forms.Panel panelCurrentFolderNameControls;
        private System.Windows.Forms.Button buttonCopySelectedFsEntryNameToClipboard;
        private System.Windows.Forms.TextBox textBoxSelectedFsEntryName;
        private System.Windows.Forms.TableLayoutPanel commandsTableLayoutPanel;
    }
}