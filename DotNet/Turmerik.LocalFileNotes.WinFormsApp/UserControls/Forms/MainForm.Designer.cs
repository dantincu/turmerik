namespace Turmerik.LocalFileNotes.WinFormsApp
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
            menuStripMain = new MenuStrip();
            toolStripStatusLabelMain = new ToolStripStatusLabel();
            statusStripMain.SuspendLayout();
            SuspendLayout();
            // 
            // statusStripMain
            // 
            statusStripMain.Items.AddRange(new ToolStripItem[] { toolStripStatusLabelMain });
            statusStripMain.Location = new Point(3, 875);
            statusStripMain.Name = "statusStripMain";
            statusStripMain.Size = new Size(1794, 22);
            statusStripMain.TabIndex = 0;
            statusStripMain.Text = "asdfsadf";
            // 
            // menuStripMain
            // 
            menuStripMain.Location = new Point(3, 64);
            menuStripMain.Name = "menuStripMain";
            menuStripMain.Size = new Size(1794, 24);
            menuStripMain.TabIndex = 1;
            menuStripMain.Text = "menuStrip1";
            // 
            // toolStripStatusLabelMain
            // 
            toolStripStatusLabelMain.Name = "toolStripStatusLabelMain";
            toolStripStatusLabelMain.Size = new Size(0, 17);
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
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private StatusStrip statusStripMain;
        private MenuStrip menuStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
    }
}
