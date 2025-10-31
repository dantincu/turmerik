namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class FetchMultipleLinksSetupUC
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
            buttonSerializeLinks = new Button();
            textBoxInput = new TextBox();
            panelTopControls.SuspendLayout();
            SuspendLayout();
            // 
            // panelTopControls
            // 
            panelTopControls.Controls.Add(buttonSerializeLinks);
            panelTopControls.Dock = DockStyle.Top;
            panelTopControls.Location = new Point(0, 0);
            panelTopControls.Name = "panelTopControls";
            panelTopControls.Size = new Size(1600, 30);
            panelTopControls.TabIndex = 0;
            // 
            // buttonSerializeLinks
            // 
            buttonSerializeLinks.Dock = DockStyle.Left;
            buttonSerializeLinks.Location = new Point(0, 0);
            buttonSerializeLinks.Name = "buttonSerializeLinks";
            buttonSerializeLinks.Size = new Size(47, 30);
            buttonSerializeLinks.TabIndex = 0;
            buttonSerializeLinks.Text = "&Go";
            buttonSerializeLinks.UseVisualStyleBackColor = true;
            buttonSerializeLinks.Click += ButtonLoad_Click;
            // 
            // textBoxInput
            // 
            textBoxInput.Dock = DockStyle.Fill;
            textBoxInput.Location = new Point(0, 30);
            textBoxInput.Multiline = true;
            textBoxInput.Name = "textBoxInput";
            textBoxInput.Size = new Size(1600, 770);
            textBoxInput.TabIndex = 1;
            // 
            // FetchMultipleLinksSetupUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(textBoxInput);
            Controls.Add(panelTopControls);
            Name = "FetchMultipleLinksSetupUC";
            Size = new Size(1600, 800);
            Load += FetchMultipleLinksSetupUC_Load;
            panelTopControls.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Panel panelTopControls;
        private Button buttonSerializeLinks;
        private TextBox textBoxInput;
    }
}
