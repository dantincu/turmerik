namespace Turmerik.FsUtils.WinForms.App
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
            this.textBoxPath = new System.Windows.Forms.TextBox();
            this.groupBoxPath = new System.Windows.Forms.GroupBox();
            this.groupBoxVPath = new System.Windows.Forms.GroupBox();
            this.textBoxVPath = new System.Windows.Forms.TextBox();
            this.mainTabControl = new System.Windows.Forms.TabControl();
            this.mainTabPage = new System.Windows.Forms.TabPage();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.toolStripStatusLabel = new System.Windows.Forms.ToolStripStatusLabel();
            this.uiMessagesTabPage = new System.Windows.Forms.TabPage();
            this.uiMessagesFlowLayoutPanel = new System.Windows.Forms.FlowLayoutPanel();
            this.fsEntriesSplitContainer = new System.Windows.Forms.SplitContainer();
            this.fsDirectoryEntriesGridUserControl = new Turmerik.FsUtils.WinForms.App.FsEntriesGridUserControl();
            this.fsFileEntriesGridUserControl = new Turmerik.FsUtils.WinForms.App.FsEntriesGridUserControl();
            this.groupBoxPath.SuspendLayout();
            this.groupBoxVPath.SuspendLayout();
            this.mainTabControl.SuspendLayout();
            this.mainTabPage.SuspendLayout();
            this.statusStrip.SuspendLayout();
            this.uiMessagesTabPage.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.fsEntriesSplitContainer)).BeginInit();
            this.fsEntriesSplitContainer.Panel1.SuspendLayout();
            this.fsEntriesSplitContainer.Panel2.SuspendLayout();
            this.fsEntriesSplitContainer.SuspendLayout();
            this.SuspendLayout();
            // 
            // textBoxPath
            // 
            this.textBoxPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxPath.Location = new System.Drawing.Point(3, 16);
            this.textBoxPath.Name = "textBoxPath";
            this.textBoxPath.ReadOnly = true;
            this.textBoxPath.Size = new System.Drawing.Size(763, 20);
            this.textBoxPath.TabIndex = 2;
            // 
            // groupBoxPath
            // 
            this.groupBoxPath.Controls.Add(this.textBoxPath);
            this.groupBoxPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxPath.Location = new System.Drawing.Point(3, 42);
            this.groupBoxPath.Name = "groupBoxPath";
            this.groupBoxPath.Size = new System.Drawing.Size(769, 39);
            this.groupBoxPath.TabIndex = 3;
            this.groupBoxPath.TabStop = false;
            this.groupBoxPath.Text = "Path";
            // 
            // groupBoxVPath
            // 
            this.groupBoxVPath.Controls.Add(this.textBoxVPath);
            this.groupBoxVPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxVPath.Location = new System.Drawing.Point(3, 3);
            this.groupBoxVPath.Name = "groupBoxVPath";
            this.groupBoxVPath.Size = new System.Drawing.Size(769, 39);
            this.groupBoxVPath.TabIndex = 4;
            this.groupBoxVPath.TabStop = false;
            this.groupBoxVPath.Text = "VPath";
            // 
            // textBoxVPath
            // 
            this.textBoxVPath.Dock = System.Windows.Forms.DockStyle.Top;
            this.textBoxVPath.Location = new System.Drawing.Point(3, 16);
            this.textBoxVPath.Name = "textBoxVPath";
            this.textBoxVPath.ReadOnly = true;
            this.textBoxVPath.Size = new System.Drawing.Size(763, 20);
            this.textBoxVPath.TabIndex = 2;
            // 
            // mainTabControl
            // 
            this.mainTabControl.Controls.Add(this.mainTabPage);
            this.mainTabControl.Controls.Add(this.uiMessagesTabPage);
            this.mainTabControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.mainTabControl.Location = new System.Drawing.Point(0, 0);
            this.mainTabControl.Name = "mainTabControl";
            this.mainTabControl.SelectedIndex = 0;
            this.mainTabControl.Size = new System.Drawing.Size(800, 686);
            this.mainTabControl.TabIndex = 5;
            // 
            // mainTabPage
            // 
            this.mainTabPage.AutoScroll = true;
            this.mainTabPage.Controls.Add(this.fsEntriesSplitContainer);
            this.mainTabPage.Controls.Add(this.statusStrip);
            this.mainTabPage.Controls.Add(this.groupBoxPath);
            this.mainTabPage.Controls.Add(this.groupBoxVPath);
            this.mainTabPage.Location = new System.Drawing.Point(4, 22);
            this.mainTabPage.Name = "mainTabPage";
            this.mainTabPage.Padding = new System.Windows.Forms.Padding(3);
            this.mainTabPage.Size = new System.Drawing.Size(792, 660);
            this.mainTabPage.TabIndex = 0;
            this.mainTabPage.Text = "Current folder";
            this.mainTabPage.UseVisualStyleBackColor = true;
            // 
            // statusStrip
            // 
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripStatusLabel});
            this.statusStrip.Location = new System.Drawing.Point(3, 1681);
            this.statusStrip.Name = "statusStrip";
            this.statusStrip.Size = new System.Drawing.Size(769, 22);
            this.statusStrip.TabIndex = 5;
            // 
            // toolStripStatusLabel
            // 
            this.toolStripStatusLabel.Name = "toolStripStatusLabel";
            this.toolStripStatusLabel.Size = new System.Drawing.Size(39, 17);
            this.toolStripStatusLabel.Text = "Status";
            // 
            // uiMessagesTabPage
            // 
            this.uiMessagesTabPage.Controls.Add(this.uiMessagesFlowLayoutPanel);
            this.uiMessagesTabPage.Location = new System.Drawing.Point(4, 22);
            this.uiMessagesTabPage.Name = "uiMessagesTabPage";
            this.uiMessagesTabPage.Padding = new System.Windows.Forms.Padding(3);
            this.uiMessagesTabPage.Size = new System.Drawing.Size(792, 424);
            this.uiMessagesTabPage.TabIndex = 1;
            this.uiMessagesTabPage.Text = "Notifications";
            this.uiMessagesTabPage.UseVisualStyleBackColor = true;
            // 
            // uiMessagesFlowLayoutPanel
            // 
            this.uiMessagesFlowLayoutPanel.AutoScroll = true;
            this.uiMessagesFlowLayoutPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.uiMessagesFlowLayoutPanel.FlowDirection = System.Windows.Forms.FlowDirection.BottomUp;
            this.uiMessagesFlowLayoutPanel.Location = new System.Drawing.Point(3, 3);
            this.uiMessagesFlowLayoutPanel.Name = "uiMessagesFlowLayoutPanel";
            this.uiMessagesFlowLayoutPanel.Size = new System.Drawing.Size(786, 418);
            this.uiMessagesFlowLayoutPanel.TabIndex = 0;
            this.uiMessagesFlowLayoutPanel.WrapContents = false;
            // 
            // fsEntriesSplitContainer
            // 
            this.fsEntriesSplitContainer.Dock = System.Windows.Forms.DockStyle.Top;
            this.fsEntriesSplitContainer.IsSplitterFixed = true;
            this.fsEntriesSplitContainer.Location = new System.Drawing.Point(3, 81);
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
            this.fsEntriesSplitContainer.Size = new System.Drawing.Size(769, 1600);
            this.fsEntriesSplitContainer.SplitterDistance = 800;
            this.fsEntriesSplitContainer.TabIndex = 6;
            // 
            // fsDirectoryEntriesGridUserControl
            // 
            this.fsDirectoryEntriesGridUserControl.AutoScroll = true;
            this.fsDirectoryEntriesGridUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.fsDirectoryEntriesGridUserControl.Location = new System.Drawing.Point(0, 0);
            this.fsDirectoryEntriesGridUserControl.Name = "fsDirectoryEntriesGridUserControl";
            this.fsDirectoryEntriesGridUserControl.Size = new System.Drawing.Size(769, 800);
            this.fsDirectoryEntriesGridUserControl.TabIndex = 0;
            // 
            // fsFileEntriesGridUserControl
            // 
            this.fsFileEntriesGridUserControl.AutoScroll = true;
            this.fsFileEntriesGridUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.fsFileEntriesGridUserControl.Location = new System.Drawing.Point(0, 0);
            this.fsFileEntriesGridUserControl.Name = "fsFileEntriesGridUserControl";
            this.fsFileEntriesGridUserControl.Size = new System.Drawing.Size(769, 796);
            this.fsFileEntriesGridUserControl.TabIndex = 0;
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 686);
            this.Controls.Add(this.mainTabControl);
            this.Name = "MainForm";
            this.Text = "Turmerik FS Utils";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.Load += new System.EventHandler(this.MainForm_Load);
            this.groupBoxPath.ResumeLayout(false);
            this.groupBoxPath.PerformLayout();
            this.groupBoxVPath.ResumeLayout(false);
            this.groupBoxVPath.PerformLayout();
            this.mainTabControl.ResumeLayout(false);
            this.mainTabPage.ResumeLayout(false);
            this.mainTabPage.PerformLayout();
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.uiMessagesTabPage.ResumeLayout(false);
            this.fsEntriesSplitContainer.Panel1.ResumeLayout(false);
            this.fsEntriesSplitContainer.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.fsEntriesSplitContainer)).EndInit();
            this.fsEntriesSplitContainer.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.TextBox textBoxPath;
        private System.Windows.Forms.GroupBox groupBoxPath;
        private System.Windows.Forms.GroupBox groupBoxVPath;
        private System.Windows.Forms.TextBox textBoxVPath;
        private System.Windows.Forms.TabControl mainTabControl;
        private System.Windows.Forms.TabPage mainTabPage;
        private System.Windows.Forms.TabPage uiMessagesTabPage;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.FlowLayoutPanel uiMessagesFlowLayoutPanel;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel;
        private System.Windows.Forms.SplitContainer fsEntriesSplitContainer;
        private FsEntriesGridUserControl fsDirectoryEntriesGridUserControl;
        private FsEntriesGridUserControl fsFileEntriesGridUserControl;
    }
}

