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
            richTextBoxScript = new RichTextBox();
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
            // richTextBoxScript
            // 
            richTextBoxScript.Dock = DockStyle.Fill;
            richTextBoxScript.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            richTextBoxScript.Location = new Point(25, 0);
            richTextBoxScript.Name = "richTextBoxScript";
            richTextBoxScript.Size = new Size(375, 80);
            richTextBoxScript.TabIndex = 1;
            richTextBoxScript.Text = "";
            richTextBoxScript.KeyDown += RichTextBoxScript_KeyDown;
            // 
            // UrlScriptUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(richTextBoxScript);
            Controls.Add(labelIndex);
            Name = "UrlScriptUC";
            Size = new Size(400, 80);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label labelIndex;
        private RichTextBox richTextBoxScript;
    }
}
