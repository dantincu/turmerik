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
            statusStripMain = new StatusStrip();
            toolStripStatusLabelMain = new ToolStripStatusLabel();
            tabControlMain = new TabControl();
            tabPageTextUtils = new TabPage();
            textUtilsUC = new UserControls.TextUtilsUC();
            menuStrip1 = new MenuStrip();
            helpToolStripMenuItem = new ToolStripMenuItem();
            toolStripMenuItemShowHints = new ToolStripMenuItem();
            toolStripComboBoxShowHints = new ToolStripComboBox();
            statusStripMain.SuspendLayout();
            tabControlMain.SuspendLayout();
            tabPageTextUtils.SuspendLayout();
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
            // menuStrip1
            // 
            menuStrip1.Items.AddRange(new ToolStripItem[] { helpToolStripMenuItem });
            menuStrip1.Location = new Point(0, 0);
            menuStrip1.Name = "menuStrip1";
            menuStrip1.Size = new Size(1800, 24);
            menuStrip1.TabIndex = 3;
            menuStrip1.Text = "menuStrip1";
            // 
            // helpToolStripMenuItem
            // 
            helpToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { toolStripMenuItemShowHints });
            helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            helpToolStripMenuItem.Size = new Size(44, 20);
            helpToolStripMenuItem.Text = "&Help";
            // 
            // toolStripMenuItemShowHints
            // 
            toolStripMenuItemShowHints.DropDownItems.AddRange(new ToolStripItem[] { toolStripComboBoxShowHints });
            toolStripMenuItemShowHints.Name = "toolStripMenuItemShowHints";
            toolStripMenuItemShowHints.Size = new Size(134, 22);
            toolStripMenuItemShowHints.Text = "Show &Hints";
            // 
            // toolStripComboBoxShowHints
            // 
            toolStripComboBoxShowHints.DropDownStyle = ComboBoxStyle.DropDownList;
            toolStripComboBoxShowHints.Name = "toolStripComboBoxShowHints";
            toolStripComboBoxShowHints.Size = new Size(100, 23);
            toolStripComboBoxShowHints.SelectedIndexChanged += ToolStripComboBoxShowHints_SelectedIndexChanged;
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
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Turmerik Utility";
            Load += MainForm_Load;
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            tabControlMain.ResumeLayout(false);
            tabPageTextUtils.ResumeLayout(false);
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
    }
}
