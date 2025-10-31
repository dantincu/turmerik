namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class UrlScriptUC
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
            labelIndex = new Label();
            textBoxScript = new TextBox();
            SuspendLayout();
            // 
            // labelIndex
            // 
            labelIndex.AutoSize = true;
            labelIndex.Dock = DockStyle.Left;
            labelIndex.Location = new Point(0, 0);
            labelIndex.Name = "labelIndex";
            labelIndex.Padding = new Padding(3);
            labelIndex.Size = new Size(25, 21);
            labelIndex.TabIndex = 0;
            labelIndex.Text = "00";
            // 
            // textBoxScript
            // 
            textBoxScript.Dock = DockStyle.Fill;
            textBoxScript.Location = new Point(25, 0);
            textBoxScript.Multiline = true;
            textBoxScript.Name = "textBoxScript";
            textBoxScript.Size = new Size(375, 100);
            textBoxScript.TabIndex = 1;
            // 
            // UrlScriptUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(textBoxScript);
            Controls.Add(labelIndex);
            Name = "UrlScriptUC";
            Size = new Size(400, 100);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label labelIndex;
        private TextBox textBoxScript;
    }
}
