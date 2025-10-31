namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class OpenMultipleLinksUC
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
            btnOpenLinks = new Button();
            textBoxLinks = new TextBox();
            panelTop = new Panel();
            btnFixNewLines = new Button();
            panelTop.SuspendLayout();
            SuspendLayout();
            // 
            // btnOpenLinks
            // 
            btnOpenLinks.Dock = DockStyle.Left;
            btnOpenLinks.Location = new Point(0, 0);
            btnOpenLinks.Name = "btnOpenLinks";
            btnOpenLinks.Size = new Size(72, 25);
            btnOpenLinks.TabIndex = 0;
            btnOpenLinks.Text = "Open";
            btnOpenLinks.UseVisualStyleBackColor = true;
            btnOpenLinks.Click += BtnOpenLinks_Click;
            // 
            // textBoxLinks
            // 
            textBoxLinks.Dock = DockStyle.Fill;
            textBoxLinks.Location = new Point(0, 25);
            textBoxLinks.Multiline = true;
            textBoxLinks.Name = "textBoxLinks";
            textBoxLinks.ScrollBars = ScrollBars.Vertical;
            textBoxLinks.Size = new Size(752, 403);
            textBoxLinks.TabIndex = 1;
            textBoxLinks.WordWrap = false;
            // 
            // panelTop
            // 
            panelTop.Controls.Add(btnFixNewLines);
            panelTop.Controls.Add(btnOpenLinks);
            panelTop.Dock = DockStyle.Top;
            panelTop.Location = new Point(0, 0);
            panelTop.Name = "panelTop";
            panelTop.Size = new Size(752, 25);
            panelTop.TabIndex = 2;
            // 
            // btnFixNewLines
            // 
            btnFixNewLines.Dock = DockStyle.Left;
            btnFixNewLines.Location = new Point(127, 0);
            btnFixNewLines.Name = "btnFixNewLines";
            btnFixNewLines.Size = new Size(129, 25);
            btnFixNewLines.TabIndex = 1;
            btnFixNewLines.Text = "Fix new lines";
            btnFixNewLines.UseVisualStyleBackColor = true;
            btnFixNewLines.Click += BtnFixNewLines_Click;
            // 
            // OpenMultipleLinksUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(textBoxLinks);
            Controls.Add(panelTop);
            Name = "OpenMultipleLinksUC";
            Size = new Size(752, 428);
            panelTop.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Button btnOpenLinks;
        private TextBox textBoxLinks;
        private Panel panelTop;
        private Button btnFixNewLines;
    }
}
