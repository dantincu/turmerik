namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class TransformTextUC
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
            splitContainerMain = new SplitContainer();
            panelOptionControls = new Panel();
            splitContainerTextAreas = new SplitContainer();
            richTextBoxSrcText = new RichTextBox();
            panelSrcActionButtons = new Panel();
            iconLabelConvert = new WinForms.Controls.IconLabel();
            richTextBoxConvertedText = new RichTextBox();
            panelConvertedActionButtons = new Panel();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).BeginInit();
            splitContainerTextAreas.Panel1.SuspendLayout();
            splitContainerTextAreas.Panel2.SuspendLayout();
            splitContainerTextAreas.SuspendLayout();
            panelSrcActionButtons.SuspendLayout();
            SuspendLayout();
            // 
            // splitContainerMain
            // 
            splitContainerMain.Dock = DockStyle.Fill;
            splitContainerMain.Location = new Point(0, 0);
            splitContainerMain.Name = "splitContainerMain";
            splitContainerMain.Orientation = Orientation.Horizontal;
            // 
            // splitContainerMain.Panel1
            // 
            splitContainerMain.Panel1.Controls.Add(panelOptionControls);
            // 
            // splitContainerMain.Panel2
            // 
            splitContainerMain.Panel2.Controls.Add(splitContainerTextAreas);
            splitContainerMain.Size = new Size(1400, 600);
            splitContainerMain.SplitterDistance = 300;
            splitContainerMain.TabIndex = 0;
            // 
            // panelOptionControls
            // 
            panelOptionControls.AutoSize = true;
            panelOptionControls.AutoSizeMode = AutoSizeMode.GrowAndShrink;
            panelOptionControls.Dock = DockStyle.Top;
            panelOptionControls.Location = new Point(0, 0);
            panelOptionControls.Name = "panelOptionControls";
            panelOptionControls.Size = new Size(1400, 0);
            panelOptionControls.TabIndex = 1;
            // 
            // splitContainerTextAreas
            // 
            splitContainerTextAreas.Dock = DockStyle.Fill;
            splitContainerTextAreas.Location = new Point(0, 0);
            splitContainerTextAreas.Name = "splitContainerTextAreas";
            // 
            // splitContainerTextAreas.Panel1
            // 
            splitContainerTextAreas.Panel1.Controls.Add(richTextBoxSrcText);
            splitContainerTextAreas.Panel1.Controls.Add(panelSrcActionButtons);
            // 
            // splitContainerTextAreas.Panel2
            // 
            splitContainerTextAreas.Panel2.Controls.Add(richTextBoxConvertedText);
            splitContainerTextAreas.Panel2.Controls.Add(panelConvertedActionButtons);
            splitContainerTextAreas.Size = new Size(1400, 296);
            splitContainerTextAreas.SplitterDistance = 700;
            splitContainerTextAreas.TabIndex = 1;
            // 
            // richTextBoxSrcText
            // 
            richTextBoxSrcText.Dock = DockStyle.Fill;
            richTextBoxSrcText.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            richTextBoxSrcText.Location = new Point(0, 23);
            richTextBoxSrcText.Name = "richTextBoxSrcText";
            richTextBoxSrcText.Size = new Size(700, 273);
            richTextBoxSrcText.TabIndex = 0;
            richTextBoxSrcText.Text = "";
            // 
            // panelSrcActionButtons
            // 
            panelSrcActionButtons.Controls.Add(iconLabelConvert);
            panelSrcActionButtons.Dock = DockStyle.Top;
            panelSrcActionButtons.Location = new Point(0, 0);
            panelSrcActionButtons.Name = "panelSrcActionButtons";
            panelSrcActionButtons.Size = new Size(700, 23);
            panelSrcActionButtons.TabIndex = 1;
            // 
            // iconLabelConvert
            // 
            iconLabelConvert.AutoSize = true;
            iconLabelConvert.Dock = DockStyle.Right;
            iconLabelConvert.Location = new Point(686, 0);
            iconLabelConvert.Name = "iconLabelConvert";
            iconLabelConvert.Size = new Size(14, 15);
            iconLabelConvert.TabIndex = 0;
            iconLabelConvert.Text = "R";
            // 
            // richTextBoxConvertedText
            // 
            richTextBoxConvertedText.Dock = DockStyle.Fill;
            richTextBoxConvertedText.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            richTextBoxConvertedText.Location = new Point(0, 23);
            richTextBoxConvertedText.Name = "richTextBoxConvertedText";
            richTextBoxConvertedText.Size = new Size(696, 273);
            richTextBoxConvertedText.TabIndex = 1;
            richTextBoxConvertedText.Text = "";
            // 
            // panelConvertedActionButtons
            // 
            panelConvertedActionButtons.Dock = DockStyle.Top;
            panelConvertedActionButtons.Location = new Point(0, 0);
            panelConvertedActionButtons.Name = "panelConvertedActionButtons";
            panelConvertedActionButtons.Size = new Size(696, 23);
            panelConvertedActionButtons.TabIndex = 2;
            // 
            // TransformTextUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "TransformTextUC";
            Size = new Size(1400, 600);
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel1.PerformLayout();
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            splitContainerTextAreas.Panel1.ResumeLayout(false);
            splitContainerTextAreas.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).EndInit();
            splitContainerTextAreas.ResumeLayout(false);
            panelSrcActionButtons.ResumeLayout(false);
            panelSrcActionButtons.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private SplitContainer splitContainerMain;
        private SplitContainer splitContainerTextAreas;
        private RichTextBox richTextBoxSrcText;
        private RichTextBox richTextBoxConvertedText;
        private Panel panelOptionControls;
        private Panel panelSrcActionButtons;
        private Panel panelConvertedActionButtons;
        private WinForms.Controls.IconLabel iconLabelConvert;
    }
}
