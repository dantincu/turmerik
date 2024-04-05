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
            components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            statusStripMain = new StatusStrip();
            toolStripStatusLabelMain = new ToolStripStatusLabel();
            contextMenuStripMain = new ContextMenuStrip(components);
            openToolStripMenuItem1 = new ToolStripMenuItem();
            statusStripMain.SuspendLayout();
            contextMenuStripMain.SuspendLayout();
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
            // toolStripStatusLabelMain
            // 
            toolStripStatusLabelMain.Name = "toolStripStatusLabelMain";
            toolStripStatusLabelMain.Size = new Size(0, 17);
            // 
            // contextMenuStripMain
            // 
            contextMenuStripMain.Items.AddRange(new ToolStripItem[] { openToolStripMenuItem1 });
            contextMenuStripMain.Name = "contextMenuStripMain";
            contextMenuStripMain.Size = new Size(181, 48);
            // 
            // openToolStripMenuItem1
            // 
            openToolStripMenuItem1.Name = "openToolStripMenuItem1";
            openToolStripMenuItem1.Size = new Size(180, 22);
            openToolStripMenuItem1.Text = "&Open";
            // 
            // MainForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1800, 900);
            Controls.Add(statusStripMain);
            DrawerShowIconsWhenHidden = true;
            Icon = (Icon)resources.GetObject("$this.Icon");
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Turmerik Local File Notes";
            Load += MainForm_Load;
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            contextMenuStripMain.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private StatusStrip statusStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
        private ToolStripMenuItem openToolStripMenuItem;
        private ContextMenuStrip contextMenuStripMain;
        private ToolStripMenuItem openToolStripMenuItem1;
    }
}
