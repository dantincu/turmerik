namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class TextUtilsUC
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
            fetchWebResourceUC = new FetchWebResourceUC();
            groupBoxFetchResource = new GroupBox();
            groupBoxFetchResource.SuspendLayout();
            SuspendLayout();
            // 
            // fetchWebResourceUC
            // 
            fetchWebResourceUC.Dock = DockStyle.Fill;
            fetchWebResourceUC.ForeColor = Color.Black;
            fetchWebResourceUC.Location = new Point(3, 19);
            fetchWebResourceUC.Name = "fetchWebResourceUC";
            fetchWebResourceUC.Size = new Size(1594, 70);
            fetchWebResourceUC.TabIndex = 0;
            // 
            // groupBoxFetchResource
            // 
            groupBoxFetchResource.Controls.Add(fetchWebResourceUC);
            groupBoxFetchResource.Dock = DockStyle.Top;
            groupBoxFetchResource.ForeColor = Color.FromArgb(0, 0, 64);
            groupBoxFetchResource.Location = new Point(0, 0);
            groupBoxFetchResource.Name = "groupBoxFetchResource";
            groupBoxFetchResource.Size = new Size(1600, 92);
            groupBoxFetchResource.TabIndex = 0;
            groupBoxFetchResource.TabStop = false;
            groupBoxFetchResource.Text = "Fetch Resource";
            // 
            // TextUtilsUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(groupBoxFetchResource);
            Name = "TextUtilsUC";
            Size = new Size(1600, 800);
            groupBoxFetchResource.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion
        private FetchWebResourceUC fetchWebResourceUC;
        private GroupBox groupBoxFetchResource;
    }
}
