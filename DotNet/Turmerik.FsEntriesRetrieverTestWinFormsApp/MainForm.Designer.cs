namespace Turmerik.FsEntriesRetrieverTestWinFormsApp
{
    partial class MainForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
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
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            statusStripMain = new StatusStrip();
            toolStripStatusLabelMain = new ToolStripStatusLabel();
            panelActionControls = new Panel();
            panelPathFilters = new Panel();
            textBoxPathFilters = new TextBox();
            labelTitlePathFilters = new Label();
            panelRootFolderPath = new Panel();
            textBoxRootFolderPath = new TextBox();
            labelTitleRootFolderPath = new Label();
            treeViewMain = new TreeView();
            statusStripMain.SuspendLayout();
            panelActionControls.SuspendLayout();
            panelPathFilters.SuspendLayout();
            panelRootFolderPath.SuspendLayout();
            SuspendLayout();
            // 
            // statusStripMain
            // 
            statusStripMain.Items.AddRange(new ToolStripItem[] { toolStripStatusLabelMain });
            statusStripMain.Location = new Point(0, 839);
            statusStripMain.Name = "statusStripMain";
            statusStripMain.Size = new Size(1784, 22);
            statusStripMain.TabIndex = 2;
            // 
            // toolStripStatusLabelMain
            // 
            toolStripStatusLabelMain.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            toolStripStatusLabelMain.Name = "toolStripStatusLabelMain";
            toolStripStatusLabelMain.Size = new Size(0, 17);
            // 
            // panelActionControls
            // 
            panelActionControls.Controls.Add(panelPathFilters);
            panelActionControls.Controls.Add(panelRootFolderPath);
            panelActionControls.Dock = DockStyle.Top;
            panelActionControls.Location = new Point(0, 0);
            panelActionControls.Name = "panelActionControls";
            panelActionControls.Size = new Size(1784, 46);
            panelActionControls.TabIndex = 3;
            // 
            // panelPathFilters
            // 
            panelPathFilters.Controls.Add(textBoxPathFilters);
            panelPathFilters.Controls.Add(labelTitlePathFilters);
            panelPathFilters.Dock = DockStyle.Top;
            panelPathFilters.Location = new Point(0, 23);
            panelPathFilters.Name = "panelPathFilters";
            panelPathFilters.Size = new Size(1784, 23);
            panelPathFilters.TabIndex = 1;
            // 
            // textBoxPathFilters
            // 
            textBoxPathFilters.Dock = DockStyle.Fill;
            textBoxPathFilters.Font = new Font("Consolas", 9F, FontStyle.Bold);
            textBoxPathFilters.Location = new Point(118, 0);
            textBoxPathFilters.Name = "textBoxPathFilters";
            textBoxPathFilters.Size = new Size(1666, 22);
            textBoxPathFilters.TabIndex = 2;
            // 
            // labelTitlePathFilters
            // 
            labelTitlePathFilters.Dock = DockStyle.Left;
            labelTitlePathFilters.Location = new Point(0, 0);
            labelTitlePathFilters.Name = "labelTitlePathFilters";
            labelTitlePathFilters.Padding = new Padding(0, 0, 3, 0);
            labelTitlePathFilters.Size = new Size(118, 23);
            labelTitlePathFilters.TabIndex = 1;
            labelTitlePathFilters.Text = "Path Filters";
            labelTitlePathFilters.TextAlign = ContentAlignment.MiddleRight;
            // 
            // panelRootFolderPath
            // 
            panelRootFolderPath.Controls.Add(textBoxRootFolderPath);
            panelRootFolderPath.Controls.Add(labelTitleRootFolderPath);
            panelRootFolderPath.Dock = DockStyle.Top;
            panelRootFolderPath.Location = new Point(0, 0);
            panelRootFolderPath.Name = "panelRootFolderPath";
            panelRootFolderPath.Size = new Size(1784, 23);
            panelRootFolderPath.TabIndex = 0;
            // 
            // textBoxRootFolderPath
            // 
            textBoxRootFolderPath.Dock = DockStyle.Fill;
            textBoxRootFolderPath.Font = new Font("Consolas", 9F, FontStyle.Bold, GraphicsUnit.Point, 0);
            textBoxRootFolderPath.Location = new Point(118, 0);
            textBoxRootFolderPath.Name = "textBoxRootFolderPath";
            textBoxRootFolderPath.Size = new Size(1666, 22);
            textBoxRootFolderPath.TabIndex = 1;
            // 
            // labelTitleRootFolderPath
            // 
            labelTitleRootFolderPath.Dock = DockStyle.Left;
            labelTitleRootFolderPath.Location = new Point(0, 0);
            labelTitleRootFolderPath.Name = "labelTitleRootFolderPath";
            labelTitleRootFolderPath.Padding = new Padding(0, 0, 3, 0);
            labelTitleRootFolderPath.Size = new Size(118, 23);
            labelTitleRootFolderPath.TabIndex = 0;
            labelTitleRootFolderPath.Text = "Root Folder Path";
            labelTitleRootFolderPath.TextAlign = ContentAlignment.MiddleRight;
            // 
            // treeViewMain
            // 
            treeViewMain.Dock = DockStyle.Fill;
            treeViewMain.Location = new Point(0, 46);
            treeViewMain.Name = "treeViewMain";
            treeViewMain.Size = new Size(1784, 793);
            treeViewMain.TabIndex = 4;
            // 
            // MainForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1784, 861);
            Controls.Add(treeViewMain);
            Controls.Add(panelActionControls);
            Controls.Add(statusStripMain);
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Fs Entries Retrever Test App";
            Load += MainForm_Load;
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            panelActionControls.ResumeLayout(false);
            panelPathFilters.ResumeLayout(false);
            panelPathFilters.PerformLayout();
            panelRootFolderPath.ResumeLayout(false);
            panelRootFolderPath.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private StatusStrip statusStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
        private Panel panelActionControls;
        private Panel panelRootFolderPath;
        private Panel panelPathFilters;
        private Label labelTitleRootFolderPath;
        private Label labelTitlePathFilters;
        private TextBox textBoxRootFolderPath;
        private TextBox textBoxPathFilters;
        private TreeView treeViewMain;
    }
}
