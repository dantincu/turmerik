namespace Turmerik.FileExplorer.WinFormsCore.App
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
            this.buttonReloadCurrentDirPath = new System.Windows.Forms.Button();
            this.buttonCopyCurrentDirPathToClipboard = new System.Windows.Forms.Button();
            this.buttonCurrentDirGoForward = new System.Windows.Forms.Button();
            this.buttonCurrentDirGoUp = new System.Windows.Forms.Button();
            this.buttonCurrentDirGoBack = new System.Windows.Forms.Button();
            this.groupBoxEditableDirPath = new System.Windows.Forms.GroupBox();
            this.panelEditableDirPathControls = new System.Windows.Forms.Panel();
            this.buttonEditableDirPathUndoChanges = new System.Windows.Forms.Button();
            this.buttonCopyEditableDirPathToClipboard = new System.Windows.Forms.Button();
            this.buttonEditableDirPathGo = new System.Windows.Forms.Button();
            this.buttonClearEditableDirPath = new System.Windows.Forms.Button();
            this.panelEditableDirPath = new System.Windows.Forms.Panel();
            this.textBoxEditableDirPath = new System.Windows.Forms.TextBox();
            this.groupBoxCurrentFolderName = new System.Windows.Forms.GroupBox();
            this.panelCurrentFolderNameControls = new System.Windows.Forms.Panel();
            this.buttonCurrentFolderOpts = new System.Windows.Forms.Button();
            this.expandCollapseNavigationPanelsUserControl = new Turmerik.FileExplorer.WinFormsCore.App.ExpandCollapseUserControl();
            this.buttonCopyCurrentFolderNameToClipboard = new System.Windows.Forms.Button();
            this.textBoxCurrentDirName = new System.Windows.Forms.TextBox();
            this.fsEntriesSplitContainer = new System.Windows.Forms.SplitContainer();
            this.fsDirectoryEntriesGridUserControl = new Turmerik.FileExplorer.WinFormsCore.App.FsEntriesGridUserControl();
            this.fsFileEntriesGridUserControl = new Turmerik.FileExplorer.WinFormsCore.App.FsEntriesGridUserControl();
            this.groupBoxVPath.SuspendLayout();
            this.groupBoxPath.SuspendLayout();
            this.currentDirPathPanel.SuspendLayout();
            this.navigationPanel.SuspendLayout();
            this.groupBoxEditableDirPath.SuspendLayout();
            this.panelEditableDirPathControls.SuspendLayout();
            this.panelEditableDirPath.SuspendLayout();
            this.groupBoxCurrentFolderName.SuspendLayout();
            this.panelCurrentFolderNameControls.SuspendLayout();
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
            this.groupBoxVPath.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.groupBoxVPath.Name = "groupBoxVPath";
            this.groupBoxVPath.Padding = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.groupBoxVPath.Size = new System.Drawing.Size(1451, 45);
            this.groupBoxVPath.TabIndex = 5;
            this.groupBoxVPath.TabStop = false;
            this.groupBoxVPath.Text = "VPath";
            // 
            // textBoxVPath
            // 
            this.textBoxVPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxVPath.Location = new System.Drawing.Point(4, 19);
            this.textBoxVPath.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.textBoxVPath.Name = "textBoxVPath";
            this.textBoxVPath.ReadOnly = true;
            this.textBoxVPath.Size = new System.Drawing.Size(1443, 23);
            this.textBoxVPath.TabIndex = 2;
            // 
            // groupBoxPath
            // 
            this.groupBoxPath.Controls.Add(this.currentDirPathPanel);
            this.groupBoxPath.Controls.Add(this.navigationPanel);
            this.groupBoxPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxPath.Location = new System.Drawing.Point(0, 45);
            this.groupBoxPath.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.groupBoxPath.Name = "groupBoxPath";
            this.groupBoxPath.Padding = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.groupBoxPath.Size = new System.Drawing.Size(1451, 83);
            this.groupBoxPath.TabIndex = 6;
            this.groupBoxPath.TabStop = false;
            this.groupBoxPath.Text = "Path";
            // 
            // currentDirPathPanel
            // 
            this.currentDirPathPanel.Controls.Add(this.textBoxCurrentDirPath);
            this.currentDirPathPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.currentDirPathPanel.Location = new System.Drawing.Point(4, 43);
            this.currentDirPathPanel.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.currentDirPathPanel.Name = "currentDirPathPanel";
            this.currentDirPathPanel.Size = new System.Drawing.Size(1443, 29);
            this.currentDirPathPanel.TabIndex = 4;
            // 
            // textBoxCurrentDirPath
            // 
            this.textBoxCurrentDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxCurrentDirPath.Location = new System.Drawing.Point(0, 0);
            this.textBoxCurrentDirPath.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.textBoxCurrentDirPath.Name = "textBoxCurrentDirPath";
            this.textBoxCurrentDirPath.ReadOnly = true;
            this.textBoxCurrentDirPath.Size = new System.Drawing.Size(1443, 23);
            this.textBoxCurrentDirPath.TabIndex = 2;
            // 
            // navigationPanel
            // 
            this.navigationPanel.Controls.Add(this.buttonReloadCurrentDirPath);
            this.navigationPanel.Controls.Add(this.buttonCopyCurrentDirPathToClipboard);
            this.navigationPanel.Controls.Add(this.buttonCurrentDirGoForward);
            this.navigationPanel.Controls.Add(this.buttonCurrentDirGoUp);
            this.navigationPanel.Controls.Add(this.buttonCurrentDirGoBack);
            this.navigationPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.navigationPanel.Location = new System.Drawing.Point(4, 19);
            this.navigationPanel.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.navigationPanel.Name = "navigationPanel";
            this.navigationPanel.Size = new System.Drawing.Size(1443, 24);
            this.navigationPanel.TabIndex = 3;
            // 
            // buttonReloadCurrentDirPath
            // 
            this.buttonReloadCurrentDirPath.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonReloadCurrentDirPath.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.reload_16x16;
            this.buttonReloadCurrentDirPath.Location = new System.Drawing.Point(103, -1);
            this.buttonReloadCurrentDirPath.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonReloadCurrentDirPath.Name = "buttonReloadCurrentDirPath";
            this.buttonReloadCurrentDirPath.Size = new System.Drawing.Size(37, 27);
            this.buttonReloadCurrentDirPath.TabIndex = 4;
            this.buttonReloadCurrentDirPath.UseVisualStyleBackColor = true;
            this.buttonReloadCurrentDirPath.Click += new System.EventHandler(this.ButtonReloadCurrentDirPath_Click);
            // 
            // buttonCopyCurrentDirPathToClipboard
            // 
            this.buttonCopyCurrentDirPathToClipboard.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCopyCurrentDirPathToClipboard.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.clipboard_16x16;
            this.buttonCopyCurrentDirPathToClipboard.Location = new System.Drawing.Point(140, -1);
            this.buttonCopyCurrentDirPathToClipboard.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonCopyCurrentDirPathToClipboard.Name = "buttonCopyCurrentDirPathToClipboard";
            this.buttonCopyCurrentDirPathToClipboard.Size = new System.Drawing.Size(37, 27);
            this.buttonCopyCurrentDirPathToClipboard.TabIndex = 3;
            this.buttonCopyCurrentDirPathToClipboard.UseVisualStyleBackColor = true;
            this.buttonCopyCurrentDirPathToClipboard.Click += new System.EventHandler(this.ButtonCopyCurrentDirPathToClipboard_Click);
            // 
            // buttonCurrentDirGoForward
            // 
            this.buttonCurrentDirGoForward.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCurrentDirGoForward.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.arrow_right_16x16;
            this.buttonCurrentDirGoForward.Location = new System.Drawing.Point(68, -1);
            this.buttonCurrentDirGoForward.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonCurrentDirGoForward.Name = "buttonCurrentDirGoForward";
            this.buttonCurrentDirGoForward.Size = new System.Drawing.Size(37, 27);
            this.buttonCurrentDirGoForward.TabIndex = 2;
            this.buttonCurrentDirGoForward.UseVisualStyleBackColor = true;
            this.buttonCurrentDirGoForward.Click += new System.EventHandler(this.ButtonCurrentDirGoForward_Click);
            // 
            // buttonCurrentDirGoUp
            // 
            this.buttonCurrentDirGoUp.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCurrentDirGoUp.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.arrow_up_16x16;
            this.buttonCurrentDirGoUp.Location = new System.Drawing.Point(34, -1);
            this.buttonCurrentDirGoUp.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonCurrentDirGoUp.Name = "buttonCurrentDirGoUp";
            this.buttonCurrentDirGoUp.Size = new System.Drawing.Size(37, 27);
            this.buttonCurrentDirGoUp.TabIndex = 1;
            this.buttonCurrentDirGoUp.UseVisualStyleBackColor = true;
            this.buttonCurrentDirGoUp.Click += new System.EventHandler(this.ButtonCurrentDirGoUp_Click);
            // 
            // buttonCurrentDirGoBack
            // 
            this.buttonCurrentDirGoBack.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCurrentDirGoBack.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.arrow_left_16x16;
            this.buttonCurrentDirGoBack.Location = new System.Drawing.Point(0, -1);
            this.buttonCurrentDirGoBack.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonCurrentDirGoBack.Name = "buttonCurrentDirGoBack";
            this.buttonCurrentDirGoBack.Size = new System.Drawing.Size(37, 27);
            this.buttonCurrentDirGoBack.TabIndex = 0;
            this.buttonCurrentDirGoBack.UseVisualStyleBackColor = true;
            this.buttonCurrentDirGoBack.Click += new System.EventHandler(this.ButtonCurrentDirGoBack_Click);
            // 
            // groupBoxEditableDirPath
            // 
            this.groupBoxEditableDirPath.Controls.Add(this.panelEditableDirPathControls);
            this.groupBoxEditableDirPath.Controls.Add(this.panelEditableDirPath);
            this.groupBoxEditableDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxEditableDirPath.Location = new System.Drawing.Point(0, 128);
            this.groupBoxEditableDirPath.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.groupBoxEditableDirPath.Name = "groupBoxEditableDirPath";
            this.groupBoxEditableDirPath.Padding = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.groupBoxEditableDirPath.Size = new System.Drawing.Size(1451, 84);
            this.groupBoxEditableDirPath.TabIndex = 8;
            this.groupBoxEditableDirPath.TabStop = false;
            this.groupBoxEditableDirPath.Text = "Go to";
            // 
            // panelEditableDirPathControls
            // 
            this.panelEditableDirPathControls.Controls.Add(this.buttonEditableDirPathUndoChanges);
            this.panelEditableDirPathControls.Controls.Add(this.buttonCopyEditableDirPathToClipboard);
            this.panelEditableDirPathControls.Controls.Add(this.buttonEditableDirPathGo);
            this.panelEditableDirPathControls.Controls.Add(this.buttonClearEditableDirPath);
            this.panelEditableDirPathControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelEditableDirPathControls.Location = new System.Drawing.Point(4, 48);
            this.panelEditableDirPathControls.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.panelEditableDirPathControls.Name = "panelEditableDirPathControls";
            this.panelEditableDirPathControls.Size = new System.Drawing.Size(1443, 30);
            this.panelEditableDirPathControls.TabIndex = 5;
            // 
            // buttonEditableDirPathUndoChanges
            // 
            this.buttonEditableDirPathUndoChanges.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonEditableDirPathUndoChanges.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.arrow_left_16x16;
            this.buttonEditableDirPathUndoChanges.Location = new System.Drawing.Point(4, 1);
            this.buttonEditableDirPathUndoChanges.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonEditableDirPathUndoChanges.Name = "buttonEditableDirPathUndoChanges";
            this.buttonEditableDirPathUndoChanges.Size = new System.Drawing.Size(37, 27);
            this.buttonEditableDirPathUndoChanges.TabIndex = 5;
            this.buttonEditableDirPathUndoChanges.UseVisualStyleBackColor = true;
            this.buttonEditableDirPathUndoChanges.Click += new System.EventHandler(this.ButtonEditableDirPathUndoChanges_Click);
            // 
            // buttonCopyEditableDirPathToClipboard
            // 
            this.buttonCopyEditableDirPathToClipboard.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCopyEditableDirPathToClipboard.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.clipboard_16x16;
            this.buttonCopyEditableDirPathToClipboard.Location = new System.Drawing.Point(110, 1);
            this.buttonCopyEditableDirPathToClipboard.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonCopyEditableDirPathToClipboard.Name = "buttonCopyEditableDirPathToClipboard";
            this.buttonCopyEditableDirPathToClipboard.Size = new System.Drawing.Size(37, 27);
            this.buttonCopyEditableDirPathToClipboard.TabIndex = 4;
            this.buttonCopyEditableDirPathToClipboard.UseVisualStyleBackColor = true;
            this.buttonCopyEditableDirPathToClipboard.Click += new System.EventHandler(this.ButtonCopyEditableDirPathToClipboard_Click);
            // 
            // buttonEditableDirPathGo
            // 
            this.buttonEditableDirPathGo.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonEditableDirPathGo.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.arrow_right_16x16;
            this.buttonEditableDirPathGo.Location = new System.Drawing.Point(72, 1);
            this.buttonEditableDirPathGo.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonEditableDirPathGo.Name = "buttonEditableDirPathGo";
            this.buttonEditableDirPathGo.Size = new System.Drawing.Size(37, 27);
            this.buttonEditableDirPathGo.TabIndex = 3;
            this.buttonEditableDirPathGo.UseVisualStyleBackColor = true;
            this.buttonEditableDirPathGo.Click += new System.EventHandler(this.ButtonEditableDirPathGo_Click);
            // 
            // buttonClearEditableDirPath
            // 
            this.buttonClearEditableDirPath.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonClearEditableDirPath.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.times_16x16;
            this.buttonClearEditableDirPath.Location = new System.Drawing.Point(38, 1);
            this.buttonClearEditableDirPath.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonClearEditableDirPath.Name = "buttonClearEditableDirPath";
            this.buttonClearEditableDirPath.Size = new System.Drawing.Size(37, 27);
            this.buttonClearEditableDirPath.TabIndex = 1;
            this.buttonClearEditableDirPath.UseVisualStyleBackColor = true;
            this.buttonClearEditableDirPath.Click += new System.EventHandler(this.ButtonClearEditableDirPath_Click);
            // 
            // panelEditableDirPath
            // 
            this.panelEditableDirPath.Controls.Add(this.textBoxEditableDirPath);
            this.panelEditableDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelEditableDirPath.Location = new System.Drawing.Point(4, 19);
            this.panelEditableDirPath.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.panelEditableDirPath.Name = "panelEditableDirPath";
            this.panelEditableDirPath.Size = new System.Drawing.Size(1443, 29);
            this.panelEditableDirPath.TabIndex = 6;
            // 
            // textBoxEditableDirPath
            // 
            this.textBoxEditableDirPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxEditableDirPath.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point);
            this.textBoxEditableDirPath.Location = new System.Drawing.Point(0, 0);
            this.textBoxEditableDirPath.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.textBoxEditableDirPath.Name = "textBoxEditableDirPath";
            this.textBoxEditableDirPath.Size = new System.Drawing.Size(1443, 21);
            this.textBoxEditableDirPath.TabIndex = 2;
            this.textBoxEditableDirPath.TextChanged += new System.EventHandler(this.textBoxEditableDirPath_TextChanged);
            this.textBoxEditableDirPath.KeyUp += new System.Windows.Forms.KeyEventHandler(this.TextBoxEditableDirPath_KeyUp);
            // 
            // groupBoxCurrentFolderName
            // 
            this.groupBoxCurrentFolderName.Controls.Add(this.panelCurrentFolderNameControls);
            this.groupBoxCurrentFolderName.Controls.Add(this.textBoxCurrentDirName);
            this.groupBoxCurrentFolderName.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxCurrentFolderName.Location = new System.Drawing.Point(0, 212);
            this.groupBoxCurrentFolderName.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.groupBoxCurrentFolderName.Name = "groupBoxCurrentFolderName";
            this.groupBoxCurrentFolderName.Padding = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.groupBoxCurrentFolderName.Size = new System.Drawing.Size(1451, 76);
            this.groupBoxCurrentFolderName.TabIndex = 9;
            this.groupBoxCurrentFolderName.TabStop = false;
            this.groupBoxCurrentFolderName.Text = "Current folder name";
            // 
            // panelCurrentFolderNameControls
            // 
            this.panelCurrentFolderNameControls.Controls.Add(this.buttonCurrentFolderOpts);
            this.panelCurrentFolderNameControls.Controls.Add(this.expandCollapseNavigationPanelsUserControl);
            this.panelCurrentFolderNameControls.Controls.Add(this.buttonCopyCurrentFolderNameToClipboard);
            this.panelCurrentFolderNameControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelCurrentFolderNameControls.Location = new System.Drawing.Point(4, 42);
            this.panelCurrentFolderNameControls.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.panelCurrentFolderNameControls.Name = "panelCurrentFolderNameControls";
            this.panelCurrentFolderNameControls.Size = new System.Drawing.Size(1443, 30);
            this.panelCurrentFolderNameControls.TabIndex = 6;
            // 
            // buttonCurrentFolderOpts
            // 
            this.buttonCurrentFolderOpts.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCurrentFolderOpts.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.options_icon_16x16;
            this.buttonCurrentFolderOpts.Location = new System.Drawing.Point(37, 1);
            this.buttonCurrentFolderOpts.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonCurrentFolderOpts.Name = "buttonCurrentFolderOpts";
            this.buttonCurrentFolderOpts.Size = new System.Drawing.Size(37, 27);
            this.buttonCurrentFolderOpts.TabIndex = 7;
            this.buttonCurrentFolderOpts.UseVisualStyleBackColor = true;
            this.buttonCurrentFolderOpts.Click += new System.EventHandler(this.ButtonCurrentFolderOpts_Click);
            // 
            // expandCollapseNavigationPanelsUserControl
            // 
            this.expandCollapseNavigationPanelsUserControl.IsExpanded = false;
            this.expandCollapseNavigationPanelsUserControl.Location = new System.Drawing.Point(4, 1);
            this.expandCollapseNavigationPanelsUserControl.Margin = new System.Windows.Forms.Padding(5, 3, 5, 3);
            this.expandCollapseNavigationPanelsUserControl.Name = "expandCollapseNavigationPanelsUserControl";
            this.expandCollapseNavigationPanelsUserControl.Size = new System.Drawing.Size(38, 27);
            this.expandCollapseNavigationPanelsUserControl.TabIndex = 6;
            this.expandCollapseNavigationPanelsUserControl.StateChanged += new System.Action<bool>(this.ExpandCollapseNavigationPanelsUserControl_StateChanged);
            // 
            // buttonCopyCurrentFolderNameToClipboard
            // 
            this.buttonCopyCurrentFolderNameToClipboard.Cursor = System.Windows.Forms.Cursors.Hand;
            this.buttonCopyCurrentFolderNameToClipboard.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.clipboard_16x16;
            this.buttonCopyCurrentFolderNameToClipboard.Location = new System.Drawing.Point(75, 1);
            this.buttonCopyCurrentFolderNameToClipboard.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.buttonCopyCurrentFolderNameToClipboard.Name = "buttonCopyCurrentFolderNameToClipboard";
            this.buttonCopyCurrentFolderNameToClipboard.Size = new System.Drawing.Size(37, 27);
            this.buttonCopyCurrentFolderNameToClipboard.TabIndex = 5;
            this.buttonCopyCurrentFolderNameToClipboard.UseVisualStyleBackColor = true;
            this.buttonCopyCurrentFolderNameToClipboard.Click += new System.EventHandler(this.buttonCopyCurrentFolderNameToClipboard_Click);
            // 
            // textBoxCurrentDirName
            // 
            this.textBoxCurrentDirName.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxCurrentDirName.Location = new System.Drawing.Point(4, 19);
            this.textBoxCurrentDirName.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.textBoxCurrentDirName.Name = "textBoxCurrentDirName";
            this.textBoxCurrentDirName.ReadOnly = true;
            this.textBoxCurrentDirName.Size = new System.Drawing.Size(1443, 23);
            this.textBoxCurrentDirName.TabIndex = 3;
            // 
            // fsEntriesSplitContainer
            // 
            this.fsEntriesSplitContainer.Dock = System.Windows.Forms.DockStyle.Top;
            this.fsEntriesSplitContainer.Location = new System.Drawing.Point(0, 288);
            this.fsEntriesSplitContainer.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.fsEntriesSplitContainer.MinimumSize = new System.Drawing.Size(0, 1858);
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
            this.fsEntriesSplitContainer.Size = new System.Drawing.Size(1451, 1858);
            this.fsEntriesSplitContainer.SplitterDistance = 923;
            this.fsEntriesSplitContainer.SplitterWidth = 5;
            this.fsEntriesSplitContainer.TabIndex = 10;
            // 
            // fsDirectoryEntriesGridUserControl
            // 
            this.fsDirectoryEntriesGridUserControl.AutoScroll = true;
            this.fsDirectoryEntriesGridUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.fsDirectoryEntriesGridUserControl.Location = new System.Drawing.Point(0, 0);
            this.fsDirectoryEntriesGridUserControl.Margin = new System.Windows.Forms.Padding(5, 3, 5, 3);
            this.fsDirectoryEntriesGridUserControl.Name = "fsDirectoryEntriesGridUserControl";
            this.fsDirectoryEntriesGridUserControl.Size = new System.Drawing.Size(1451, 923);
            this.fsDirectoryEntriesGridUserControl.TabIndex = 0;
            // 
            // fsFileEntriesGridUserControl
            // 
            this.fsFileEntriesGridUserControl.AutoScroll = true;
            this.fsFileEntriesGridUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.fsFileEntriesGridUserControl.Location = new System.Drawing.Point(0, 0);
            this.fsFileEntriesGridUserControl.Margin = new System.Windows.Forms.Padding(5, 3, 5, 3);
            this.fsFileEntriesGridUserControl.Name = "fsFileEntriesGridUserControl";
            this.fsFileEntriesGridUserControl.Size = new System.Drawing.Size(1451, 930);
            this.fsFileEntriesGridUserControl.TabIndex = 1;
            // 
            // FsExplorerPageUserControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoScroll = true;
            this.Controls.Add(this.fsEntriesSplitContainer);
            this.Controls.Add(this.groupBoxCurrentFolderName);
            this.Controls.Add(this.groupBoxEditableDirPath);
            this.Controls.Add(this.groupBoxPath);
            this.Controls.Add(this.groupBoxVPath);
            this.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.MinimumSize = new System.Drawing.Size(0, 2308);
            this.Name = "FsExplorerPageUserControl";
            this.Size = new System.Drawing.Size(1451, 2308);
            this.Load += new System.EventHandler(this.FsExplorerPageUserControl_Load);
            this.groupBoxVPath.ResumeLayout(false);
            this.groupBoxVPath.PerformLayout();
            this.groupBoxPath.ResumeLayout(false);
            this.currentDirPathPanel.ResumeLayout(false);
            this.currentDirPathPanel.PerformLayout();
            this.navigationPanel.ResumeLayout(false);
            this.groupBoxEditableDirPath.ResumeLayout(false);
            this.panelEditableDirPathControls.ResumeLayout(false);
            this.panelEditableDirPath.ResumeLayout(false);
            this.panelEditableDirPath.PerformLayout();
            this.groupBoxCurrentFolderName.ResumeLayout(false);
            this.groupBoxCurrentFolderName.PerformLayout();
            this.panelCurrentFolderNameControls.ResumeLayout(false);
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
        private System.Windows.Forms.GroupBox groupBoxEditableDirPath;
        private System.Windows.Forms.Panel panelEditableDirPathControls;
        private System.Windows.Forms.Panel panelEditableDirPath;
        private System.Windows.Forms.TextBox textBoxEditableDirPath;
        private System.Windows.Forms.GroupBox groupBoxCurrentFolderName;
        private System.Windows.Forms.TextBox textBoxCurrentDirName;
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
        private System.Windows.Forms.Button buttonCopyEditableDirPathToClipboard;
        private System.Windows.Forms.Button buttonEditableDirPathUndoChanges;
        private System.Windows.Forms.Button buttonReloadCurrentDirPath;
        private System.Windows.Forms.Button buttonCopyCurrentFolderNameToClipboard;
        private ExpandCollapseUserControl expandCollapseNavigationPanelsUserControl;
        private System.Windows.Forms.Button buttonCurrentFolderOpts;
    }
}
