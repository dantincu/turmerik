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
            this.fsEntriesSplitContainer = new System.Windows.Forms.SplitContainer();
            this.fsDirectoryEntriesGridUserControl = new Turmerik.FsUtils.WinForms.App.FsEntriesGridUserControl();
            this.fsFileEntriesGridUserControl = new Turmerik.FsUtils.WinForms.App.FsEntriesGridUserControl();
            this.groupBoxVPath.SuspendLayout();
            this.groupBoxPath.SuspendLayout();
            this.currentDirPathPanel.SuspendLayout();
            this.groupBoxNavigation.SuspendLayout();
            this.panelEditableDirPath.SuspendLayout();
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
            this.groupBoxVPath.Size = new System.Drawing.Size(1263, 39);
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
            this.textBoxVPath.Size = new System.Drawing.Size(1257, 20);
            this.textBoxVPath.TabIndex = 2;
            // 
            // groupBoxPath
            // 
            this.groupBoxPath.Controls.Add(this.currentDirPathPanel);
            this.groupBoxPath.Controls.Add(this.navigationPanel);
            this.groupBoxPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxPath.Location = new System.Drawing.Point(0, 39);
            this.groupBoxPath.Name = "groupBoxPath";
            this.groupBoxPath.Size = new System.Drawing.Size(1263, 72);
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
            this.currentDirPathPanel.Size = new System.Drawing.Size(1257, 25);
            this.currentDirPathPanel.TabIndex = 4;
            // 
            // textBoxCurrentDirPath
            // 
            this.textBoxCurrentDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxCurrentDirPath.Location = new System.Drawing.Point(0, 0);
            this.textBoxCurrentDirPath.Name = "textBoxCurrentDirPath";
            this.textBoxCurrentDirPath.ReadOnly = true;
            this.textBoxCurrentDirPath.Size = new System.Drawing.Size(1257, 20);
            this.textBoxCurrentDirPath.TabIndex = 2;
            // 
            // navigationPanel
            // 
            this.navigationPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.navigationPanel.Location = new System.Drawing.Point(3, 16);
            this.navigationPanel.Name = "navigationPanel";
            this.navigationPanel.Size = new System.Drawing.Size(1257, 21);
            this.navigationPanel.TabIndex = 3;
            // 
            // groupBoxNavigation
            // 
            this.groupBoxNavigation.Controls.Add(this.panelEditableDirPathControls);
            this.groupBoxNavigation.Controls.Add(this.panelEditableDirPath);
            this.groupBoxNavigation.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxNavigation.Location = new System.Drawing.Point(0, 111);
            this.groupBoxNavigation.Name = "groupBoxNavigation";
            this.groupBoxNavigation.Size = new System.Drawing.Size(1263, 73);
            this.groupBoxNavigation.TabIndex = 8;
            this.groupBoxNavigation.TabStop = false;
            this.groupBoxNavigation.Text = "Go to";
            // 
            // panelEditableDirPathControls
            // 
            this.panelEditableDirPathControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelEditableDirPathControls.Location = new System.Drawing.Point(3, 41);
            this.panelEditableDirPathControls.Name = "panelEditableDirPathControls";
            this.panelEditableDirPathControls.Size = new System.Drawing.Size(1257, 26);
            this.panelEditableDirPathControls.TabIndex = 5;
            // 
            // panelEditableDirPath
            // 
            this.panelEditableDirPath.Controls.Add(this.textBoxEditableDirPath);
            this.panelEditableDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelEditableDirPath.Location = new System.Drawing.Point(3, 16);
            this.panelEditableDirPath.Name = "panelEditableDirPath";
            this.panelEditableDirPath.Size = new System.Drawing.Size(1257, 25);
            this.panelEditableDirPath.TabIndex = 6;
            // 
            // textBoxEditableDirPath
            // 
            this.textBoxEditableDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxEditableDirPath.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.0F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.textBoxEditableDirPath.Location = new System.Drawing.Point(0, 0);
            this.textBoxEditableDirPath.Name = "textBoxEditableDirPath";
            this.textBoxEditableDirPath.Size = new System.Drawing.Size(1257, 20);
            this.textBoxEditableDirPath.TabIndex = 2;
            // 
            // fsEntriesSplitContainer
            // 
            this.fsEntriesSplitContainer.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.fsEntriesSplitContainer.IsSplitterFixed = true;
            this.fsEntriesSplitContainer.Location = new System.Drawing.Point(0, 184);
            this.fsEntriesSplitContainer.Name = "fsEntriesSplitContainer";
            this.fsEntriesSplitContainer.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // fsEntriesSplitContainer.Panel1
            // 
            this.fsEntriesSplitContainer.Panel1.AutoScroll = true;
            this.fsEntriesSplitContainer.Panel1.Controls.Add(this.fsDirectoryEntriesGridUserControl);
            this.fsEntriesSplitContainer.Panel1MinSize = 800;
            // 
            // fsEntriesSplitContainer.Panel2
            // 
            this.fsEntriesSplitContainer.Panel2.AutoScroll = true;
            this.fsEntriesSplitContainer.Panel2.Controls.Add(this.fsFileEntriesGridUserControl);
            this.fsEntriesSplitContainer.Size = new System.Drawing.Size(1263, 1600);
            this.fsEntriesSplitContainer.SplitterDistance = 800;
            this.fsEntriesSplitContainer.TabIndex = 9;
            // 
            // fsDirectoryEntriesGridUserControl
            // 
            this.fsDirectoryEntriesGridUserControl.AutoScroll = true;
            this.fsDirectoryEntriesGridUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.fsDirectoryEntriesGridUserControl.Location = new System.Drawing.Point(0, 0);
            this.fsDirectoryEntriesGridUserControl.Name = "fsDirectoryEntriesGridUserControl";
            this.fsDirectoryEntriesGridUserControl.Size = new System.Drawing.Size(1263, 800);
            this.fsDirectoryEntriesGridUserControl.TabIndex = 0;
            // 
            // fsFileEntriesGridUserControl
            // 
            this.fsFileEntriesGridUserControl.AutoScroll = true;
            this.fsFileEntriesGridUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.fsFileEntriesGridUserControl.Location = new System.Drawing.Point(0, 0);
            this.fsFileEntriesGridUserControl.Name = "fsFileEntriesGridUserControl";
            this.fsFileEntriesGridUserControl.Size = new System.Drawing.Size(1263, 796);
            this.fsFileEntriesGridUserControl.TabIndex = 0;
            // 
            // FsExplorerUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoScroll = true;
            this.Controls.Add(this.fsEntriesSplitContainer);
            this.Controls.Add(this.groupBoxNavigation);
            this.Controls.Add(this.groupBoxPath);
            this.Controls.Add(this.groupBoxVPath);
            this.Name = "FsExplorerUserControl";
            this.Size = new System.Drawing.Size(1263, 810);
            this.groupBoxVPath.ResumeLayout(false);
            this.groupBoxVPath.PerformLayout();
            this.groupBoxPath.ResumeLayout(false);
            this.currentDirPathPanel.ResumeLayout(false);
            this.currentDirPathPanel.PerformLayout();
            this.groupBoxNavigation.ResumeLayout(false);
            this.panelEditableDirPath.ResumeLayout(false);
            this.panelEditableDirPath.PerformLayout();
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
        private System.Windows.Forms.SplitContainer fsEntriesSplitContainer;
        private FsEntriesGridUserControl fsDirectoryEntriesGridUserControl;
        private FsEntriesGridUserControl fsFileEntriesGridUserControl;
    }
}
