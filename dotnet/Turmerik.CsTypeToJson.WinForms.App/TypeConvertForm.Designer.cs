namespace Turmerik.CsTypeToJson.WinForms.App
{
    partial class TypeConvertForm
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

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.groupBoxControls = new System.Windows.Forms.GroupBox();
            this.buttonGenerate = new System.Windows.Forms.Button();
            this.panelStatusStrip = new System.Windows.Forms.Panel();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.toolStripStatusLabel = new System.Windows.Forms.ToolStripStatusLabel();
            this.panelJsonTextBox = new System.Windows.Forms.Panel();
            this.splitContainer1 = new System.Windows.Forms.SplitContainer();
            this.textBoxJson = new System.Windows.Forms.TextBox();
            this.textBoxPropDefs = new System.Windows.Forms.TextBox();
            this.groupBoxControls.SuspendLayout();
            this.panelStatusStrip.SuspendLayout();
            this.statusStrip.SuspendLayout();
            this.panelJsonTextBox.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
            this.splitContainer1.Panel1.SuspendLayout();
            this.splitContainer1.Panel2.SuspendLayout();
            this.splitContainer1.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBoxControls
            // 
            this.groupBoxControls.Controls.Add(this.buttonGenerate);
            this.groupBoxControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBoxControls.Location = new System.Drawing.Point(0, 0);
            this.groupBoxControls.Name = "groupBoxControls";
            this.groupBoxControls.Size = new System.Drawing.Size(800, 47);
            this.groupBoxControls.TabIndex = 1;
            this.groupBoxControls.TabStop = false;
            this.groupBoxControls.Text = "Json";
            // 
            // buttonGenerate
            // 
            this.buttonGenerate.Location = new System.Drawing.Point(6, 18);
            this.buttonGenerate.Name = "buttonGenerate";
            this.buttonGenerate.Size = new System.Drawing.Size(75, 23);
            this.buttonGenerate.TabIndex = 0;
            this.buttonGenerate.Text = "Generate";
            this.buttonGenerate.UseVisualStyleBackColor = true;
            this.buttonGenerate.Click += new System.EventHandler(this.ButtonGenerate_Click);
            // 
            // panelStatusStrip
            // 
            this.panelStatusStrip.Controls.Add(this.statusStrip);
            this.panelStatusStrip.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.panelStatusStrip.Location = new System.Drawing.Point(0, 426);
            this.panelStatusStrip.Name = "panelStatusStrip";
            this.panelStatusStrip.Size = new System.Drawing.Size(800, 24);
            this.panelStatusStrip.TabIndex = 3;
            // 
            // statusStrip
            // 
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripStatusLabel});
            this.statusStrip.Location = new System.Drawing.Point(0, 2);
            this.statusStrip.Name = "statusStrip";
            this.statusStrip.Size = new System.Drawing.Size(800, 22);
            this.statusStrip.TabIndex = 0;
            this.statusStrip.Text = "statusStrip1";
            // 
            // toolStripStatusLabel
            // 
            this.toolStripStatusLabel.Name = "toolStripStatusLabel";
            this.toolStripStatusLabel.Size = new System.Drawing.Size(112, 17);
            this.toolStripStatusLabel.Text = "toolStripStatusLabel";
            // 
            // panelJsonTextBox
            // 
            this.panelJsonTextBox.Controls.Add(this.splitContainer1);
            this.panelJsonTextBox.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelJsonTextBox.Location = new System.Drawing.Point(0, 47);
            this.panelJsonTextBox.Name = "panelJsonTextBox";
            this.panelJsonTextBox.Size = new System.Drawing.Size(800, 379);
            this.panelJsonTextBox.TabIndex = 4;
            // 
            // splitContainer1
            // 
            this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainer1.Location = new System.Drawing.Point(0, 0);
            this.splitContainer1.Name = "splitContainer1";
            // 
            // splitContainer1.Panel1
            // 
            this.splitContainer1.Panel1.Controls.Add(this.textBoxJson);
            // 
            // splitContainer1.Panel2
            // 
            this.splitContainer1.Panel2.Controls.Add(this.textBoxPropDefs);
            this.splitContainer1.Size = new System.Drawing.Size(800, 379);
            this.splitContainer1.SplitterDistance = 408;
            this.splitContainer1.TabIndex = 0;
            // 
            // textBoxJson
            // 
            this.textBoxJson.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxJson.Location = new System.Drawing.Point(0, 0);
            this.textBoxJson.Multiline = true;
            this.textBoxJson.Name = "textBoxJson";
            this.textBoxJson.Size = new System.Drawing.Size(408, 379);
            this.textBoxJson.TabIndex = 0;
            // 
            // textBoxPropDefs
            // 
            this.textBoxPropDefs.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxPropDefs.Location = new System.Drawing.Point(0, 0);
            this.textBoxPropDefs.Multiline = true;
            this.textBoxPropDefs.Name = "textBoxPropDefs";
            this.textBoxPropDefs.Size = new System.Drawing.Size(388, 379);
            this.textBoxPropDefs.TabIndex = 1;
            // 
            // TypeConvertForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.panelJsonTextBox);
            this.Controls.Add(this.panelStatusStrip);
            this.Controls.Add(this.groupBoxControls);
            this.Name = "TypeConvertForm";
            this.Text = "Data type json";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.groupBoxControls.ResumeLayout(false);
            this.panelStatusStrip.ResumeLayout(false);
            this.panelStatusStrip.PerformLayout();
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.panelJsonTextBox.ResumeLayout(false);
            this.splitContainer1.Panel1.ResumeLayout(false);
            this.splitContainer1.Panel1.PerformLayout();
            this.splitContainer1.Panel2.ResumeLayout(false);
            this.splitContainer1.Panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
            this.splitContainer1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.GroupBox groupBoxControls;
        private System.Windows.Forms.Button buttonGenerate;
        private System.Windows.Forms.Panel panelStatusStrip;
        private System.Windows.Forms.Panel panelJsonTextBox;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel;
        private System.Windows.Forms.SplitContainer splitContainer1;
        private System.Windows.Forms.TextBox textBoxJson;
        private System.Windows.Forms.TextBox textBoxPropDefs;
    }
}