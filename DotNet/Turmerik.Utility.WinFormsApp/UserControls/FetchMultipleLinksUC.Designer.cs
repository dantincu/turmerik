namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class FetchMultipleLinksUC
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
            fetchMultipleLinksSetupuc1 = new FetchMultipleLinksSetupUC();
            fetchMultipleLinksMainuc1 = new FetchMultipleLinksMainUC();
            SuspendLayout();
            // 
            // fetchMultipleLinksSetupuc1
            // 
            fetchMultipleLinksSetupuc1.Dock = DockStyle.Fill;
            fetchMultipleLinksSetupuc1.Location = new Point(0, 0);
            fetchMultipleLinksSetupuc1.Name = "fetchMultipleLinksSetupuc1";
            fetchMultipleLinksSetupuc1.Size = new Size(1600, 800);
            fetchMultipleLinksSetupuc1.TabIndex = 0;
            fetchMultipleLinksSetupuc1.Visible = false;
            fetchMultipleLinksSetupuc1.SetupFinished += FetchMultipleLinksSetupuc1_SetupFinished;
            // 
            // fetchMultipleLinksMainuc1
            // 
            fetchMultipleLinksMainuc1.Dock = DockStyle.Fill;
            fetchMultipleLinksMainuc1.Location = new Point(0, 0);
            fetchMultipleLinksMainuc1.Name = "fetchMultipleLinksMainuc1";
            fetchMultipleLinksMainuc1.Size = new Size(1600, 800);
            fetchMultipleLinksMainuc1.TabIndex = 1;
            fetchMultipleLinksMainuc1.Visible = false;
            fetchMultipleLinksMainuc1.ResetFinished += FetchMultipleLinksMainuc1_ResetFinished;
            // 
            // FetchMultipleLinksUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(fetchMultipleLinksMainuc1);
            Controls.Add(fetchMultipleLinksSetupuc1);
            Name = "FetchMultipleLinksUC";
            Size = new Size(1600, 800);
            Load += FetchMultipleLinksUC_Load;
            ResumeLayout(false);
        }

        #endregion

        private FetchMultipleLinksSetupUC fetchMultipleLinksSetupuc1;
        private FetchMultipleLinksMainUC fetchMultipleLinksMainuc1;
    }
}
