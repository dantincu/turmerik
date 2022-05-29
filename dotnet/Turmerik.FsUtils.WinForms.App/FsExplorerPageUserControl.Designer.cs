namespace Turmerik.FsUtils.WinForms.App
{
    partial class FsExplorerPageUserControl
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
            this.groupBoxVPath = new System.Windows.Forms.GroupBox();
            this.textBoxVPath = new System.Windows.Forms.TextBox();
            this.groupBoxPath = new System.Windows.Forms.GroupBox();
            this.currentDirPathPanel = new System.Windows.Forms.Panel();
            this.textBoxCurrentDirPath = new System.Windows.Forms.TextBox();
            this.navigationPanel = new System.Windows.Forms.Panel();
            this.groupBoxNavigation = new System.Windows.Forms.GroupBox();
            this.panelEditableDirPathControls = new System.Windows.Forms.Panel();
            this.panelEditableDirPath = new System.Windows.Forms.Panel();
            this.textBoxEditableDirPath = new System.Windows.Forms.TextBox();
            this.groupBoxCurrentFolderName = new System.Windows.Forms.GroupBox();
            this.panelCurrentFolderNameControls = new System.Windows.Forms.Panel();
            this.textBoxCurrentFolderName = new System.Windows.Forms.TextBox();
            this.fsEntriesSplitContainer = new System.Windows.Forms.SplitContainer();
            this.fsDirectoryEntriesGridUserControl = new Turmerik.FsUtils.WinForms.App.FsEntriesGridUserControl();
            this.fsFileEntriesGridUserControl = new Turmerik.FsUtils.WinForms.App.FsEntriesGridUserControl();
            this.buttonClearEditableDirPath = new System.Windows.Forms.Button();
            this.buttonCopyCurrentDirPathToClipboard = new System.Windows.Forms.Button();
            this.buttonCurrentDirGoForward = new System.Windows.Forms.Button();
            this.buttonCurrentDirGoUp = new System.Windows.Forms.Button();
            this.buttonCurrentDirGoBack = new System.Windows.Forms.Button();
            this.buttonEditableDirPathGo = new System.Windows.Forms.Button();
            this.groupBoxVPath.SuspendLayout();
            this.groupBoxPath.SuspendLayout();
            this.currentDirPathPanel.SuspendLayout();
            this.navigationPanel.SuspendLayout();
            this.groupBoxNavigation.SuspendLayout();
            this.panelEditableDirPathControls.SuspendLayout();
            this.panelEditableDirPath.SuspendLayout();
            this.groupBoxCurrentFolderName.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.fsEntriesSplitContainer)).BeginInit();
            this.fsEntriesSplitContainer.Panel1.SuspendLayout();
            this.fsEntriesSplitContainer.Panel2.SuspendLayout();
            this.fsEntriesSplitContainer.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBoxVPath
            // 
            this.groupBoxVPath.Controls.Add(this.textBoxVPath);
            this.groupBoxVPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxVPath.Location = new System.Drawing.Point(0, 0);
            this.groupBoxVPath.Name = "groupBoxVPath";
            this.groupBoxVPath.Size = new System.Drawing.Size(1244, 39);
            this.groupBoxVPath.TabIndex = 5;
            this.groupBoxVPath.TabStop = false;
            this.groupBoxVPath.Text = "VPath";
            // 
            // textBoxVPath
            // 
            this.textBoxVPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxVPath.Location = new System.Drawing.Point(3, 16);
            this.textBoxVPath.Name = "textBoxVPath";
            this.textBoxVPath.ReadOnly = true;
            this.textBoxVPath.Size = new System.Drawing.Size(1238, 20);
            this.textBoxVPath.TabIndex = 2;
            // 
            // groupBoxPath
            // 
            this.groupBoxPath.Controls.Add(this.currentDirPathPanel);
            this.groupBoxPath.Controls.Add(this.navigationPanel);
            this.groupBoxPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxPath.Location = new System.Drawing.Point(0, 39);
            this.groupBoxPath.Name = "groupBoxPath";
            this.groupBoxPath.Size = new System.Drawing.Size(1244, 72);
            this.groupBoxPath.TabIndex = 6;
            this.groupBoxPath.TabStop = false;
            this.groupBoxPath.Text = "Path";
            // 
            // currentDirPathPanel
            // 
            this.currentDirPathPanel.Controls.Add(this.textBoxCurrentDirPath);
            this.currentDirPathPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.currentDirPathPanel.Location = new System.Drawing.Point(3, 37);
            this.currentDirPathPanel.Name = "currentDirPathPanel";
            this.currentDirPathPanel.Size = new System.Drawing.Size(1238, 25);
            this.currentDirPathPanel.TabIndex = 4;
            // 
            // textBoxCurrentDirPath
            // 
            this.textBoxCurrentDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxCurrentDirPath.Location = new System.Drawing.Point(0, 0);
            this.textBoxCurrentDirPath.Name = "textBoxCurrentDirPath";
            this.textBoxCurrentDirPath.ReadOnly = true;
            this.textBoxCurrentDirPath.Size = new System.Drawing.Size(1238, 20);
            this.textBoxCurrentDirPath.TabIndex = 2;
            // 
            // navigationPanel
            // 
            this.navigationPanel.Controls.Add(this.buttonCopyCurrentDirPathToClipboard);
            this.navigationPanel.Controls.Add(this.buttonCurrentDirGoForward);
            this.navigationPanel.Controls.Add(this.buttonCurrentDirGoUp);
            this.navigationPanel.Controls.Add(this.buttonCurrentDirGoBack);
            this.navigationPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.navigationPanel.Location = new System.Drawing.Point(3, 16);
            this.navigationPanel.Name = "navigationPanel";
            this.navigationPanel.Size = new System.Drawing.Size(1238, 21);
            this.navigationPanel.TabIndex = 3;
            // 
            // groupBoxNavigation
            // 
            this.groupBoxNavigation.Controls.Add(this.panelEditableDirPathControls);
            this.groupBoxNavigation.Controls.Add(this.panelEditableDirPath);
            this.groupBoxNavigation.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxNavigation.Location = new System.Drawing.Point(0, 111);
            this.groupBoxNavigation.Name = "groupBoxNavigation";
            this.groupBoxNavigation.Size = new System.Drawing.Size(1244, 73);
            this.groupBoxNavigation.TabIndex = 8;
            this.groupBoxNavigation.TabStop = false;
            this.groupBoxNavigation.Text = "Go to";
            // 
            // panelEditableDirPathControls
            // 
            this.panelEditableDirPathControls.Controls.Add(this.buttonEditableDirPathGo);
            this.panelEditableDirPathControls.Controls.Add(this.buttonClearEditableDirPath);
            this.panelEditableDirPathControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelEditableDirPathControls.Location = new System.Drawing.Point(3, 41);
            this.panelEditableDirPathControls.Name = "panelEditableDirPathControls";
            this.panelEditableDirPathControls.Size = new System.Drawing.Size(1238, 26);
            this.panelEditableDirPathControls.TabIndex = 5;
            // 
            // panelEditableDirPath
            // 
            this.panelEditableDirPath.Controls.Add(this.textBoxEditableDirPath);
            this.panelEditableDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelEditableDirPath.Location = new System.Drawing.Point(3, 16);
            this.panelEditableDirPath.Name = "panelEditableDirPath";
            this.panelEditableDirPath.Size = new System.Drawing.Size(1238, 25);
            this.panelEditableDirPath.TabIndex = 6;
            // 
            // textBoxEditableDirPath
            // 
            this.textBoxEditableDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxEditableDirPath.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.textBoxEditableDirPath.Location = new System.Drawing.Point(0, 0);
            this.textBoxEditableDirPath.Name = "textBoxEditableDirPath";
            this.textBoxEditableDirPath.Size = new System.Drawing.Size(1238, 21);
            this.textBoxEditableDirPath.TabIndex = 2;
            this.textBoxEditableDirPath.TextChanged += new System.EventHandler(this.textBoxEditableDirPath_TextChanged);
            // 
            // groupBoxCurrentFolderName
            // 
            this.groupBoxCurrentFolderName.Controls.Add(this.panelCurrentFolderNameControls);
            this.groupBoxCurrentFolderName.Controls.Add(this.textBoxCurrentFolderName);
            this.groupBoxCurrentFolderName.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxCurrentFolderName.Location = new System.Drawing.Point(0, 184);
            this.groupBoxCurrentFolderName.Name = "groupBoxCurrentFolderName";
            this.groupBoxCurrentFolderName.Size = new System.Drawing.Size(1244, 66);
            this.groupBoxCurrentFolderName.TabIndex = 9;
            this.groupBoxCurrentFolderName.TabStop = false;
            this.groupBoxCurrentFolderName.Text = "Current folder name";
            // 
            // panelCurrentFolderNameControls
            // 
            this.panelCurrentFolderNameControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelCurrentFolderNameControls.Location = new System.Drawing.Point(3, 36);
            this.panelCurrentFolderNameControls.Name = "panelCurrentFolderNameControls";
            this.panelCurrentFolderNameControls.Size = new System.Drawing.Size(1238, 26);
            this.panelCurrentFolderNameControls.TabIndex = 6;
            // 
            // textBoxCurrentFolderName
            // 
            this.textBoxCurrentFolderName.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxCurrentFolderName.Location = new System.Drawing.Point(3, 16);
            this.textBoxCurrentFolderName.Name = "textBoxCurrentFolderName";
            this.textBoxCurrentFolderName.ReadOnly = true;
            this.textBoxCurrentFolderName.Size = new System.Drawing.Size(1238, 20);
            this.textBoxCurrentFolderName.TabIndex = 3;
            // 
            // fsEntriesSplitContainer
            // 
            this.fsEntriesSplitContainer.Dock = System.Windows.Forms.DockStyle.Top;
            this.fsEntriesSplitContainer.Location = new System.Drawing.Point(0, 250);
            this.fsEntriesSplitContainer.MinimumSize = new System.Drawing.Size(0, 1610);
            this.fsEntriesSplitContainer.Name = "fsEntriesSplitContainer";
            this.fsEntriesSplitContainer.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // fsEntriesSplitContainer.Panel1
            // 
            this.fsEntriesSplitContainer.Panel1.Controls.Add(this.fsDirectoryEntriesGridUserControl);
            this.fsEntriesSplitContainer.Panel1MinSize = 800;
            // 
            // fsEntriesSplitContainer.Panel2
            // 
            this.fsEntriesSplitContainer.Panel2.Controls.Add(this.fsFileEntriesGridUserControl);
            this.fsEntriesSplitContainer.Panel2MinSize = 800;
            this.fsEntriesSplitContainer.Size = new System.Drawing.Size(1244, 1610);
            this.fsEntriesSplitContainer.SplitterDistance = 800;
            this.fsEntriesSplitContainer.TabIndex = 10;
            // 
            // fsDirectoryEntriesGridUserControl
            // 
            this.fsDirectoryEntriesGridUserControl.AutoScroll = true;
            this.fsDirectoryEntriesGridUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.fsDirectoryEntriesGridUserControl.Location = new System.Drawing.Point(0, 0);
            this.fsDirectoryEntriesGridUserControl.Name = "fsDirectoryEntriesGridUserControl";
            this.fsDirectoryEntriesGridUserControl.Size = new System.Drawing.Size(1244, 800);
            this.fsDirectoryEntriesGridUserControl.TabIndex = 0;
            // 
            // fsFileEntriesGridUserControl
            // 
            this.fsFileEntriesGridUserControl.AutoScroll = true;
            this.fsFileEntriesGridUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.fsFileEntriesGridUserControl.Location = new System.Drawing.Point(0, 0);
            this.fsFileEntriesGridUserControl.Name = "fsFileEntriesGridUserControl";
            this.fsFileEntriesGridUserControl.Size = new System.Drawing.Size(1244, 806);
            this.fsFileEntriesGridUserControl.TabIndex = 1;
            // 
            // buttonClearEditableDirPath
            // 
            this.buttonClearEditableDirPath.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonClearEditableDirPath.Image = global::Turmerik.FsUtils.WinForms.App.Properties.Resources.times_16x16;
            this.buttonClearEditableDirPath.Location = new System.Drawing.Point(1, 1);
            this.buttonClearEditableDirPath.Name = "buttonClearEditableDirPath";
            this.buttonClearEditableDirPath.Size = new System.Drawing.Size(32, 23);
            this.buttonClearEditableDirPath.TabIndex = 1;
            this.buttonClearEditableDirPath.UseVisualStyleBackColor = true;
            this.buttonClearEditableDirPath.Click += new System.EventHandler(this.buttonClearEditableDirPath_Click);
            // 
            // buttonCopyCurrentDirPathToClipboard
            // 
            this.buttonCopyCurrentDirPathToClipboard.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCopyCurrentDirPathToClipboard.Image = global::Turmerik.FsUtils.WinForms.App.Properties.Resources.clipboard_16x16;
            this.buttonCopyCurrentDirPathToClipboard.Location = new System.Drawing.Point(90, 0);
            this.buttonCopyCurrentDirPathToClipboard.Name = "buttonCopyCurrentDirPathToClipboard";
            this.buttonCopyCurrentDirPathToClipboard.Size = new System.Drawing.Size(32, 23);
            this.buttonCopyCurrentDirPathToClipboard.TabIndex = 3;
            this.buttonCopyCurrentDirPathToClipboard.UseVisualStyleBackColor = true;
            this.buttonCopyCurrentDirPathToClipboard.Click += new System.EventHandler(this.buttonCopyCurrentDirPathToClipboard_Click);
            // 
            // buttonCurrentDirGoForward
            // 
            this.buttonCurrentDirGoForward.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCurrentDirGoForward.Image = global::Turmerik.FsUtils.WinForms.App.Properties.Resources.arrow_right_16x16;
            this.buttonCurrentDirGoForward.Location = new System.Drawing.Point(58, -1);
            this.buttonCurrentDirGoForward.Name = "buttonCurrentDirGoForward";
            this.buttonCurrentDirGoForward.Size = new System.Drawing.Size(32, 23);
            this.buttonCurrentDirGoForward.TabIndex = 2;
            this.buttonCurrentDirGoForward.UseVisualStyleBackColor = true;
            this.buttonCurrentDirGoForward.Click += new System.EventHandler(this.buttonCurrentDirGoForward_Click);
            // 
            // buttonCurrentDirGoUp
            // 
            this.buttonCurrentDirGoUp.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCurrentDirGoUp.Image = global::Turmerik.FsUtils.WinForms.App.Properties.Resources.arrow_up_16x16;
            this.buttonCurrentDirGoUp.Location = new System.Drawing.Point(29, -1);
            this.buttonCurrentDirGoUp.Name = "buttonCurrentDirGoUp";
            this.buttonCurrentDirGoUp.Size = new System.Drawing.Size(32, 23);
            this.buttonCurrentDirGoUp.TabIndex = 1;
            this.buttonCurrentDirGoUp.UseVisualStyleBackColor = true;
            this.buttonCurrentDirGoUp.Click += new System.EventHandler(this.buttonCurrentDirGoUp_Click);
            // 
            // buttonCurrentDirGoBack
            // 
            this.buttonCurrentDirGoBack.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCurrentDirGoBack.Image = global::Turmerik.FsUtils.WinForms.App.Properties.Resources.arrow_left_16x16;
            this.buttonCurrentDirGoBack.Location = new System.Drawing.Point(0, -1);
            this.buttonCurrentDirGoBack.Name = "buttonCurrentDirGoBack";
            this.buttonCurrentDirGoBack.Size = new System.Drawing.Size(32, 23);
            this.buttonCurrentDirGoBack.TabIndex = 0;
            this.buttonCurrentDirGoBack.UseVisualStyleBackColor = true;
            this.buttonCurrentDirGoBack.Click += new System.EventHandler(this.buttonCurrentDirGoBack_Click);
            // 
            // buttonEditableDirPathGo
            // 
            this.buttonEditableDirPathGo.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonEditableDirPathGo.Image = global::Turmerik.FsUtils.WinForms.App.Properties.Resources.arrow_right_16x16;
            this.buttonEditableDirPathGo.Location = new System.Drawing.Point(30, 1);
            this.buttonEditableDirPathGo.Name = "buttonEditableDirPathGo";
            this.buttonEditableDirPathGo.Size = new System.Drawing.Size(32, 23);
            this.buttonEditableDirPathGo.TabIndex = 3;
            this.buttonEditableDirPathGo.UseVisualStyleBackColor = true;
            this.buttonEditableDirPathGo.Click += new System.EventHandler(this.buttonEditableDirPathGo_Click);
            // 
            // FsExplorerPageUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoScroll = true;
            this.Controls.Add(this.fsEntriesSplitContainer);
            this.Controls.Add(this.groupBoxCurrentFolderName);
            this.Controls.Add(this.groupBoxNavigation);
            this.Controls.Add(this.groupBoxPath);
            this.Controls.Add(this.groupBoxVPath);
            this.MinimumSize = new System.Drawing.Size(0, 2000);
            this.Name = "FsExplorerPageUserControl";
            this.Size = new System.Drawing.Size(1244, 2000);
            this.groupBoxVPath.ResumeLayout(false);
            this.groupBoxVPath.PerformLayout();
            this.groupBoxPath.ResumeLayout(false);
            this.currentDirPathPanel.ResumeLayout(false);
            this.currentDirPathPanel.PerformLayout();
            this.navigationPanel.ResumeLayout(false);
            this.groupBoxNavigation.ResumeLayout(false);
            this.panelEditableDirPathControls.ResumeLayout(false);
            this.panelEditableDirPath.ResumeLayout(false);
            this.panelEditableDirPath.PerformLayout();
            this.groupBoxCurrentFolderName.ResumeLayout(false);
            this.groupBoxCurrentFolderName.PerformLayout();
            this.fsEntriesSplitContainer.Panel1.ResumeLayout(false);
            this.fsEntriesSplitContainer.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.fsEntriesSplitContainer)).EndInit();
            this.fsEntriesSplitContainer.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBoxVPath;
        private System.Windows.Forms.TextBox textBoxVPath;
        private System.Windows.Forms.GroupBox groupBoxPath;
        private System.Windows.Forms.Panel currentDirPathPanel;
        private System.Windows.Forms.TextBox textBoxCurrentDirPath;
        private System.Windows.Forms.Panel navigationPanel;
        private System.Windows.Forms.GroupBox groupBoxNavigation;
        private System.Windows.Forms.Panel panelEditableDirPathControls;
        private System.Windows.Forms.Panel panelEditableDirPath;
        private System.Windows.Forms.TextBox textBoxEditableDirPath;
        private System.Windows.Forms.GroupBox groupBoxCurrentFolderName;
        private System.Windows.Forms.TextBox textBoxCurrentFolderName;
        private System.Windows.Forms.Panel panelCurrentFolderNameControls;
        private System.Windows.Forms.SplitContainer fsEntriesSplitContainer;
        private FsEntriesGridUserControl fsDirectoryEntriesGridUserControl;
        private FsEntriesGridUserControl fsFileEntriesGridUserControl;
        private System.Windows.Forms.Button buttonCurrentDirGoBack;
        private System.Windows.Forms.Button buttonCurrentDirGoUp;
        private System.Windows.Forms.Button buttonCurrentDirGoForward;
        private System.Windows.Forms.Button buttonCopyCurrentDirPathToClipboard;
        private System.Windows.Forms.Button buttonClearEditableDirPath;
        private System.Windows.Forms.Button buttonEditableDirPathGo;
    }
}
