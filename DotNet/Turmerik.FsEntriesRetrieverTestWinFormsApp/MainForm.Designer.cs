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
            panelExcludedPaths = new Panel();
            textBoxExcludedPaths = new TextBox();
            labelTitleExcludedPaths = new Label();
            panelIncludedPaths = new Panel();
            textBoxIncludedPaths = new TextBox();
            labelTitleIncludedPaths = new Label();
            panelRootFolderPath = new Panel();
            textBoxRootFolderPath = new TextBox();
            labelTitleRootFolderPath = new Label();
            treeViewMain = new TreeView();
            statusStripMain.SuspendLayout();
            panelActionControls.SuspendLayout();
            panelExcludedPaths.SuspendLayout();
            panelIncludedPaths.SuspendLayout();
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
            panelActionControls.Controls.Add(panelExcludedPaths);
            panelActionControls.Controls.Add(panelIncludedPaths);
            panelActionControls.Controls.Add(panelRootFolderPath);
            panelActionControls.Dock = DockStyle.Top;
            panelActionControls.Location = new Point(0, 0);
            panelActionControls.Name = "panelActionControls";
            panelActionControls.Size = new Size(1784, 69);
            panelActionControls.TabIndex = 3;
            // 
            // panelExcludedPaths
            // 
            panelExcludedPaths.Controls.Add(textBoxExcludedPaths);
            panelExcludedPaths.Controls.Add(labelTitleExcludedPaths);
            panelExcludedPaths.Dock = DockStyle.Top;
            panelExcludedPaths.Location = new Point(0, 46);
            panelExcludedPaths.Name = "panelExcludedPaths";
            panelExcludedPaths.Size = new Size(1784, 23);
            panelExcludedPaths.TabIndex = 2;
            // 
            // textBoxExcludedPaths
            // 
            textBoxExcludedPaths.Dock = DockStyle.Fill;
            textBoxExcludedPaths.Font = new Font("Consolas", 9F, FontStyle.Bold);
            textBoxExcludedPaths.Location = new Point(118, 0);
            textBoxExcludedPaths.Name = "textBoxExcludedPaths";
            textBoxExcludedPaths.Size = new Size(1666, 22);
            textBoxExcludedPaths.TabIndex = 2;
            // 
            // labelTitleExcludedPaths
            // 
            labelTitleExcludedPaths.Dock = DockStyle.Left;
            labelTitleExcludedPaths.Location = new Point(0, 0);
            labelTitleExcludedPaths.Name = "labelTitleExcludedPaths";
            labelTitleExcludedPaths.Padding = new Padding(0, 0, 3, 0);
            labelTitleExcludedPaths.Size = new Size(118, 23);
            labelTitleExcludedPaths.TabIndex = 1;
            labelTitleExcludedPaths.Text = "Excluded Paths";
            labelTitleExcludedPaths.TextAlign = ContentAlignment.MiddleRight;
            // 
            // panelIncludedPaths
            // 
            panelIncludedPaths.Controls.Add(textBoxIncludedPaths);
            panelIncludedPaths.Controls.Add(labelTitleIncludedPaths);
            panelIncludedPaths.Dock = DockStyle.Top;
            panelIncludedPaths.Location = new Point(0, 23);
            panelIncludedPaths.Name = "panelIncludedPaths";
            panelIncludedPaths.Size = new Size(1784, 23);
            panelIncludedPaths.TabIndex = 1;
            // 
            // textBoxIncludedPaths
            // 
            textBoxIncludedPaths.Dock = DockStyle.Fill;
            textBoxIncludedPaths.Font = new Font("Consolas", 9F, FontStyle.Bold);
            textBoxIncludedPaths.Location = new Point(118, 0);
            textBoxIncludedPaths.Name = "textBoxIncludedPaths";
            textBoxIncludedPaths.Size = new Size(1666, 22);
            textBoxIncludedPaths.TabIndex = 2;
            // 
            // labelTitleIncludedPaths
            // 
            labelTitleIncludedPaths.Dock = DockStyle.Left;
            labelTitleIncludedPaths.Location = new Point(0, 0);
            labelTitleIncludedPaths.Name = "labelTitleIncludedPaths";
            labelTitleIncludedPaths.Padding = new Padding(0, 0, 3, 0);
            labelTitleIncludedPaths.Size = new Size(118, 23);
            labelTitleIncludedPaths.TabIndex = 1;
            labelTitleIncludedPaths.Text = "Included Paths";
            labelTitleIncludedPaths.TextAlign = ContentAlignment.MiddleRight;
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
            treeViewMain.Location = new Point(0, 69);
            treeViewMain.Name = "treeViewMain";
            treeViewMain.Size = new Size(1784, 770);
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
            panelExcludedPaths.ResumeLayout(false);
            panelExcludedPaths.PerformLayout();
            panelIncludedPaths.ResumeLayout(false);
            panelIncludedPaths.PerformLayout();
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
        private Panel panelIncludedPaths;
        private Label labelTitleRootFolderPath;
        private Label labelTitleIncludedPaths;
        private TextBox textBoxRootFolderPath;
        private TextBox textBoxIncludedPaths;
        private TreeView treeViewMain;
        private Panel panelExcludedPaths;
        private TextBox textBoxExcludedPaths;
        private Label labelTitleExcludedPaths;
    }
}
