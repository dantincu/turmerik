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
            tabPageMdLinesIndent = new TabPage();
            mdLinesIndentUC = new UserControls.MdLinesIndentUC();
            tabPageMdTableLines = new TabPage();
            mdTableLinesUC = new ViewModels.MdTableLinesUC();
            statusStripMain.SuspendLayout();
            tabControlMain.SuspendLayout();
            tabPageTextUtils.SuspendLayout();
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
            tabControlMain.Controls.Add(tabPageTextUtils);
            tabControlMain.Controls.Add(tabPageMdLinesIndent);
            tabControlMain.Controls.Add(tabPageMdTableLines);
            tabControlMain.Dock = DockStyle.Fill;
            tabControlMain.Location = new Point(0, 0);
            tabControlMain.Name = "tabControlMain";
            tabControlMain.SelectedIndex = 0;
            tabControlMain.Size = new Size(1800, 878);
            tabControlMain.TabIndex = 2;
            // 
            // tabPageTextUtils
            // 
            tabPageTextUtils.Controls.Add(textUtilsUC);
            tabPageTextUtils.Location = new Point(4, 24);
            tabPageTextUtils.Name = "tabPageTextUtils";
            tabPageTextUtils.Padding = new Padding(3);
            tabPageTextUtils.Size = new Size(1792, 850);
            tabPageTextUtils.TabIndex = 0;
            tabPageTextUtils.Text = "Text Utils";
            tabPageTextUtils.UseVisualStyleBackColor = true;
            // 
            // fetchWebResourceUC
            // 
            textUtilsUC.Dock = DockStyle.Fill;
            textUtilsUC.Location = new Point(3, 3);
            textUtilsUC.Name = "textUtilsUC";
            textUtilsUC.Size = new Size(1786, 844);
            textUtilsUC.TabIndex = 0;
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
            // mdLinesIndentUC
            // 
            mdLinesIndentUC.Dock = DockStyle.Fill;
            mdLinesIndentUC.Location = new Point(3, 3);
            mdLinesIndentUC.Name = "mdLinesIndentUC";
            mdLinesIndentUC.Size = new Size(1786, 844);
            mdLinesIndentUC.TabIndex = 0;
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
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Turmerik Utility";
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            tabControlMain.ResumeLayout(false);
            tabPageTextUtils.ResumeLayout(false);
            tabPageMdLinesIndent.ResumeLayout(false);
            tabPageMdTableLines.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private StatusStrip statusStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
        private TabControl tabControlMain;
        private TabPage tabPageTextUtils;
        private TabPage tabPageMdLinesIndent;
        private TabPage tabPageMdTableLines;
        private UserControls.TextUtilsUC textUtilsUC;
        private UserControls.MdLinesIndentUC mdLinesIndentUC;
        private ViewModels.MdTableLinesUC mdTableLinesUC;
    }
}
