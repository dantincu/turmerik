namespace Turmerik.LocalFileNotes.WinFormsApp.UserControls.Pages
{
    partial class AppHomePageUC
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
            panelTopControls = new Panel();
            iconLabelGoToFileExplorer = new WinForms.Controls.IconLabel();
            panelTopControls.SuspendLayout();
            SuspendLayout();
            // 
            // panelTopControls
            // 
            panelTopControls.Controls.Add(iconLabelGoToFileExplorer);
            panelTopControls.Dock = DockStyle.Top;
            panelTopControls.Location = new Point(0, 0);
            panelTopControls.Name = "panelTopControls";
            panelTopControls.Size = new Size(1800, 25);
            panelTopControls.TabIndex = 0;
            // 
            // iconLabelGoToFileExplorer
            // 
            iconLabelGoToFileExplorer.AutoSize = true;
            iconLabelGoToFileExplorer.Location = new Point(8, 6);
            iconLabelGoToFileExplorer.Name = "iconLabelGoToFileExplorer";
            iconLabelGoToFileExplorer.Size = new Size(15, 15);
            iconLabelGoToFileExplorer.TabIndex = 0;
            iconLabelGoToFileExplorer.Text = "G";
            iconLabelGoToFileExplorer.Click += IconLabelGoToFileExplorer_Click;
            // 
            // AppHomePageUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(panelTopControls);
            Name = "AppHomePageUC";
            Size = new Size(1800, 850);
            Load += AppHomePageUC_Load;
            panelTopControls.ResumeLayout(false);
            panelTopControls.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private Panel panelTopControls;
        private WinForms.Controls.IconLabel iconLabelGoToFileExplorer;
    }
}
