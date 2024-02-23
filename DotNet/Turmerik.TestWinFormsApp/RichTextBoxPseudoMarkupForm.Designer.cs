namespace Turmerik.TestWinFormsApp
{
    partial class RichTextBoxPseudoMarkupForm
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
            splitContainerMain = new SplitContainer();
            splitContainerSrcText = new SplitContainer();
            richTextBoxSrcRichText = new RichTextBox();
            panelSrcTextBoxTopControls = new Panel();
            buttonRun = new Button();
            richTextBoxConvertedRichText = new RichTextBox();
            richTextBoxResultJson = new RichTextBox();
            statusStripMain = new StatusStrip();
            toolStripStatusLabelMain = new ToolStripStatusLabel();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerSrcText).BeginInit();
            splitContainerSrcText.Panel1.SuspendLayout();
            splitContainerSrcText.Panel2.SuspendLayout();
            splitContainerSrcText.SuspendLayout();
            panelSrcTextBoxTopControls.SuspendLayout();
            statusStripMain.SuspendLayout();
            SuspendLayout();
            // 
            // splitContainerMain
            // 
            splitContainerMain.Dock = DockStyle.Fill;
            splitContainerMain.Location = new Point(0, 0);
            splitContainerMain.Name = "splitContainerMain";
            // 
            // splitContainerMain.Panel1
            // 
            splitContainerMain.Panel1.Controls.Add(splitContainerSrcText);
            // 
            // splitContainerMain.Panel2
            // 
            splitContainerMain.Panel2.Controls.Add(richTextBoxResultJson);
            splitContainerMain.Size = new Size(1083, 676);
            splitContainerMain.SplitterDistance = 541;
            splitContainerMain.TabIndex = 0;
            // 
            // splitContainerSrcText
            // 
            splitContainerSrcText.Dock = DockStyle.Fill;
            splitContainerSrcText.Location = new Point(0, 0);
            splitContainerSrcText.Name = "splitContainerSrcText";
            splitContainerSrcText.Orientation = Orientation.Horizontal;
            // 
            // splitContainerSrcText.Panel1
            // 
            splitContainerSrcText.Panel1.Controls.Add(richTextBoxSrcRichText);
            splitContainerSrcText.Panel1.Controls.Add(panelSrcTextBoxTopControls);
            // 
            // splitContainerSrcText.Panel2
            // 
            splitContainerSrcText.Panel2.Controls.Add(richTextBoxConvertedRichText);
            splitContainerSrcText.Size = new Size(541, 676);
            splitContainerSrcText.SplitterDistance = 338;
            splitContainerSrcText.TabIndex = 1;
            // 
            // richTextBoxSrcRichText
            // 
            richTextBoxSrcRichText.Dock = DockStyle.Fill;
            richTextBoxSrcRichText.Location = new Point(0, 23);
            richTextBoxSrcRichText.Name = "richTextBoxSrcRichText";
            richTextBoxSrcRichText.Size = new Size(541, 315);
            richTextBoxSrcRichText.TabIndex = 1;
            richTextBoxSrcRichText.Text = "";
            // 
            // panelSrcTextBoxTopControls
            // 
            panelSrcTextBoxTopControls.Controls.Add(buttonRun);
            panelSrcTextBoxTopControls.Dock = DockStyle.Top;
            panelSrcTextBoxTopControls.Location = new Point(0, 0);
            panelSrcTextBoxTopControls.Name = "panelSrcTextBoxTopControls";
            panelSrcTextBoxTopControls.Size = new Size(541, 23);
            panelSrcTextBoxTopControls.TabIndex = 0;
            // 
            // buttonRun
            // 
            buttonRun.Dock = DockStyle.Right;
            buttonRun.Location = new Point(503, 0);
            buttonRun.Name = "buttonRun";
            buttonRun.Size = new Size(38, 23);
            buttonRun.TabIndex = 0;
            buttonRun.Text = "Run";
            buttonRun.UseVisualStyleBackColor = true;
            buttonRun.Click += ButtonRun_Click;
            // 
            // richTextBoxConvertedRichText
            // 
            richTextBoxConvertedRichText.Dock = DockStyle.Fill;
            richTextBoxConvertedRichText.Location = new Point(0, 0);
            richTextBoxConvertedRichText.Name = "richTextBoxConvertedRichText";
            richTextBoxConvertedRichText.Size = new Size(541, 334);
            richTextBoxConvertedRichText.TabIndex = 2;
            richTextBoxConvertedRichText.Text = "";
            // 
            // richTextBoxResultJson
            // 
            richTextBoxResultJson.Dock = DockStyle.Fill;
            richTextBoxResultJson.Font = new Font("Consolas", 9F, FontStyle.Bold, GraphicsUnit.Point, 0);
            richTextBoxResultJson.Location = new Point(0, 0);
            richTextBoxResultJson.Name = "richTextBoxResultJson";
            richTextBoxResultJson.Size = new Size(538, 676);
            richTextBoxResultJson.TabIndex = 2;
            richTextBoxResultJson.Text = "";
            // 
            // statusStripMain
            // 
            statusStripMain.Items.AddRange(new ToolStripItem[] { toolStripStatusLabelMain });
            statusStripMain.Location = new Point(0, 676);
            statusStripMain.Name = "statusStripMain";
            statusStripMain.Size = new Size(1083, 22);
            statusStripMain.TabIndex = 3;
            // 
            // toolStripStatusLabelMain
            // 
            toolStripStatusLabelMain.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            toolStripStatusLabelMain.Name = "toolStripStatusLabelMain";
            toolStripStatusLabelMain.Size = new Size(0, 17);
            // 
            // RichTextBoxPseudoMarkupForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1083, 698);
            Controls.Add(splitContainerMain);
            Controls.Add(statusStripMain);
            Name = "RichTextBoxPseudoMarkupForm";
            Text = "RichTextBoxPseudoMarkupForm";
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            splitContainerSrcText.Panel1.ResumeLayout(false);
            splitContainerSrcText.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerSrcText).EndInit();
            splitContainerSrcText.ResumeLayout(false);
            panelSrcTextBoxTopControls.ResumeLayout(false);
            statusStripMain.ResumeLayout(false);
            statusStripMain.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private SplitContainer splitContainerMain;
        private SplitContainer splitContainerSrcText;
        private Panel panelSrcTextBoxTopControls;
        private Button buttonRun;
        private StatusStrip statusStripMain;
        private ToolStripStatusLabel toolStripStatusLabelMain;
        private RichTextBox richTextBoxSrcRichText;
        private RichTextBox richTextBoxConvertedRichText;
        private RichTextBox richTextBoxResultJson;
    }
}