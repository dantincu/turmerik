namespace Turmerik.Utility.WinFormsApp
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            statusStripMain = new StatusStrip();
            toolStripStatusLabelMain = new ToolStripStatusLabel();
            tabControlMain = new TabControl();
            tabPageTextUtils = new TabPage();
            textUtilsUC = new UserControls.TextUtilsUC();
            tabPageCloneables = new TabPage();
            menuStrip1 = new MenuStrip();
            actionsToolStripMenuItem = new ToolStripMenuItem();
            goToWebResourceUrlToolStripMenuItem = new ToolStripMenuItem();
            goToMarkdownSourceTextToolStripMenuItem = new ToolStripMenuItem();
            goToMarkdownResultTextToolStripMenuItem = new ToolStripMenuItem();
            helpToolStripMenuItem = new ToolStripMenuItem();
            toolStripMenuItemShowHints = new ToolStripMenuItem();
            toolStripComboBoxShowHints = new ToolStripComboBox();
            startAppRecoveryToolToolStripMenuItem = new ToolStripMenuItem();
            cloneablesUC = new UserControls.CloneablesUC();
            statusStripMain.SuspendLayout();
            tabControlMain.SuspendLayout();
            tabPageTextUtils.SuspendLayout();
            tabPageCloneables.SuspendLayout();
            menuStrip1.SuspendLayout();
            SuspendLayout();
            // 
            // statusStripMain
            // 
            statusStripMain.Items.AddRange(new ToolStripItem[] { toolStripStatusLabelMain });
            statusStripMain.Location = new Point(0, 878);
            statusStripMain.Name = "statusStripMain";
            statusStripMain.Size = new Size(1800, 22);
            statusStripMain.TabIndex = 1;
            // 
            // toolStripStatusLabelMain
            // 
            toolStripStatusLabelMain.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            toolStripStatusLabelMain.Name = "toolStripStatusLabelMain";
            toolStripStatusLabelMain.Size = new Size(0, 17);
            // 
            // tabControlMain
            // 
            tabControlMain.Controls.Add(tabPageTextUtils);
            tabControlMain.Controls.Add(tabPageCloneables);
            tabControlMain.Dock = DockStyle.Fill;
            tabControlMain.Font = new Font("Arial", 10F, FontStyle.Bold, GraphicsUnit.Point, 0);
            tabControlMain.Location = new Point(0, 24);
            tabControlMain.Name = "tabControlMain";
            tabControlMain.SelectedIndex = 0;
            tabControlMain.Size = new Size(1800, 854);
            tabControlMain.TabIndex = 2;
            // 
            // tabPageTextUtils
            // 
            tabPageTextUtils.Controls.Add(textUtilsUC);
            tabPageTextUtils.Location = new Point(4, 25);
            tabPageTextUtils.Name = "tabPageTextUtils";
            tabPageTextUtils.Padding = new Padding(3);
            tabPageTextUtils.Size = new Size(1792, 825);
            tabPageTextUtils.TabIndex = 0;
            tabPageTextUtils.Text = "Text Utils";
            tabPageTextUtils.UseVisualStyleBackColor = true;
            // 
            // textUtilsUC
            // 
            textUtilsUC.Dock = DockStyle.Fill;
            textUtilsUC.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            textUtilsUC.Location = new Point(3, 3);
            textUtilsUC.Name = "textUtilsUC";
            textUtilsUC.Size = new Size(1786, 819);
            textUtilsUC.TabIndex = 0;
            // 
            // tabPageCloneables
            // 
            tabPageCloneables.Controls.Add(cloneablesUC);
            tabPageCloneables.Location = new Point(4, 25);
            tabPageCloneables.Name = "tabPageCloneables";
            tabPageCloneables.Size = new Size(1792, 825);
            tabPageCloneables.TabIndex = 1;
            tabPageCloneables.Text = "Cloneables";
            tabPageCloneables.UseVisualStyleBackColor = true;
            // 
            // menuStrip1
            // 
            menuStrip1.Items.AddRange(new ToolStripItem[] { actionsToolStripMenuItem, helpToolStripMenuItem });
            menuStrip1.Location = new Point(0, 0);
            menuStrip1.Name = "menuStrip1";
            menuStrip1.Size = new Size(1800, 24);
            menuStrip1.TabIndex = 3;
            menuStrip1.Text = "menuStrip1";
            // 
            // actionsToolStripMenuItem
            // 
            actionsToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { goToWebResourceUrlToolStripMenuItem, goToMarkdownSourceTextToolStripMenuItem, goToMarkdownResultTextToolStripMenuItem });
            actionsToolStripMenuItem.Name = "actionsToolStripMenuItem";
            actionsToolStripMenuItem.Size = new Size(59, 20);
            actionsToolStripMenuItem.Text = "&Actions";
            // 
            // goToWebResourceUrlToolStripMenuItem
            // 
            goToWebResourceUrlToolStripMenuItem.Name = "goToWebResourceUrlToolStripMenuItem";
            goToWebResourceUrlToolStripMenuItem.Size = new Size(227, 22);
            goToWebResourceUrlToolStripMenuItem.Text = "Go To &Web Resource Url";
            goToWebResourceUrlToolStripMenuItem.Click += GoToWebResourceUrlToolStripMenuItem_Click;
            // 
            // goToMarkdownSourceTextToolStripMenuItem
            // 
            goToMarkdownSourceTextToolStripMenuItem.Name = "goToMarkdownSourceTextToolStripMenuItem";
            goToMarkdownSourceTextToolStripMenuItem.Size = new Size(227, 22);
            goToMarkdownSourceTextToolStripMenuItem.Text = "Go To Markdown &Source Text";
            goToMarkdownSourceTextToolStripMenuItem.Click += GoToMarkdownSourceTextToolStripMenuItem_Click;
            // 
            // goToMarkdownResultTextToolStripMenuItem
            // 
            goToMarkdownResultTextToolStripMenuItem.Name = "goToMarkdownResultTextToolStripMenuItem";
            goToMarkdownResultTextToolStripMenuItem.Size = new Size(227, 22);
            goToMarkdownResultTextToolStripMenuItem.Text = "Go To Markdown &Result Text";
            goToMarkdownResultTextToolStripMenuItem.Click += GoToMarkdownResultTextToolStripMenuItem_Click;
            // 
            // helpToolStripMenuItem
            // 
            helpToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { toolStripMenuItemShowHints, startAppRecoveryToolToolStripMenuItem });
            helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            helpToolStripMenuItem.Size = new Size(44, 20);
            helpToolStripMenuItem.Text = "&Help";
            // 
            // toolStripMenuItemShowHints
            // 
            toolStripMenuItemShowHints.DropDownItems.AddRange(new ToolStripItem[] { toolStripComboBoxShowHints });
            toolStripMenuItemShowHints.Name = "toolStripMenuItemShowHints";
            toolStripMenuItemShowHints.Size = new Size(199, 22);
            toolStripMenuItemShowHints.Text = "Show &Hints";
            // 
            // toolStripComboBoxShowHints
            // 
            toolStripComboBoxShowHints.DropDownStyle = ComboBoxStyle.DropDownList;
            toolStripComboBoxShowHints.Name = "toolStripComboBoxShowHints";
            toolStripComboBoxShowHints.Size = new Size(100, 23);
            toolStripComboBoxShowHints.SelectedIndexChanged += ToolStripComboBoxShowHints_SelectedIndexChanged;
            // 
            // startAppRecoveryToolToolStripMenuItem
            // 
            startAppRecoveryToolToolStripMenuItem.Name = "startAppRecoveryToolToolStripMenuItem";
            startAppRecoveryToolToolStripMenuItem.Size = new Size(199, 22);
            startAppRecoveryToolToolStripMenuItem.Text = "Start App Recovery Tool";
            startAppRecoveryToolToolStripMenuItem.Click += StartAppRecoveryToolToolStripMenuItem_Click;
            // 
            // cloneablesUC
            // 
            cloneablesUC.Dock = DockStyle.Fill;
            cloneablesUC.Location = new Point(0, 0);
            cloneablesUC.Name = "cloneablesUC";
            cloneablesUC.Size = new Size(1792, 825);
            cloneablesUC.TabIndex = 0;
            // 
            // MainForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1800, 900);
            Controls.Add(tabControlMain);
            Controls.Add(statusStripMain);
            Controls.Add(menuStrip1);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Turmerik Utility";
            Load += MainForm_Load;
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            tabControlMain.ResumeLayout(false);
            tabPageTextUtils.ResumeLayout(false);
            tabPageCloneables.ResumeLayout(false);
            menuStrip1.ResumeLayout(false);
            menuStrip1.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private StatusStrip statusStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
        private TabControl tabControlMain;
        private TabPage tabPageTextUtils;
        private UserControls.TextUtilsUC textUtilsUC;
        private MenuStrip menuStrip1;
        private ToolStripMenuItem helpToolStripMenuItem;
        private ToolStripMenuItem toolStripMenuItemShowHints;
        private ToolStripComboBox toolStripComboBoxShowHints;
        private ToolStripMenuItem startAppRecoveryToolToolStripMenuItem;
        private ToolStripMenuItem actionsToolStripMenuItem;
        private ToolStripMenuItem goToWebResourceUrlToolStripMenuItem;
        private ToolStripMenuItem goToMarkdownSourceTextToolStripMenuItem;
        private ToolStripMenuItem goToMarkdownResultTextToolStripMenuItem;
        private TabPage tabPageCloneables;
        private UserControls.CloneablesUC cloneablesUC;
    }
}
