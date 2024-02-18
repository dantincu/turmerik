namespace Turmerik.Utility.WinFormsApp.UserControls
{
    partial class TextTransformUC
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
            richTextBoxResultText = new RichTextBox();
            splitContainerTextAreas = new SplitContainer();
            richTextBoxSrcText = new RichTextBox();
            splitContainerMain = new SplitContainer();
            splitContainerTransformers = new SplitContainer();
            treeViewTransformers = new TreeView();
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).BeginInit();
            splitContainerTextAreas.Panel1.SuspendLayout();
            splitContainerTextAreas.Panel2.SuspendLayout();
            splitContainerTextAreas.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).BeginInit();
            splitContainerMain.Panel1.SuspendLayout();
            splitContainerMain.Panel2.SuspendLayout();
            splitContainerMain.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)splitContainerTransformers).BeginInit();
            splitContainerTransformers.Panel1.SuspendLayout();
            splitContainerTransformers.SuspendLayout();
            SuspendLayout();
            // 
            // richTextBoxResultText
            // 
            richTextBoxResultText.AcceptsTab = true;
            richTextBoxResultText.Dock = DockStyle.Fill;
            richTextBoxResultText.Font = new Font("Consolas", 9F, FontStyle.Bold);
            richTextBoxResultText.Location = new Point(0, 0);
            richTextBoxResultText.Name = "richTextBoxResultText";
            richTextBoxResultText.Size = new Size(796, 396);
            richTextBoxResultText.TabIndex = 0;
            richTextBoxResultText.TabStop = false;
            richTextBoxResultText.Text = "";
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
            // 
            // splitContainerTextAreas.Panel2
            // 
            splitContainerTextAreas.Panel2.Controls.Add(richTextBoxResultText);
            splitContainerTextAreas.Size = new Size(1600, 396);
            splitContainerTextAreas.SplitterDistance = 800;
            splitContainerTextAreas.TabIndex = 0;
            splitContainerTextAreas.TabStop = false;
            // 
            // richTextBoxSrcText
            // 
            richTextBoxSrcText.AcceptsTab = true;
            richTextBoxSrcText.Dock = DockStyle.Fill;
            richTextBoxSrcText.Font = new Font("Consolas", 9F, FontStyle.Bold);
            richTextBoxSrcText.Location = new Point(0, 0);
            richTextBoxSrcText.Name = "richTextBoxSrcText";
            richTextBoxSrcText.Size = new Size(800, 396);
            richTextBoxSrcText.TabIndex = 0;
            richTextBoxSrcText.TabStop = false;
            richTextBoxSrcText.Text = "";
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
            splitContainerMain.Panel1.Controls.Add(splitContainerTransformers);
            // 
            // splitContainerMain.Panel2
            // 
            splitContainerMain.Panel2.Controls.Add(splitContainerTextAreas);
            splitContainerMain.Size = new Size(1600, 800);
            splitContainerMain.SplitterDistance = 400;
            splitContainerMain.TabIndex = 1;
            splitContainerMain.TabStop = false;
            // 
            // splitContainerTransformers
            // 
            splitContainerTransformers.Dock = DockStyle.Fill;
            splitContainerTransformers.Location = new Point(0, 0);
            splitContainerTransformers.Name = "splitContainerTransformers";
            // 
            // splitContainerTransformers.Panel1
            // 
            splitContainerTransformers.Panel1.Controls.Add(treeViewTransformers);
            splitContainerTransformers.Size = new Size(1600, 400);
            splitContainerTransformers.SplitterDistance = 533;
            splitContainerTransformers.TabIndex = 0;
            // 
            // treeViewTransformers
            // 
            treeViewTransformers.Dock = DockStyle.Fill;
            treeViewTransformers.Location = new Point(0, 0);
            treeViewTransformers.Name = "treeViewTransformers";
            treeViewTransformers.Size = new Size(533, 400);
            treeViewTransformers.TabIndex = 0;
            // 
            // TextTransformUC
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            Controls.Add(splitContainerMain);
            Name = "TextTransformUC";
            Size = new Size(1600, 800);
            Load += TextTransformUC_Load;
            splitContainerTextAreas.Panel1.ResumeLayout(false);
            splitContainerTextAreas.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerTextAreas).EndInit();
            splitContainerTextAreas.ResumeLayout(false);
            splitContainerMain.Panel1.ResumeLayout(false);
            splitContainerMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerMain).EndInit();
            splitContainerMain.ResumeLayout(false);
            splitContainerTransformers.Panel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)splitContainerTransformers).EndInit();
            splitContainerTransformers.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private RichTextBox richTextBoxResultText;
        private SplitContainer splitContainerTextAreas;
        private RichTextBox richTextBoxSrcText;
        private SplitContainer splitContainerMain;
        private SplitContainer splitContainerTransformers;
        private TreeView treeViewTransformers;
    }
}
