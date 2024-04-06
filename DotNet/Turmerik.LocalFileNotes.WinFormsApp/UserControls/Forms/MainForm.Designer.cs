namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls.Forms
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
            menuStripMain = new MenuStrip();
            helpToolStripMenuItem = new ToolStripMenuItem();
            showHintsToolStripMenuItem = new ToolStripMenuItem();
            toolStripComboBoxShowHints = new ToolStripComboBox();
            startAppRecoveryToolToolStripMenuItem = new ToolStripMenuItem();
            statusStripMain.SuspendLayout();
            menuStripMain.SuspendLayout();
            SuspendLayout();
            // 
            // statusStripMain
            // 
            statusStripMain.Items.AddRange(new ToolStripItem[] { toolStripStatusLabelMain });
            statusStripMain.Location = new Point(0, 878);
            statusStripMain.Name = "statusStripMain";
            statusStripMain.Size = new Size(1800, 22);
            statusStripMain.TabIndex = 2;
            // 
            // toolStripStatusLabelMain
            // 
            toolStripStatusLabelMain.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            toolStripStatusLabelMain.Name = "toolStripStatusLabelMain";
            toolStripStatusLabelMain.Size = new Size(0, 17);
            // 
            // menuStripMain
            // 
            menuStripMain.Items.AddRange(new ToolStripItem[] { helpToolStripMenuItem });
            menuStripMain.Location = new Point(0, 0);
            menuStripMain.Name = "menuStripMain";
            menuStripMain.Size = new Size(1800, 24);
            menuStripMain.TabIndex = 3;
            menuStripMain.Text = "menuStrip1";
            // 
            // helpToolStripMenuItem
            // 
            helpToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { showHintsToolStripMenuItem, startAppRecoveryToolToolStripMenuItem });
            helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            helpToolStripMenuItem.Size = new Size(44, 20);
            helpToolStripMenuItem.Text = "&Help";
            // 
            // showHintsToolStripMenuItem
            // 
            showHintsToolStripMenuItem.DropDownItems.AddRange(new ToolStripItem[] { toolStripComboBoxShowHints });
            showHintsToolStripMenuItem.Name = "showHintsToolStripMenuItem";
            showHintsToolStripMenuItem.Size = new Size(199, 22);
            showHintsToolStripMenuItem.Text = "Show &Hints";
            // 
            // toolStripComboBoxShowHints
            // 
            toolStripComboBoxShowHints.Name = "toolStripComboBoxShowHints";
            toolStripComboBoxShowHints.Size = new Size(121, 23);
            toolStripComboBoxShowHints.SelectedIndexChanged += ToolStripComboBoxShowHints_SelectedIndexChanged;
            // 
            // startAppRecoveryToolToolStripMenuItem
            // 
            startAppRecoveryToolToolStripMenuItem.Name = "startAppRecoveryToolToolStripMenuItem";
            startAppRecoveryToolToolStripMenuItem.Size = new Size(199, 22);
            startAppRecoveryToolToolStripMenuItem.Text = "Start App Recovery Tool";
            startAppRecoveryToolToolStripMenuItem.Click += StartAppRecoveryToolToolStripMenuItem_Click;
            // 
            // MainForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1800, 900);
            Controls.Add(statusStripMain);
            Controls.Add(menuStripMain);
            Icon = (Icon)resources.GetObject("$this.Icon");
            MainMenuStrip = menuStripMain;
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Turmerik Local File Notes";
            Load += MainForm_Load;
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            menuStripMain.ResumeLayout(false);
            menuStripMain.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private StatusStrip statusStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
        private MenuStrip menuStripMain;
        private ToolStripMenuItem helpToolStripMenuItem;
        private ToolStripMenuItem showHintsToolStripMenuItem;
        private ToolStripMenuItem startAppRecoveryToolToolStripMenuItem;
        private ToolStripComboBox toolStripComboBoxShowHints;
    }
}
