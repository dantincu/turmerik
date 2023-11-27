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
            tabPageFetchWebResource = new TabPage();
            tabPageMdLinesIndent = new TabPage();
            tabPageMdTableLines = new TabPage();
            fetchWebResourceUC = new UserControls.FetchWebResourceUC();
            mdLinesIndentUC = new UserControls.MdLinesIndentUC();
            mdTableLinesUC = new ViewModels.MdTableLinesUC();
            statusStripMain.SuspendLayout();
            tabControlMain.SuspendLayout();
            tabPageFetchWebResource.SuspendLayout();
            tabPageMdLinesIndent.SuspendLayout();
            tabPageMdTableLines.SuspendLayout();
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
            tabControlMain.Controls.Add(tabPageFetchWebResource);
            tabControlMain.Controls.Add(tabPageMdLinesIndent);
            tabControlMain.Controls.Add(tabPageMdTableLines);
            tabControlMain.Dock = DockStyle.Fill;
            tabControlMain.Location = new Point(0, 0);
            tabControlMain.Name = "tabControlMain";
            tabControlMain.SelectedIndex = 0;
            tabControlMain.Size = new Size(1800, 878);
            tabControlMain.TabIndex = 2;
            // 
            // tabPageFetchWebResource
            // 
            tabPageFetchWebResource.Controls.Add(fetchWebResourceUC);
            tabPageFetchWebResource.Location = new Point(4, 24);
            tabPageFetchWebResource.Name = "tabPageFetchWebResource";
            tabPageFetchWebResource.Padding = new Padding(3);
            tabPageFetchWebResource.Size = new Size(1792, 850);
            tabPageFetchWebResource.TabIndex = 0;
            tabPageFetchWebResource.Text = "Fetch Web Resource";
            tabPageFetchWebResource.UseVisualStyleBackColor = true;
            // 
            // tabPageMdLinesIndent
            // 
            tabPageMdLinesIndent.Controls.Add(mdLinesIndentUC);
            tabPageMdLinesIndent.Location = new Point(4, 24);
            tabPageMdLinesIndent.Name = "tabPageMdLinesIndent";
            tabPageMdLinesIndent.Padding = new Padding(3);
            tabPageMdLinesIndent.Size = new Size(1792, 850);
            tabPageMdLinesIndent.TabIndex = 1;
            tabPageMdLinesIndent.Text = "Md Lines Indent";
            tabPageMdLinesIndent.UseVisualStyleBackColor = true;
            // 
            // tabPageMdTableLines
            // 
            tabPageMdTableLines.Controls.Add(mdTableLinesUC);
            tabPageMdTableLines.Location = new Point(4, 24);
            tabPageMdTableLines.Name = "tabPageMdTableLines";
            tabPageMdTableLines.Padding = new Padding(3);
            tabPageMdTableLines.Size = new Size(1792, 850);
            tabPageMdTableLines.TabIndex = 2;
            tabPageMdTableLines.Text = "Md Table Lines";
            tabPageMdTableLines.UseVisualStyleBackColor = true;
            // 
            // fetchWebResourceUC
            // 
            fetchWebResourceUC.Dock = DockStyle.Fill;
            fetchWebResourceUC.Location = new Point(3, 3);
            fetchWebResourceUC.Name = "fetchWebResourceUC";
            fetchWebResourceUC.Size = new Size(1786, 844);
            fetchWebResourceUC.TabIndex = 0;
            // 
            // mdLinesIndentUC
            // 
            mdLinesIndentUC.Dock = DockStyle.Fill;
            mdLinesIndentUC.Location = new Point(3, 3);
            mdLinesIndentUC.Name = "mdLinesIndentUC";
            mdLinesIndentUC.Size = new Size(1786, 844);
            mdLinesIndentUC.TabIndex = 0;
            // 
            // mdTableLinesUC
            // 
            mdTableLinesUC.Dock = DockStyle.Fill;
            mdTableLinesUC.Location = new Point(3, 3);
            mdTableLinesUC.Name = "mdTableLinesUC";
            mdTableLinesUC.Size = new Size(1786, 844);
            mdTableLinesUC.TabIndex = 0;
            // 
            // MainForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1800, 900);
            Controls.Add(tabControlMain);
            Controls.Add(statusStripMain);
            Name = "MainForm";
            Text = "Turmerik Utility";
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            tabControlMain.ResumeLayout(false);
            tabPageFetchWebResource.ResumeLayout(false);
            tabPageMdLinesIndent.ResumeLayout(false);
            tabPageMdTableLines.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private StatusStrip statusStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
        private TabControl tabControlMain;
        private TabPage tabPageFetchWebResource;
        private TabPage tabPageMdLinesIndent;
        private TabPage tabPageMdTableLines;
        private UserControls.FetchWebResourceUC fetchWebResourceUC;
        private UserControls.MdLinesIndentUC mdLinesIndentUC;
        private ViewModels.MdTableLinesUC mdTableLinesUC;
    }
}
