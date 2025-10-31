namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class FetchLinkTextItemUC
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
            textBoxMain = new TextBox();
            SuspendLayout();
            // 
            // textBoxMain
            // 
            textBoxMain.Dock = DockStyle.Fill;
            textBoxMain.Location = new Point(0, 0);
            textBoxMain.Multiline = true;
            textBoxMain.Name = "textBoxMain";
            textBoxMain.Size = new Size(1000, 800);
            textBoxMain.TabIndex = 0;
            // 
            // FetchLinkTextItemUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(textBoxMain);
            Name = "FetchLinkTextItemUC";
            Size = new Size(1000, 800);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private TextBox textBoxMain;
    }
}
