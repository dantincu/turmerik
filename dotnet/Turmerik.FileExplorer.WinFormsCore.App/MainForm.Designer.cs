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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.mainTabControl = new System.Windows.Forms.TabControl();
            this.mainTabPage = new System.Windows.Forms.TabPage();
            this.tabControlFsExplorer = new System.Windows.Forms.TabControl();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.toolStripStatusLabel = new System.Windows.Forms.ToolStripStatusLabel();
            this.topMenuStrip = new System.Windows.Forms.MenuStrip();
            this.uiMessagesTabPage = new System.Windows.Forms.TabPage();
            this.toolStripMenuItemGoToRoot = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItemAddNewTab = new System.Windows.Forms.ToolStripMenuItem();
            this.ToolStripMenuItemCloseCurrentTab = new System.Windows.Forms.ToolStripMenuItem();
            this.uiMessagesUserControl = new Turmerik.FsUtils.WinForms.App.UIMessagesUserControl();
            this.mainTabControl.SuspendLayout();
            this.mainTabPage.SuspendLayout();
            this.statusStrip.SuspendLayout();
            this.topMenuStrip.SuspendLayout();
            this.uiMessagesTabPage.SuspendLayout();
            this.SuspendLayout();
            // 
            // mainTabControl
            // 
            this.mainTabControl.Controls.Add(this.mainTabPage);
            this.mainTabControl.Controls.Add(this.uiMessagesTabPage);
            this.mainTabControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.mainTabControl.Location = new System.Drawing.Point(0, 0);
            this.mainTabControl.Name = "mainTabControl";
            this.mainTabControl.SelectedIndex = 0;
            this.mainTabControl.Size = new System.Drawing.Size(1340, 686);
            this.mainTabControl.TabIndex = 5;
            // 
            // mainTabPage
            // 
            this.mainTabPage.Controls.Add(this.tabControlFsExplorer);
            this.mainTabPage.Controls.Add(this.statusStrip);
            this.mainTabPage.Controls.Add(this.topMenuStrip);
            this.mainTabPage.Location = new System.Drawing.Point(4, 22);
            this.mainTabPage.Name = "mainTabPage";
            this.mainTabPage.Padding = new System.Windows.Forms.Padding(3);
            this.mainTabPage.Size = new System.Drawing.Size(1332, 660);
            this.mainTabPage.TabIndex = 0;
            this.mainTabPage.Text = "Explorer";
            this.mainTabPage.UseVisualStyleBackColor = true;
            // 
            // tabControlFsExplorer
            // 
            this.tabControlFsExplorer.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tabControlFsExplorer.Location = new System.Drawing.Point(3, 27);
            this.tabControlFsExplorer.Name = "tabControlFsExplorer";
            this.tabControlFsExplorer.SelectedIndex = 0;
            this.tabControlFsExplorer.Size = new System.Drawing.Size(1326, 608);
            this.tabControlFsExplorer.TabIndex = 6;
            this.tabControlFsExplorer.SelectedIndexChanged += new System.EventHandler(this.TabControlFsExplorer_SelectedIndexChanged);
            // 
            // statusStrip
            // 
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripStatusLabel});
            this.statusStrip.Location = new System.Drawing.Point(3, 635);
            this.statusStrip.Name = "statusStrip";
            this.statusStrip.Size = new System.Drawing.Size(1326, 22);
            this.statusStrip.TabIndex = 5;
            // 
            // toolStripStatusLabel
            // 
            this.toolStripStatusLabel.Name = "toolStripStatusLabel";
            this.toolStripStatusLabel.Size = new System.Drawing.Size(39, 17);
            this.toolStripStatusLabel.Text = "Status";
            // 
            // topMenuStrip
            // 
            this.topMenuStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripMenuItemGoToRoot,
            this.toolStripMenuItemAddNewTab,
            this.ToolStripMenuItemCloseCurrentTab});
            this.topMenuStrip.Location = new System.Drawing.Point(3, 3);
            this.topMenuStrip.Name = "topMenuStrip";
            this.topMenuStrip.Size = new System.Drawing.Size(1326, 24);
            this.topMenuStrip.TabIndex = 7;
            this.topMenuStrip.Text = "menuStrip1";
            // 
            // uiMessagesTabPage
            // 
            this.uiMessagesTabPage.Controls.Add(this.uiMessagesUserControl);
            this.uiMessagesTabPage.Location = new System.Drawing.Point(4, 22);
            this.uiMessagesTabPage.Name = "uiMessagesTabPage";
            this.uiMessagesTabPage.Padding = new System.Windows.Forms.Padding(3);
            this.uiMessagesTabPage.Size = new System.Drawing.Size(1332, 660);
            this.uiMessagesTabPage.TabIndex = 1;
            this.uiMessagesTabPage.Text = "Notifications";
            this.uiMessagesTabPage.UseVisualStyleBackColor = true;
            // 
            // toolStripMenuItemGoToRoot
            // 
            this.toolStripMenuItemGoToRoot.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.fw_slash_16x16;
            this.toolStripMenuItemGoToRoot.Name = "toolStripMenuItemGoToRoot";
            this.toolStripMenuItemGoToRoot.Size = new System.Drawing.Size(28, 20);
            this.toolStripMenuItemGoToRoot.Click += new System.EventHandler(this.toolStripMenuItemGoToRoot_Click);
            // 
            // toolStripMenuItemAddNewTab
            // 
            this.toolStripMenuItemAddNewTab.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);
            this.toolStripMenuItemAddNewTab.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.plus_icon_16x16;
            this.toolStripMenuItemAddNewTab.Name = "toolStripMenuItemAddNewTab";
            this.toolStripMenuItemAddNewTab.Size = new System.Drawing.Size(28, 20);
            this.toolStripMenuItemAddNewTab.Click += new System.EventHandler(this.ToolStripMenuItemAddNewTab_Click);
            // 
            // ToolStripMenuItemCloseCurrentTab
            // 
            this.ToolStripMenuItemCloseCurrentTab.Image = global::Turmerik.FileExplorer.WinFormsCore.App.Properties.Resources.times_16x16;
            this.ToolStripMenuItemCloseCurrentTab.Name = "ToolStripMenuItemCloseCurrentTab";
            this.ToolStripMenuItemCloseCurrentTab.Size = new System.Drawing.Size(28, 20);
            this.ToolStripMenuItemCloseCurrentTab.Click += new System.EventHandler(this.ToolStripMenuItemCloseCurrentTab_Click);
            // 
            // uiMessagesUserControl
            // 
            this.uiMessagesUserControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.uiMessagesUserControl.Location = new System.Drawing.Point(3, 3);
            this.uiMessagesUserControl.Name = "uiMessagesUserControl";
            this.uiMessagesUserControl.Size = new System.Drawing.Size(1326, 654);
            this.uiMessagesUserControl.TabIndex = 0;
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1340, 686);
            this.Controls.Add(this.mainTabControl);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.topMenuStrip;
            this.Name = "MainForm";
            this.Text = "Turmerik File System Explorer";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.Load += new System.EventHandler(this.MainForm_Load);
            this.mainTabControl.ResumeLayout(false);
            this.mainTabPage.ResumeLayout(false);
            this.mainTabPage.PerformLayout();
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.topMenuStrip.ResumeLayout(false);
            this.topMenuStrip.PerformLayout();
            this.uiMessagesTabPage.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.TabControl mainTabControl;
        private System.Windows.Forms.TabPage mainTabPage;
        private System.Windows.Forms.TabPage uiMessagesTabPage;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel;
        private System.Windows.Forms.TabControl tabControlFsExplorer;
        private UIMessagesUserControl uiMessagesUserControl;
        private System.Windows.Forms.MenuStrip topMenuStrip;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemAddNewTab;
        private System.Windows.Forms.ToolStripMenuItem ToolStripMenuItemCloseCurrentTab;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItemGoToRoot;
    }
}

